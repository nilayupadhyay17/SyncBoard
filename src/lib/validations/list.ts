import { z } from "zod";

export const createListSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(120),
});

export const updateListSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(120),
});
