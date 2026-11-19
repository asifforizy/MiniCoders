import httpStatus from "http-status";

import config from "../../config";
import { AppError } from "../../utils/AppError";
import {
  SUPPORTED_LANGUAGES,
  type TLanguage,
  type TJudge0Execution,
  type TJudge0Submission,
} from "./judge0.interface";

const apiBase = config.judge0_api_url.replace(/\/+$/, "");

const TERMINAL_STATUS_ID = 3;
const INTERNAL_ERROR_STATUS_ID = 13;

const LANGUAGE_PATTERNS: Record<TLanguage, RegExp> = {
  python: /^Python \(3/,
  javascript: /^JavaScript \(Node\.js/,
  cpp: /^C\+\+ \(GCC/,
  java: /^Java \((OpenJDK|JDK)/,
};

type TAvailableLanguage = { id: number; name: string };

let languageCache: { fetchedAt: number; languages: TAvailableLanguage[] } | null =
  null;

const LANGUAGE_CACHE_TTL_MS = 10 * 60 * 1000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const toBase64 = (value: string): string =>
  Buffer.from(value, "utf8").toString("base64");

const fromBase64 = (value: string | null | undefined): string =>
  value ? Buffer.from(value, "base64").toString("utf8") : "";

const buildHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (config.judge0_api_key && config.judge0_api_host) {
    headers["X-RapidAPI-Key"] = config.judge0_api_key;
    headers["X-RapidAPI-Host"] = config.judge0_api_host;
  } else if (config.judge0_api_key) {
    headers["X-Auth-Token"] = config.judge0_api_key;
  }

  return headers;
};

const judge0Fetch = async <T>(path: string, init?: RequestInit): Promise<T> => {
  let response: Response;

  try {
    response = await fetch(`${apiBase}${path}`, {
      ...init,
      headers: {
        ...buildHeaders(),
        ...(init?.headers as Record<string, string> | undefined),
      },
      cache: "no-store",
      signal: AbortSignal.timeout(30000),
    });
  } catch (error) {
    console.error("Judge0 request failed:", error);
    throw new AppError(
      httpStatus.BAD_GATEWAY,
      "The code execution service is unavailable. Please try again shortly."
    );
  }

  const raw = await response.text();
  let parsed: unknown = null;

  try {
    parsed = raw ? JSON.parse(raw) : null;
  } catch {
    parsed = null;
  }

  if (!response.ok) {
    console.error(
      "Judge0 error response:",
      response.status,
      raw.slice(0, 1000)
    );

    if (response.status === 429) {
      throw new AppError(
        httpStatus.TOO_MANY_REQUESTS,
        "The code execution service is busy. Please try again in a moment."
      );
    }

    throw new AppError(
      httpStatus.BAD_GATEWAY,
      "The code execution service could not process the request."
    );
  }

  return parsed as T;
};

const fetchAvailableLanguages = async (): Promise<
  TAvailableLanguage[] | null
> => {
  if (
    languageCache &&
    Date.now() - languageCache.fetchedAt < LANGUAGE_CACHE_TTL_MS
  ) {
    return languageCache.languages;
  }

  try {
    const languages = await judge0Fetch<TAvailableLanguage[]>("/languages");

    if (!Array.isArray(languages)) {
      return null;
    }

    languageCache = { fetchedAt: Date.now(), languages };
    return languages;
  } catch (error) {
    console.error("Could not load Judge0 languages:", error);
    return null;
  }
};

const resolveLanguageId = async (language: TLanguage): Promise<number> => {
  if (!SUPPORTED_LANGUAGES.includes(language)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Unsupported programming language."
    );
  }

  const configuredId = Number(config.judge0_language_ids[language]);

  if (!Number.isFinite(configuredId) || configuredId <= 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "The selected language is not configured."
    );
  }

  const languages = await fetchAvailableLanguages();

  if (!languages || languages.length === 0) {
    return configuredId;
  }

  if (languages.some((entry) => entry.id === configuredId)) {
    return configuredId;
  }

  const pattern = LANGUAGE_PATTERNS[language];
  const fallback = languages
    .filter((entry) => pattern.test(entry.name))
    .sort((a, b) => b.id - a.id)[0];

  if (fallback) {
    return fallback.id;
  }

  throw new AppError(
    httpStatus.BAD_REQUEST,
    "The selected language is not available on the code execution server."
  );
};

const toNumber = (value: string | number | null | undefined): number | null => {
  if (value === null || value === undefined) return null;

  const parsed = typeof value === "number" ? value : Number.parseFloat(value);

  return Number.isFinite(parsed) ? parsed : null;
};

const parseSubmission = (
  submission: TJudge0Submission,
  fallbackToken = ""
): TJudge0Execution => {
  const statusId = submission.status?.id ?? INTERNAL_ERROR_STATUS_ID;

  return {
    token: submission.token ?? fallbackToken,
    statusId,
    status: submission.status?.description ?? "Internal Error",
    stdout: fromBase64(submission.stdout),
    stderr: fromBase64(submission.stderr),
    compileOutput: fromBase64(submission.compile_output),
    message: fromBase64(submission.message),
    time: toNumber(submission.time),
    memory: toNumber(submission.memory),
  };
};

const isTerminal = (submission: TJudge0Submission): boolean => {
  const statusId = submission.status?.id;
  return typeof statusId === "number" && statusId >= TERMINAL_STATUS_ID;
};

const clampTimeLimit = (timeLimit: number): number => {
  if (!Number.isFinite(timeLimit) || timeLimit <= 0) return 2;
  return Math.min(Math.max(timeLimit, 1), 15);
};

const clampMemoryLimit = (memoryLimit: number): number => {
  if (!Number.isFinite(memoryLimit) || memoryLimit <= 0) return 128000;
  return Math.min(Math.max(Math.round(memoryLimit), 16000), 512000);
};

const buildSubmissionBody = (
  languageId: number,
  sourceCode: string,
  stdin: string,
  timeLimit: number,
  memoryLimit: number
) => {
  const cpuTimeLimit = clampTimeLimit(timeLimit);

  return {
    source_code: toBase64(sourceCode),
    language_id: languageId,
    stdin: toBase64(stdin),
    cpu_time_limit: cpuTimeLimit,
    wall_time_limit: cpuTimeLimit + 3,
    memory_limit: clampMemoryLimit(memoryLimit),
    enable_network: false,
  };
};

const pollBatch = async (tokens: string[]): Promise<TJudge0Execution[]> => {
  const deadline = Date.now() + config.judge0_poll_timeout_ms;
  const queryTokens = tokens.join(",");

  while (Date.now() < deadline) {
    const result = await judge0Fetch<{ submissions?: TJudge0Submission[] }>(
      `/submissions/batch?base64_encoded=true&tokens=${encodeURIComponent(
        queryTokens
      )}&fields=token,status,stdout,stderr,compile_output,message,time,memory`
    );

    const submissions = result.submissions ?? [];

    if (
      submissions.length === tokens.length &&
      submissions.every((submission) => isTerminal(submission))
    ) {
      return submissions.map((submission, index) =>
        parseSubmission(submission, tokens[index] ?? "")
      );
    }

    await sleep(config.judge0_poll_interval_ms);
  }

  throw new AppError(
    httpStatus.GATEWAY_TIMEOUT,
    "Code execution took too long. Please try again."
  );
};

const executeSequentially = async (
  payloads: {
    sourceCode: string;
    stdin: string;
    timeLimit: number;
    memoryLimit: number;
  }[],
  languageId: number
): Promise<TJudge0Execution[]> => {
  const results: TJudge0Execution[] = [];

  for (const payload of payloads) {
    const created = await judge0Fetch<{ token?: string }>(
      "/submissions?base64_encoded=true&wait=false",
      {
        method: "POST",
        body: JSON.stringify(
          buildSubmissionBody(
            languageId,
            payload.sourceCode,
            payload.stdin,
            payload.timeLimit,
            payload.memoryLimit
          )
        ),
      }
    );

    if (!created.token) {
      throw new AppError(
        httpStatus.BAD_GATEWAY,
        "The code execution service did not return a submission token."
      );
    }

    const deadline = Date.now() + config.judge0_poll_timeout_ms;
    let execution: TJudge0Execution | null = null;

    while (Date.now() < deadline) {
      const submission = await judge0Fetch<TJudge0Submission>(
        `/submissions/${created.token}?base64_encoded=true&fields=token,status,stdout,stderr,compile_output,message,time,memory`
      );

      if (isTerminal(submission)) {
        execution = parseSubmission(submission, created.token);
        break;
      }

      await sleep(config.judge0_poll_interval_ms);
    }

    if (!execution) {
      throw new AppError(
        httpStatus.GATEWAY_TIMEOUT,
        "Code execution took too long. Please try again."
      );
    }

    results.push(execution);
  }

  return results;
};

const executeBatch = async (
  payloads: {
    sourceCode: string;
    stdin: string;
    timeLimit: number;
    memoryLimit: number;
  }[],
  language: TLanguage
): Promise<TJudge0Execution[]> => {
  if (payloads.length === 0) return [];

  const languageId = await resolveLanguageId(language);
  const submissions = payloads.map((payload) =>
    buildSubmissionBody(
      languageId,
      payload.sourceCode,
      payload.stdin,
      payload.timeLimit,
      payload.memoryLimit
    )
  );

  try {
    const created = await judge0Fetch<{ token: string }[]>(
      "/submissions/batch?base64_encoded=true",
      {
        method: "POST",
        body: JSON.stringify({ submissions }),
      }
    );

    const tokens = Array.isArray(created)
      ? created.map((entry) => entry.token).filter(Boolean)
      : [];

    if (tokens.length !== payloads.length) {
      throw new AppError(
        httpStatus.BAD_GATEWAY,
        "The code execution service returned an unexpected response."
      );
    }

    return await pollBatch(tokens);
  } catch (error) {
    console.error("Judge0 batch execution failed, falling back:", error);
    return executeSequentially(payloads, languageId);
  }
};

const executeSingle = async (
  payload: {
    sourceCode: string;
    stdin: string;
    timeLimit: number;
    memoryLimit: number;
  },
  language: TLanguage
): Promise<TJudge0Execution> => {
  const languageId = await resolveLanguageId(language);
  const [result] = await executeSequentially([payload], languageId);

  if (!result) {
    throw new AppError(
      httpStatus.BAD_GATEWAY,
      "The code execution service returned an empty result."
    );
  }

  return result;
};

const checkHealth = async (): Promise<boolean> => {
  try {
    await judge0Fetch<unknown>("/about");
    return true;
  } catch {
    return false;
  }
};

export const judge0Service = {
  executeBatch,
  executeSingle,
  resolveLanguageId,
  checkHealth,
  supportedLanguages: SUPPORTED_LANGUAGES,
};
