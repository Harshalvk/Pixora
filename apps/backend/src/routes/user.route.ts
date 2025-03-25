import { Request, Response, Router, urlencoded } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "@repo/prisma/prismaClient";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import * as Minio from "minio";

const router = Router();

router.post("/sigin", async (req, res) => {
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
    const userId = req.user?.id;
    const fileName = req.params.filename;

    const url = await minioClient.presignedPutObject("pixora", `${fileName}`);

    res.send({
      url,
    });
  }
);

export default router;
