export const SUPPORTED_LANGUAGES = [
  "python",
  "javascript",
  "cpp",
  "java",
] as const;

export type TLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const LANGUAGE_LABELS: Record<TLanguage, string> = {
  python: "Python",
  javascript: "JavaScript",
  cpp: "C++",
  java: "Java",
};

export type TJudge0Status = {
  id: number;
  description: string;
};

export type TJudge0Submission = {
  token?: string;
  stdout?: string | null;
  stderr?: string | null;
  compile_output?: string | null;
  message?: string | null;
  time?: string | number | null;
  memory?: number | null;
  status?: TJudge0Status | null;
};

export type TJudge0Execution = {
  token: string;
  statusId: number;
  status: string;
  stdout: string;
  stderr: string;
  compileOutput: string;
  message: string;
  time: number | null;
  memory: number | null;
};

export type TJudge0ExecutePayload = {
  sourceCode: string;
  language: TLanguage;
  stdin: string;
  timeLimit: number;
  memoryLimit: number;
};
