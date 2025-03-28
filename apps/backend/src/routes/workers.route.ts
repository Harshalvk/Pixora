import { prisma } from "@repo/prisma/prismaClient";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { workerAuthMiddleware } from "../middlewares/auth.middleware.js";
import { getNextTask } from "../lib/db.js";
import { createSubmissonInputSchema } from "@repo/types/userTypes";

const router = Router();

const TOTAL_SUB = 100;

router.post("/submission", workerAuthMiddleware, async (req, res) => {
  const userId = req.user?.id;
  const parsedBody = createSubmissonInputSchema.safeParse(req.body);

  if (parsedBody.success) {
    if (!userId) {
      res.json({
        err: "Provide valid userId",
      });
      return;
    }

    const task = await getNextTask(userId);

    if (!task || task?.id !== Number(parsedBody.data.taskId)) {
      res.status(411).json({
        msg: "Incorrect taskId",
      });
      return;
    }

    const amount = (Number(task.amount) / TOTAL_SUB).toString();

    await prisma.$transaction(async (tx) => {
      const submission = await prisma.submission.create({
        data: {
          optionId: Number(parsedBody.data.selection),
          workerId: userId,
          taskId: Number(parsedBody.data.taskId),
          amount: (Number(task.amount) / TOTAL_SUB).toString(),
        },
      });

      await prisma.worker.update({
        where: {
          id: userId,
        },
        data: {
          pendingAmount: {
            increment: Number(amount),
          },
        },
      });

      return submission;
    });

    const nextTask = await getNextTask(Number(userId));

    res.json({
      nextTask,
      amount,
    });
  } else {
    res.status(411).json({
      err: "Submission failed",
    });
    return;
  }
});

router.get("/nextTask", workerAuthMiddleware, async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    res.json({
      err: "Provide valid userId",
    });
    return;
  }

  const task = await getNextTask(userId);

  if (!task) {
    res.status(411).json({
      msg: "No more tasks left for you to review",
    });
  } else {
    res.status(200).json({
      task,
    });
  }
});

router.post("/signin", async (req, res) => {
  const hardcodedAddress = "H5VW6DHRWkXSRLMjCPHtvWb8nQxBnajDNzV2vVeTHYNNB";

  const user = await prisma.worker.findFirst({
    where: {
      address: hardcodedAddress,
    },
  });

  if (user) {
    const token = jwt.sign(
      {
        userId: user.id,
      },
      process.env.WORKER_JWT_SECRET!
    );

    res.json({
      token,
    });
  } else {
    const user = await prisma.worker.create({
      data: {
        address: hardcodedAddress,
        lockedAmount: 0,
        pendingAmount: 0,
      },
    });

    const token = jwt.sign(
      {
        userId: user.id,
      },
      process.env.WORKER_JWT_SECRET!
    );

    res.json({
      token,
    });
  }
});

export default router;
