import { z } from "zod";

export const bookSchema = z.object({
  title: z
    .string({ error: "A book needs a title" })
    .min(1, "A book needs a title")
    .max(100),
  author: z.string().min(1).max(100),
  year: z.number().int().min(1000).max(2100),
  author_id: z.number().int().positive(),
});

export const bookPatchSchema = bookSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  {
    message: "At least one field must be provided",
  }
);

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export type Book = z.infer<typeof bookSchema> & {
  id: number;
};

export const bookQuerySchema = z.object({
  author: z.string().optional(),
  sort: z.enum(["title", "author", "year"]).optional(),
});