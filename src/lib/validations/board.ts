import { z } from "zod";

export const createBoardSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(120),
});

export const updateBoardSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(120),
});
