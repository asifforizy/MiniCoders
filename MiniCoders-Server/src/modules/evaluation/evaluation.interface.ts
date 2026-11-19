import type { SubmissionStatus } from "../../../prisma/generated/prisma/enums";
import type { TLanguage } from "../judge0/judge0.interface";

export type TEvaluationTestCase = {
  id: string;
  input: string;
  expectedOutput: string;
  isPublic: boolean;
  order: number;
};

export type TTestCaseResult = {
  order: number;
  isPublic: boolean;
  input?: string;
  expectedOutput?: string;
  actualOutput: string;
  passed: boolean;
  status: SubmissionStatus;
  time: number | null;
  memory: number | null;
  stderr: string;
  compileOutput: string;
};

export type TEvaluationResult = {
  verdict: SubmissionStatus;
  passed: number;
  total: number;
  time: number | null;
  memory: number | null;
  results: TTestCaseResult[];
  message: string;
};

export type TEvaluatePayload = {
  sourceCode: string;
  language: TLanguage;
  testCases: TEvaluationTestCase[];
  timeLimit: number;
  memoryLimit: number;
  includeHiddenDetails?: boolean;
};
