import httpStatus from "http-status";

import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";

const recordAttempt = async (
  userId: string,
  problemId: string,
  accepted: boolean
) => {
  const now = new Date();

  return prisma.$transaction(async (tx) => {
    const existing = await tx.problemProgress.findUnique({
      where: { userId_problemId: { userId, problemId } },
    });

    if (!existing) {
      return tx.problemProgress.create({
        data: {
          userId,
          problemId,
          attempts: 1,
          solved: accepted,
          solvedAt: accepted ? now : null,
          lastAttemptAt: now,
        },
      });
    }

    return tx.problemProgress.update({
      where: { userId_problemId: { userId, problemId } },
      data: {
        attempts: { increment: 1 },
        lastAttemptAt: now,
        solved: existing.solved || accepted,
        solvedAt: existing.solvedAt ?? (accepted ? now : null),
      },
    });
  });
};

const getUserProgressFromDB = async (userId: string) => {
  const [records, totalPublished] = await Promise.all([
    prisma.problemProgress.findMany({
      where: {
        userId,
        problem: { isPublished: true },
      },
      include: {
        problem: {
          select: {
            id: true,
            number: true,
            title: true,
            slug: true,
            difficulty: true,
            topic: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.problem.count({ where: { isPublished: true } }),
  ]);

  const solved = records.filter((record) => record.solved);
  const attempts = records.reduce(
    (total, record) => total + record.attempts,
    0
  );

  return {
    totals: {
      solved: solved.length,
      attempts,
      totalPublished,
      completion:
        totalPublished > 0
          ? Math.round((solved.length / totalPublished) * 100)
          : 0,
    },
    solvedProblemIds: solved.map((record) => record.problemId),
    problems: records.map((record) => ({
      problemId: record.problemId,
      solved: record.solved,
      attempts: record.attempts,
      solvedAt: record.solvedAt,
      lastAttemptAt: record.lastAttemptAt,
      problem: record.problem,
    })),
  };
};

const getProblemProgressFromDB = async (
  userId: string,
  problemIdOrSlug: string
) => {
  const problem = await prisma.problem.findFirst({
    where: {
      isPublished: true,
      OR: [{ id: problemIdOrSlug }, { slug: problemIdOrSlug }],
    },
    select: {
      id: true,
      number: true,
      title: true,
      slug: true,
      difficulty: true,
      topic: true,
    },
  });

  if (!problem) {
    throw new AppError(httpStatus.NOT_FOUND, "Problem not found");
  }

  const progress = await prisma.problemProgress.findUnique({
    where: {
      userId_problemId: { userId, problemId: problem.id },
    },
  });

  return {
    problem,
    solved: progress?.solved ?? false,
    attempts: progress?.attempts ?? 0,
    solvedAt: progress?.solvedAt ?? null,
    lastAttemptAt: progress?.lastAttemptAt ?? null,
  };
};

export const progressService = {
  recordAttempt,
  getUserProgressFromDB,
  getProblemProgressFromDB,
};
