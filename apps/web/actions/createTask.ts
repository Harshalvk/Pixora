"use server";

import { createTaskInputSchema } from "@repo/types/userTypes";
import { waitFor } from "../lib/waitFor";

export async function CreateTask({
  taskTitle,
  images,
  token,
}: {
  taskTitle: string;
  images: { imageUrl: string }[];
  token: string;
}) {
  await waitFor(3000);
  try {
    if (!token) {
      return { msg: "Token required" };
    }

    const parsed = createTaskInputSchema.safeParse({
      title: taskTitle,
      options: images,
      signature: token,
    });

    const res = await fetch("http://localhost:5050/v1/user/task", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(parsed.data),
    });

    const task = await res.json();

    return task.id;
  } catch (error: any) {
    console.log("Error while creating task", error.message);
    return;
  }
}
