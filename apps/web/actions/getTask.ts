"use server";

export async function GetTask({
  taskId,
  token,
}: {
  taskId: number;
  token: string;
}): Promise<{ count: number; option: { imageUrl: string } }[] | undefined> {
  if (!process.env.NEXT_PUBLIC_BACKEND_URL) return;

  const task = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/user/task?taskId=${taskId}`,
    {
      method: "GET",
      headers: {
        Authorization: token,
      },
    }
  );

  if (!task) {
    console.log(`Task with ID: ${taskId} not found`);
    return;
  }

  const awaited = await task.json();

  return awaited;
}
