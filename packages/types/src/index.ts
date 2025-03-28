import { z } from "zod";

export const createTaskInputSchema = z.object({
  options: z.array(
    z.object({
      imageUrl: z.string(),
    })
  ),
  title: z.string().optional(),
  signature: z.string(),
});

export const createSubmissonInputSchema = z.object({
  taskId: z.string(),
  selection: z.string(),
});

export type User = z.infer<typeof createTaskInputSchema>;
export type SubmissionInput = z.infer<typeof createSubmissonInputSchema>;
