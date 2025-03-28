import { prisma } from "@repo/prisma/prismaClient";

export const getNextTask = async (userId: number) => {
  const task = await prisma.task.findFirst({
    where: {
      done: false,
      submissions: {
        none: {
          workerId: userId,
        },
      },
    },
    select: {
      id: true,
      title: true,
      amount: true,
      options: true,
    },
  });

  return task;
};
