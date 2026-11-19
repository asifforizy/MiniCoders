import { z } from "zod";

import { Difficulty } from "../../../prisma/generated/prisma/enums";
import config from "../../config";

const languageSchema = z.enum(["python", "javascript", "cpp", "java"]);

const testCaseSchema = z.object({
  input: z
    .string()
    .max(config.max_custom_input_length, "Test case input is too long")
    .default(""),
  expectedOutput: z
    .string({ error: "Expected output is required" })
    .min(1, "Expected output is required")
    .max(config.max_custom_input_length, "Expected output is too long"),
  isPublic: z.boolean().optional(),
  explanation: z.string().max(2000).optional(),
  order: z.number().int().nonnegative().optional(),
});

const problemFields = {
  title: z
    .string({ error: "Title is required" })
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(150, "Title must be at most 150 characters"),
  description: z
    .string({ error: "Description is required" })
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(20000, "Description is too long"),
  difficulty: z.enum(Difficulty, {
    error: "Difficulty is required",
  }),
  points: z.number().int().positive().max(10000).optional(),
  number: z.number().int().positive().max(100000).optional(),
  topic: z.string().trim().max(100).optional(),
  inputFormat: z.string().max(5000).optional(),
  outputFormat: z.string().max(5000).optional(),
  constraints: z.string().max(5000).optional(),
  hints: z.array(z.string().max(1000)).max(20).optional(),
  starterCode: z.record(z.string(), z.string().max(20000)).optional(),
  supportedLanguages: z.array(languageSchema).max(4).optional(),
  timeLimit: z.number().positive().max(15).optional(),
  memoryLimit: z.number().int().min(16000).max(512000).optional(),
  isPublished: z.boolean().optional(),
  testCases: z.array(testCaseSchema).max(50).optional(),
};

const createProblem = z.object(problemFields);

const updateProblem = createProblem.partial();

export const problemValidation = { createProblem, updateProblem };
