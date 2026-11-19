import type { Difficulty } from "../../../prisma/generated/prisma/client";
import type { TLanguage } from "../judge0/judge0.interface";

export interface IUpdatedStatus {
  status?: "ACTIVE" | "BLOCKED" | "DELETED";
}

export type TAdminTestCasePayload = {
  input: string;
  expectedOutput: string;
  isPublic?: boolean;
  explanation?: string;
  order?: number;
};

export type TCreateProblemPayload = {
  title: string;
  description: string;
  difficulty: Difficulty;
  points?: number;
  number?: number;
  topic?: string;
  inputFormat?: string;
  outputFormat?: string;
  constraints?: string;
  hints?: string[];
  starterCode?: Partial<Record<TLanguage, string>>;
  supportedLanguages?: TLanguage[];
  timeLimit?: number;
  memoryLimit?: number;
  isPublished?: boolean;
  testCases?: TAdminTestCasePayload[];
};

export type TUpdateProblemPayload = Partial<TCreateProblemPayload>;
