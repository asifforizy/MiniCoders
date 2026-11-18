import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { Difficulty } from "../../../prisma/generated/prisma/enums";
import { TProblemQuery } from "./problems.interface";


const ALLOWED_SORT_FIELDS = ["createdAt", "title", "points", "difficulty"] as const;
type SortField = (typeof ALLOWED_SORT_FIELDS)[number];

const getAllProblemsFromDB = async (query: TProblemQuery) => {
  const { search, difficulty } = query;


  if (difficulty && !Object.values(Difficulty).includes(difficulty as Difficulty)) {
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
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid sortOrder. Use asc or desc");
  }

  const page = Math.max(parseInt(query.page ?? "1", 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit ?? "10", 10) || 10, 1), 100);
  const skip = (page - 1) * limit;

  const term = search?.trim();

  const where = {
    ...(difficulty && { difficulty: difficulty as Difficulty }),
    ...(term && {
      OR: [
        { title: { contains: term, mode: "insensitive" as const } },
        { description: { contains: term, mode: "insensitive" as const } },
      ],
    }),
  };

  const [problems, total] = await Promise.all([
    prisma.problem.findMany({
      where,
      orderBy: [{ [sortBy]: sortOrder }, { id: "asc" }],
      skip,
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        difficulty: true,
        points: true,
        createdAt: true,
      },
    }),
    prisma.problem.count({ where }),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    problems,
  };
};

const getProblemBySlugFromDB = async (slug: string) => {
  const problem = await prisma.problem.findUnique({
    where: { slug },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      difficulty: true,
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
};