import httpStatus from "http-status";
import { z } from "zod";

import { SubmissionStatus } from "../../../prisma/generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { evaluationService } from "../evaluation/evaluation.service";
import { judge0Service } from "../judge0/judge0.service";
import type { TLanguage } from "../judge0/judge0.interface";
import { problemsService } from "../problems/problems.service";
import { progressService } from "../progress/progress.service";
import type {
  TCustomInputPayload,
  TRunPayload,
  TSubmissionQuery,
  TSubmitPayload,
} from "./submissions.interface";

const assertLanguageAllowed = (
  supportedLanguages: string[],
  language: TLanguage
) => {
  if (
    supportedLanguages.length > 0 &&
    !supportedLanguages.includes(language)
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This problem does not support the selected programming language."
    );
  }
};

const runProblem = async (userId: string, payload: TRunPayload) => {
  const problem = await problemsService.getProblemForEvaluation(
    payload.problemId,
    false
  );

  assertLanguageAllowed(problem.supportedLanguages, payload.language);

  const evaluation = await evaluationService.evaluateTestCases({
    sourceCode: payload.code,
    language: payload.language,
    testCases: problem.testCases,
    timeLimit: problem.timeLimit,
    memoryLimit: problem.memoryLimit,
  });

  return {
    problemId: problem.id,
    verdict: evaluation.verdict,
    passed: evaluation.passed,
    total: evaluation.total,
    time: evaluation.time,
    memory: evaluation.memory,
    message: evaluation.message,
    results: evaluation.results.filter((result) => result.isPublic),
  };
};

const runCustomInput = async (
  _userId: string,
  payload: TCustomInputPayload
) => {
  const problem = await problemsService.getProblemForCustomRun(
    payload.problemId
  );

  assertLanguageAllowed(problem.supportedLanguages, payload.language);

  const execution = await judge0Service.executeSingle(
    {
      sourceCode: payload.code,
      stdin: payload.customInput,
      timeLimit: problem.timeLimit,
      memoryLimit: problem.memoryLimit,
    },
    payload.language
  );

  const status = evaluationService.mapJudge0Status(execution);

  return {
    problemId: problem.id,
    status,
    statusDescription: execution.status,
    output: execution.stdout,
    stderr: execution.stderr,
    compileOutput: execution.compileOutput,
    message: execution.message,
    time: execution.time,
    memory: execution.memory,
  };
};

const submitProblem = async (userId: string, payload: TSubmitPayload) => {
  const problem = await problemsService.getProblemForEvaluation(
    payload.problemId,
    true
  );

  assertLanguageAllowed(problem.supportedLanguages, payload.language);

  let evaluation;

  try {
    evaluation = await evaluationService.evaluateTestCases({
      sourceCode: payload.code,
      language: payload.language,
      testCases: problem.testCases,
      timeLimit: problem.timeLimit,
      memoryLimit: problem.memoryLimit,
    });
  } catch (error) {
    if (
      error instanceof AppError &&
      (error.statusCode === httpStatus.BAD_REQUEST ||
        error.statusCode === httpStatus.NOT_FOUND)
    ) {
      throw error;
    }

    console.error("Submission judging failed:", error);

    const submission = await prisma.submission.create({
      data: {
        userId,
        problemId: problem.id,
        code: payload.code,
        language: payload.language,
        status: SubmissionStatus.INTERNAL_ERROR,
        passedTestCases: 0,
        totalTestCases: problem.testCases.length,
        message: "Internal error while judging. Please try again.",
      },
      select: {
        id: true,
        status: true,
        language: true,
        passedTestCases: true,
        totalTestCases: true,
        time: true,
        memory: true,
        message: true,
        score: true,
        createdAt: true,
      },
    });

    await progressService.recordAttempt(userId, problem.id, false);

    return {
      ...submission,
      verdict: SubmissionStatus.INTERNAL_ERROR,
      passed: 0,
      total: problem.testCases.length,
      results: [],
    };
  }

  const accepted = evaluation.verdict === SubmissionStatus.ACCEPTED;

  const submission = await prisma.submission.create({
    data: {
      userId,
      problemId: problem.id,
      code: payload.code,
      language: payload.language,
      status: evaluation.verdict,
      passedTestCases: evaluation.passed,
      totalTestCases: evaluation.total,
      time: evaluation.time,
      memory: evaluation.memory,
      message: evaluation.message,
      score: accepted ? problem.points : null,
    },
    select: {
      id: true,
      status: true,
      language: true,
      passedTestCases: true,
      totalTestCases: true,
      time: true,
      memory: true,
      message: true,
      score: true,
      createdAt: true,
    },
  });

  await progressService.recordAttempt(userId, problem.id, accepted);

  return {
    ...submission,
    verdict: evaluation.verdict,
    passed: evaluation.passed,
    total: evaluation.total,
    results: evaluation.results.filter((result) => result.isPublic),
  };
};

const getUserSubmissionsFromDB = async (
  userId: string,
  query: TSubmissionQuery
) => {
  const page = Math.max(parseInt(query.page ?? "1", 10) || 1, 1);
  const limit = Math.min(
    Math.max(parseInt(query.limit ?? "20", 10) || 20, 1),
    100
  );
  const skip = (page - 1) * limit;

  let problemId: string | undefined;

  if (query.problemId) {
    const parsed = z.string().uuid().safeParse(query.problemId);

    if (!parsed.success) {
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid problem id");
    }

    problemId = parsed.data;
  }

  const where = {
    userId,
    ...(problemId && { problemId }),
  };

  const [submissions, total] = await Promise.all([
    prisma.submission.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      select: {
        id: true,
        status: true,
        language: true,
        passedTestCases: true,
        totalTestCases: true,
        time: true,
        memory: true,
        message: true,
        score: true,
        createdAt: true,
        problem: {
          select: {
            id: true,
            number: true,
            title: true,
            slug: true,
            difficulty: true,
          },
        },
      },
    }),
    prisma.submission.count({ where }),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    submissions,
  };
};

const getSubmissionByIdFromDB = async (userId: string, submissionId: string) => {
  const submission = await prisma.submission.findFirst({
    where: { id: submissionId, userId },
    select: {
      id: true,
      code: true,
      language: true,
      status: true,
      passedTestCases: true,
      totalTestCases: true,
      time: true,
      memory: true,
      message: true,
      score: true,
      createdAt: true,
      problem: {
        select: {
          id: true,
          number: true,
          title: true,
          slug: true,
          difficulty: true,
        },
      },
    },
  });

  if (!submission) {
    throw new AppError(httpStatus.NOT_FOUND, "Submission not found");
  }

  return submission;
};

export const submissionsService = {
  runProblem,
  runCustomInput,
  submitProblem,
  getUserSubmissionsFromDB,
  getSubmissionByIdFromDB,
};
