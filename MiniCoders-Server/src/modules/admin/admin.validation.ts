// problem.validation.ts
import { z } from "zod";
import { Difficulty } from "@prisma/client";

const createProblem = z.object({
  body: z.object({
    title: z
      .string({ required_error: "Title is required" })
      .trim()
      .min(3, "Title must be at least 3 characters")
      .max(150, "Title must be at most 150 characters"),
    description: z
      .string({ required_error: "Description is required" })
      .trim()
      .min(10, "Description must be at least 10 characters"),
    difficulty: z.nativeEnum(Difficulty, {
      required_error: "Difficulty is required",
    }),
    points: z.number().int().positive().max(10000).optional(),
  }),
});

export const problemValidation = { createProblem };
