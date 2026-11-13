import { z } from "zod";
import { Difficulty } from "../../../prisma/generated/prisma/enums";

const createProblem = z.object({
  body: z.object({
    title: z
      .string({ error: "Title is required" })
      .trim()
      .min(3, "Title must be at least 3 characters")
      .max(150, "Title must be at most 150 characters"),
    description: z
      .string({ error: "Description is required" })
      .trim()
      .min(10, "Description must be at least 10 characters"),
    difficulty: z.enum(Difficulty, { 
      error: "Difficulty is required", 
    }),
    points: z.number().int().positive().max(10000).optional(),
  }),
});

export const problemValidation = { createProblem };