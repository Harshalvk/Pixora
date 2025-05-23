import { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "@repo/prisma/prismaClient";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createTaskInputSchema } from "@repo/types/userTypes";
import * as Minio from "minio";
import { TOTAL_DECIMANLS } from "../lib/constants.js";

const router = Router();

router.post("/signin", async (req, res) => {
  // Todo: Add sign verification logic here
  const hardcodedAddress = "H5VW6DHRWkXSRLMjCPHtvWb8nQxBnajDNzV2vVeTHYNNB";

  const user = await prisma.user.findFirst({
    where: {
      address: hardcodedAddress,
    },
  });

  if (user) {
    const token = jwt.sign(
      {
        userId: user.id,
      },
      process.env.JWT_SECRET!
    );

    res.json({
      token,
    });
  } else {
    const user = await prisma.user.create({
      data: {
        address: hardcodedAddress,
      },
    });

    const token = jwt.sign(
      {
        userId: user.id,
      },
      process.env.JWT_SECRET!
    );

    res.json({
      token,
    });
  }
});

const minioClient = new Minio.Client({
  endPoint: "localhost",
  port: 9000,
  useSSL: false,
  accessKey: "pixora-client",
  secretKey: "123456789",
});

router.get(
  "/presignedUrl/:filename",
  authMiddleware,
  async (req: Request, res: Response) => {
    const fileName = req.params.filename;

    try {
      const url = await minioClient.presignedPutObject("pixora", `${fileName}`);

      res.send({
        url,
      });
    } catch (error) {
      res.send({ err: "file not uploaded" });
      return;
    }
  }
);

router.post("/task", authMiddleware, async (req: Request, res: Response) => {
  const body = req.body;
  const parseData = createTaskInputSchema.safeParse(body);
  console.log(parseData);

  if (!parseData.success) {
    res.status(411).json({
      msg: "You've sent the wrong inputs",
    });
    return;
  }

  if (!parseData.data) {
    res.status(411).json({
      msg: "Data not provided",
    });
    return;
  }

  //parse the signature here to ensure the person has paid $50

  const response = await prisma.$transaction(async (tx) => {
    const response = await tx.task.create({
      data: {
        title: parseData.data?.title || "Select the image which looks great",
        amount: 1 * TOTAL_DECIMANLS,
        signature: parseData.data?.signature || "laksdjf324029jhfaoweifjw0e9",
        userId: req.user!.id,
      },
    });

    await tx.option.createMany({
      data: parseData.data.options.map((x) => ({
        imageUrl: x.imageUrl,
        taskId: response.id,
      })),
    });

    return response;
  });

  res.json({
    id: response.id,
  });
});

router.get("/task", authMiddleware, async (req: Request, res: Response) => {
  const taskId = req.query.taskId;
  const userId = req.user?.id;

  const taskDetails = await prisma.task.findFirst({
    where: {
      id: Number(taskId),
      userId: Number(userId),
    },
    include: {
      options: true,
    },
  });

  if (!taskDetails) {
    res.status(411).json({
      msg: "You don't have access to this task",
    });
    return;
  }

  //todo: make this faster?
  const response = await prisma.submission.findMany({
    where: {
      taskId: Number(taskId),
    },
    include: {
      option: true,
    },
  });

  const result: Record<
    string,
    {
      count: number;
      option: {
        imageUrl: string;
      };
    }
  > = {};

  taskDetails.options.forEach((option) => {
    result[option.id] = {
      count: 1,
      option: {
        imageUrl: option.imageUrl,
      },
    };
  });

  response.forEach((r) => {
    if (!result[r.optionId]) {
      result[r.optionId] = {
        count: 0,
        option: {
          imageUrl: r.option.imageUrl,
        },
      };
    } else {
      result[r.optionId]!.count++;
    }
  });

  res.json({
    result,
  });
});

export default router;
