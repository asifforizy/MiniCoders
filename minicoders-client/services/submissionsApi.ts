"use server";

import { cookies } from "next/headers";

import type {
  CustomRunResult,
  Language,
  ProblemProgress,
  RunResult,
  SubmissionDetail,
  SubmissionsData,
  SubmitResult,
  UserProgress,
} from "@/utils/types";

const baseUrl = () => {
  const url = process.env.BACKEND_API_URL;

  if (!url) {
    throw new Error("BACKEND_API_URL is not configured");
  }

  return url;
};

async function accessToken(): Promise<string | null> {
  return (await cookies()).get("accessToken")?.value ?? null;
}

async function authedFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await accessToken();

  if (!token) {
    throw new Error("Please log in to run and submit code.");
  }

  const res = await fetch(`${baseUrl()}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Cookie: `accessToken=${token}`,
    },
    cache: "no-store",
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(json?.message ?? "Request failed");
  }

  return json.data as T;
}

async function optionalFetch<T>(path: string): Promise<T | null> {
  const token = await accessToken();

  if (!token) return null;

  const res = await fetch(`${baseUrl()}${path}`, {
    headers: { Cookie: `accessToken=${token}` },
    cache: "no-store",
  });

  if (!res.ok) return null;

  const json = await res.json().catch(() => null);
  return (json?.data as T) ?? null;
}

export async function runCode(payload: {
  problemId: string;
  language: Language;
  code: string;
}): Promise<RunResult> {
  return authedFetch<RunResult>("/api/v1/submissions/run", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function runCustomInput(payload: {
  problemId: string;
  language: Language;
  code: string;
  customInput: string;
}): Promise<CustomRunResult> {
  return authedFetch<CustomRunResult>("/api/v1/submissions/custom-input", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function submitSolution(payload: {
  problemId: string;
  language: Language;
  code: string;
}): Promise<SubmitResult> {
  return authedFetch<SubmitResult>("/api/v1/submissions/submit", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getMySubmissions(
  problemId?: string,
  page = 1,
  limit = 20
): Promise<SubmissionsData> {
  const qs = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (problemId) qs.set("problemId", problemId);

  return authedFetch<SubmissionsData>(
    `/api/v1/submissions?${qs.toString()}`
  );
}

export async function getSubmission(id: string): Promise<SubmissionDetail> {
  return authedFetch<SubmissionDetail>(
    `/api/v1/submissions/${encodeURIComponent(id)}`
  );
}

export async function getMyProgress(): Promise<UserProgress | null> {
  return optionalFetch<UserProgress>("/api/v1/progress");
}

export async function getProblemProgress(
  problemIdOrSlug: string
): Promise<ProblemProgress | null> {
  return optionalFetch<ProblemProgress>(
    `/api/v1/progress/${encodeURIComponent(problemIdOrSlug)}`
  );
}
