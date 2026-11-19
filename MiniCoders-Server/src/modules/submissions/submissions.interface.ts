import type { TLanguage } from "../judge0/judge0.interface";

export type TRunPayload = {
  problemId: string;
  language: TLanguage;
  code: string;
};

export type TCustomInputPayload = TRunPayload & {
  customInput: string;
};

export type TSubmitPayload = TRunPayload;

export type TSubmissionQuery = {
  problemId?: string;
  page?: string;
  limit?: string;
};
