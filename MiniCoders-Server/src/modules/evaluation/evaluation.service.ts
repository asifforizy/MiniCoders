import httpStatus from "http-status";

import { SubmissionStatus } from "../../../prisma/generated/prisma/enums";
import { AppError } from "../../utils/AppError";
import { judge0Service } from "../judge0/judge0.service";
import type { TJudge0Execution } from "../judge0/judge0.interface";
import { outputsMatch } from "./output-comparison";
import type {
  TEvaluatePayload,
  TEvaluationResult,
  TTestCaseResult,
} from "./evaluation.interface";

const mapJudge0Status = (execution: TJudge0Execution): SubmissionStatus => {
  const description = execution.status.toLowerCase();
  const stderr = execution.stderr.toLowerCase();

  if (
    stderr.includes("syntaxerror") ||
    stderr.includes("indentationerror") ||
    stderr.includes("taberror")
  ) {
    return SubmissionStatus.COMPILATION_ERROR;
  }

  if (description.includes("memory limit")) {
    return SubmissionStatus.MEMORY_LIMIT_EXCEEDED;
  }

  switch (execution.statusId) {
    case 3:
      return SubmissionStatus.ACCEPTED;
    case 4:
      return SubmissionStatus.WRONG_ANSWER;
    case 5:
      return SubmissionStatus.TIME_LIMIT_EXCEEDED;
    case 6:
      return SubmissionStatus.COMPILATION_ERROR;
    case 7:
    case 8:
    case 9:
    case 10:
    case 11:
    case 12:
    case 14:
      return SubmissionStatus.RUNTIME_ERROR;
    case 13:
      return SubmissionStatus.INTERNAL_ERROR;
    default:
      return SubmissionStatus.INTERNAL_ERROR;
  }
};

const determineVerdict = (
  results: TTestCaseResult[]
): SubmissionStatus => {
  const statuses = results.map((result) => result.status);

  if (statuses.includes(SubmissionStatus.COMPILATION_ERROR)) {
    return SubmissionStatus.COMPILATION_ERROR;
  }

  if (statuses.includes(SubmissionStatus.INTERNAL_ERROR)) {
    return SubmissionStatus.INTERNAL_ERROR;
  }

  if (statuses.includes(SubmissionStatus.MEMORY_LIMIT_EXCEEDED)) {
    return SubmissionStatus.MEMORY_LIMIT_EXCEEDED;
  }

  if (statuses.includes(SubmissionStatus.TIME_LIMIT_EXCEEDED)) {
    return SubmissionStatus.TIME_LIMIT_EXCEEDED;
  }

  if (statuses.includes(SubmissionStatus.RUNTIME_ERROR)) {
    return SubmissionStatus.RUNTIME_ERROR;
  }

  if (results.some((result) => !result.passed)) {
    return SubmissionStatus.WRONG_ANSWER;
  }

  return SubmissionStatus.ACCEPTED;
};

const buildMessage = (result: {
  verdict: SubmissionStatus;
  passed: number;
  total: number;
  results: TTestCaseResult[];
}): string => {
  if (result.verdict === SubmissionStatus.COMPILATION_ERROR) {
    const compilation = result.results.find(
      (entry) => entry.status === SubmissionStatus.COMPILATION_ERROR
    );
    return compilation?.compileOutput || "Compilation error";
  }

  if (result.verdict === SubmissionStatus.ACCEPTED) {
    return `Accepted. ${result.passed}/${result.total} test cases passed.`;
  }

  if (result.verdict === SubmissionStatus.WRONG_ANSWER) {
    return `Wrong answer. ${result.passed}/${result.total} test cases passed.`;
  }

  if (result.verdict === SubmissionStatus.TIME_LIMIT_EXCEEDED) {
    return `Time limit exceeded. ${result.passed}/${result.total} test cases passed.`;
  }

  if (result.verdict === SubmissionStatus.MEMORY_LIMIT_EXCEEDED) {
    return `Memory limit exceeded. ${result.passed}/${result.total} test cases passed.`;
  }

  if (result.verdict === SubmissionStatus.RUNTIME_ERROR) {
    return `Runtime error. ${result.passed}/${result.total} test cases passed.`;
  }

  return `Internal error while judging. ${result.passed}/${result.total} test cases passed.`;
};

const evaluateTestCases = async (
  payload: TEvaluatePayload
): Promise<TEvaluationResult> => {
  if (payload.testCases.length === 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This problem does not have any test cases configured yet."
    );
  }

  const executions = await judge0Service.executeBatch(
    payload.testCases.map((testCase) => ({
      sourceCode: payload.sourceCode,
      stdin: testCase.input,
      timeLimit: payload.timeLimit,
      memoryLimit: payload.memoryLimit,
    })),
    payload.language
  );

  const results: TTestCaseResult[] = payload.testCases.map(
    (testCase, index) => {
      const execution = executions[index];

      if (!execution) {
        return {
          order: testCase.order,
          isPublic: testCase.isPublic,
          input: testCase.isPublic ? testCase.input : undefined,
          expectedOutput: testCase.isPublic
            ? testCase.expectedOutput
            : undefined,
          actualOutput: "",
          passed: false,
          status: SubmissionStatus.INTERNAL_ERROR,
          time: null,
          memory: null,
          stderr: "",
          compileOutput: "",
        };
      }

      const judgeStatus = mapJudge0Status(execution);
      const matches =
        judgeStatus === SubmissionStatus.ACCEPTED &&
        outputsMatch(execution.stdout, testCase.expectedOutput);
      const status =
        judgeStatus === SubmissionStatus.ACCEPTED && !matches
          ? SubmissionStatus.WRONG_ANSWER
          : judgeStatus;

      const exposeDetails = testCase.isPublic;

      return {
        order: testCase.order,
        isPublic: testCase.isPublic,
        input: exposeDetails ? testCase.input : undefined,
        expectedOutput: exposeDetails ? testCase.expectedOutput : undefined,
        actualOutput: exposeDetails ? execution.stdout : "",
        passed: matches,
        status,
        time: execution.time,
        memory: execution.memory,
        stderr: exposeDetails ? execution.stderr : "",
        compileOutput: exposeDetails ? execution.compileOutput : "",
      };
    }
  );

  const passed = results.filter((result) => result.passed).length;
  const verdict = determineVerdict(results);

  const times = results
    .map((result) => result.time)
    .filter((value): value is number => typeof value === "number");
  const memories = results
    .map((result) => result.memory)
    .filter((value): value is number => typeof value === "number");

  return {
    verdict,
    passed,
    total: results.length,
    time: times.length ? Math.max(...times) : null,
    memory: memories.length ? Math.max(...memories) : null,
    results,
    message: buildMessage({ verdict, passed, total: results.length, results }),
  };
};

export const evaluationService = {
  evaluateTestCases,
  mapJudge0Status,
};
