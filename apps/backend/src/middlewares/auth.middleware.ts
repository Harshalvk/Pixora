import { prisma } from "@repo/prisma/prismaClient";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers["authorization"];

  console.log("@@@@Authheader", authHeader);
  console.log("@@JWT-SECRET", process.env.JWT_SECRET!);

  if (!authHeader) {
    res.status(403).json({
      error: "auth header not provided",
    });
    return;
  }

  try {
    const decoded = jwt.verify(authHeader, process.env.JWT_SECRET!) as {
      userId: string;
    };

    console.log(Number(decoded.userId));

    if (!decoded.userId) {
      res.status(403).json({
        error: "Invalid token",
      });
      return;
    }

    const user = await prisma.user.findFirst({
      where: {
        id: Number(decoded.userId),
      },
    });

    if (!user) {
      res.status(403).json({
        error: "user does not exists",
      });
      return;
    }

    req.user = { id: user.id };

    next();
    return;
  } catch (error) {
    res.status(403).json({
      error: "you are not logged in",
    });
  }
}
