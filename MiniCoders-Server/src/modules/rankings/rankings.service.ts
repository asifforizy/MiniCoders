import {
  SubmissionStatus,
  UserStatus,
} from "../../../prisma/generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import type { TRankingsResult } from "./rankings.interface";

type LeaderboardEntry = {
  user: {
    id: string;
    name: string;
    imageUrl: string;
  };
  solvedProblems: Set<string>;
  lastSolvedAt: Date;
};

const getRankingsFromDB = async (): Promise<TRankingsResult> => {
  const submissions = await prisma.submission.findMany({
    where: {
      status: SubmissionStatus.ACCEPTED,
      user: {
        isDeleted: false,
        status: UserStatus.ACTIVE,
      },
    },
    select: {
      userId: true,
      problemId: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          name: true,
          imageUrl: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  const leaderboard = new Map<string, LeaderboardEntry>();

  for (const submission of submissions) {
    const existing = leaderboard.get(submission.userId);

    if (existing) {
      existing.solvedProblems.add(submission.problemId);

      if (submission.createdAt > existing.lastSolvedAt) {
        existing.lastSolvedAt = submission.createdAt;
      }
    } else {
      leaderboard.set(submission.userId, {
        user: submission.user,
        solvedProblems: new Set([submission.problemId]),
        lastSolvedAt: submission.createdAt,
      });
    }
  }

  const rankings = Array.from(leaderboard.values())
    .sort((a, b) => {
      const solvedDifference =
        b.solvedProblems.size - a.solvedProblems.size;

      if (solvedDifference !== 0) return solvedDifference;

      return a.lastSolvedAt.getTime() - b.lastSolvedAt.getTime();
    })
    .map((entry, index) => ({
      rank: index + 1,
      userId: entry.user.id,
      name: entry.user.name,
      imageUrl: entry.user.imageUrl,
      solvedCount: entry.solvedProblems.size,
      lastSolvedAt: entry.lastSolvedAt,
    }));

  return {
    rankings,
    totalParticipants: leaderboard.size,
  };
};

export const rankingsService = {
  getRankingsFromDB,
};
