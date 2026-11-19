import { z } from "zod";

import config from "../../config";

const languageSchema = z.enum(
  ["python", "javascript", "cpp", "java"],
  { error: "Unsupported programming language" }
);

const problemIdSchema = z
  .string({ error: "Problem is required" })
  .uuid("Invalid problem id");

const codeSchema = z
  .string({ error: "Source code is required" })
  .min(1, "Source code is required")
  .max(
    config.max_source_code_length,
    `Source code must be at most ${config.max_source_code_length} characters`
  );

const run = z.object({
  problemId: problemIdSchema,
  language: languageSchema,
  code: codeSchema,
});

const customInput = run.extend({
  customInput: z
    .string()
    .max(
      config.max_custom_input_length,
      `Custom input must be at most ${config.max_custom_input_length} characters`
    )
    .default(""),
});

const submit = run;

export const submissionValidation = {
  run,
  customInput,
  submit,
};
