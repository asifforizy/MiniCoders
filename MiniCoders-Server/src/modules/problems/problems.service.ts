import httpStatus from "http-status";

import { Difficulty } from "../../../prisma/generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import type { TProblemQuery } from "./problems.interface";

const ALLOWED_SORT_FIELDS = [
  "number",
  "createdAt",
  "title",
  "points",
  "difficulty",
] as const;

type SortField = (typeof ALLOWED_SORT_FIELDS)[number];

const getAllProblemsFromDB = async (
  query: TProblemQuery,
  userId?: string
) => {
  const { search, difficulty, topic } = query;

  if (
    difficulty &&
    !Object.values(Difficulty).includes(difficulty as Difficulty)
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Invalid difficulty. Use one of: ${Object.values(Difficulty).join(", ")}`
    );
  }

  const sortBy = (query.sortBy ?? "createdAt") as SortField;
  const sortOrder = (query.sortOrder ?? "desc").toLowerCase();

  if (!ALLOWED_SORT_FIELDS.includes(sortBy)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Invalid sortBy. Use one of: ${ALLOWED_SORT_FIELDS.join(", ")}`
    );
  }

  if (sortOrder !== "asc" && sortOrder !== "desc") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Invalid sortOrder. Use asc or desc"
    );
  }

  const page = Math.max(parseInt(query.page ?? "1", 10) || 1, 1);
  const limit = Math.min(
    Math.max(parseInt(query.limit ?? "20", 10) || 20, 1),
    100
  );
  const skip = (page - 1) * limit;

  const term = search?.trim();
  const topicTerm = topic?.trim();

  const where = {
    isPublished: true,
    ...(difficulty && { difficulty: difficulty as Difficulty }),
    ...(topicTerm && {
      topic: { equals: topicTerm, mode: "insensitive" as const },
    }),
    ...(term && {
      OR: [
        { title: { contains: term, mode: "insensitive" as const } },
        { description: { contains: term, mode: "insensitive" as const } },
        { topic: { contains: term, mode: "insensitive" as const } },
      ],
    }),
  };

  const [problems, total, topicRows] = await Promise.all([
    prisma.problem.findMany({
      where,
      orderBy: [{ [sortBy]: sortOrder }, { id: "asc" }],
      skip,
      take: limit,
      select: {
        id: true,
        number: true,
        title: true,
        slug: true,
        description: true,
        difficulty: true,
        topic: true,
        points: true,
        timeLimit: true,
        memoryLimit: true,
        createdAt: true,
      },
    }),
    prisma.problem.count({ where }),
    prisma.problem.findMany({
      where: { isPublished: true, topic: { not: null } },
      distinct: ["topic"],
      select: { topic: true },
      orderBy: { topic: "asc" },
    }),
  ]);

  let solvedProblemIds: string[] = [];

  if (userId && problems.length > 0) {
    const progress = await prisma.problemProgress.findMany({
      where: {
        userId,
        solved: true,
        problemId: { in: problems.map((problem) => problem.id) },
      },
      select: { problemId: true },
    });

    solvedProblemIds = progress.map((entry) => entry.problemId);
  }

  const solvedSet = new Set(solvedProblemIds);

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    topics: topicRows
      .map((entry) => entry.topic)
      .filter((value): value is string => Boolean(value)),
    problems: problems.map((problem) => ({
      ...problem,
      isSolved: solvedSet.has(problem.id),
    })),
  };
};

const getProblemBySlugFromDB = async (slug: string, userId?: string) => {
  const problem = await prisma.problem.findFirst({
    where: { slug, isPublished: true },
    select: {
      id: true,
      number: true,
      title: true,
      slug: true,
      description: true,
      difficulty: true,
      topic: true,
      inputFormat: true,
      outputFormat: true,
      constraints: true,
      hints: true,
      starterCode: true,
      supportedLanguages: true,
      timeLimit: true,
      memoryLimit: true,
      points: true,
      createdAt: true,
      updatedAt: true,
      author: {
        select: {
          id: true,
          name: true,
          imageUrl: true,
        },
      },
      testCases: {
        where: { isPublic: true },
        orderBy: { order: "asc" },
        select: {
          id: true,
          input: true,
          expectedOutput: true,
          order: true,
          explanation: true,
        },
      },
    },
  });

  if (!problem) {
    throw new AppError(httpStatus.NOT_FOUND, "Problem not found");
  }

  let isSolved = false;

  if (userId) {
    const progress = await prisma.problemProgress.findUnique({
      where: {
        userId_problemId: { userId, problemId: problem.id },
      },
      select: { solved: true },
    });

    isSolved = progress?.solved ?? false;
  }

  return {
    ...problem,
    isSolved,
  };
};

const getProblemForEvaluation = async (
  problemId: string,
  includeHiddenTestCases: boolean
) => {
  const problem = await prisma.problem.findFirst({
    where: { id: problemId, isPublished: true },
    select: {
      id: true,
      title: true,
      slug: true,
      points: true,
      timeLimit: true,
      memoryLimit: true,
      supportedLanguages: true,
      testCases: {
        where: includeHiddenTestCases ? undefined : { isPublic: true },
        orderBy: { order: "asc" },
        select: {
          id: true,
          input: true,
          expectedOutput: true,
          isPublic: true,
          order: true,
        },
      },
    },
  });

  if (!problem) {
    throw new AppError(httpStatus.NOT_FOUND, "Problem not found");
  }

  return problem;
};

const getProblemForCustomRun = async (problemId: string) => {
  const problem = await prisma.problem.findFirst({
    where: { id: problemId, isPublished: true },
    select: {
      id: true,
      title: true,
      slug: true,
      timeLimit: true,
      memoryLimit: true,
      supportedLanguages: true,
    },
  });

  if (!problem) {
    throw new AppError(httpStatus.NOT_FOUND, "Problem not found");
  }

  return problem;
};

export const problemsService = {
  getAllProblemsFromDB,
  getProblemBySlugFromDB,
  getProblemForEvaluation,
  getProblemForCustomRun,
};
