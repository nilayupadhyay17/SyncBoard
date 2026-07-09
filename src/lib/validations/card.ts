import { z } from "zod";

export const createCardSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  description: z.string().trim().max(5000).optional().nullable(),
  dueDate: z.coerce.date().optional().nullable(),
});

export const updateCardSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200).optional(),
  description: z.string().trim().max(5000).optional().nullable(),
  dueDate: z.coerce.date().optional().nullable(),
});

export const moveCardSchema = z.object({
  listId: z.string().min(1),
  position: z.number().int().positive(),
});
