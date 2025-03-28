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

export type User = z.infer<typeof createTaskInputSchema>;
