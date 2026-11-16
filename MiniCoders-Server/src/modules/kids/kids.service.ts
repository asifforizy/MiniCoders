import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { Difficulty } from "../../../prisma/generated/prisma/enums";
import { TProblemQuery } from "./kids.interface";



const getAllProblemsFromDB = async (query: TProblemQuery) => {
  const { difficulty, search } = query;

  if (difficulty && !Object.values(Difficulty).includes(difficulty as Difficulty)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Invalid difficulty. Use one of: ${Object.values(Difficulty).join(", ")}`
    );
  }

  return prisma.problem.findMany({
    where: {
      ...(difficulty && { difficulty: difficulty as Difficulty }),
      ...(search && {
        title: { contains: search.trim(), mode: "insensitive" },
      }),
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      difficulty: true,
      points: true,
      createdAt: true,
    },
  });
};

const getMyProfileFromDB = async (userId: string) => {
  const kid = await prisma.kids.findUnique({
    where: { userId },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          role: true,
          status: true,
          emailVerified: true,
          authProvider: true,
          imageUrl: true,
          createdAt: true,
        },
      },
    },
  });

  if (!kid || kid.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "Kid profile not found");
  }

  return kid;
};

export const kidsService = {
  getAllProblemsFromDB,
  getMyProfileFromDB,
};