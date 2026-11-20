import { Prisma, Role, UserStatus, Difficulty } from "../../../prisma/generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { slugify } from "../../utils/generateSlug";
import {
  IUpdatedStatus,
  TAdminProblemQuery,
  TAdminUserQuery,
  TAdminTestCasePayload,
  TCreateProblemPayload,
  TUpdateProblemPayload,
} from "./admin.interface";
import httpStatus from 'http-status';

const parsePagination = (pageValue?: string, limitValue?: string) => {
  const page = Math.max(parseInt(pageValue ?? "1", 10) || 1, 1);
  const limit = Math.min(
    Math.max(parseInt(limitValue ?? "20", 10) || 20, 1),
    100
  );

  return { page, limit, skip: (page - 1) * limit };
};

const getAllUsersFromDB = async (query: TAdminUserQuery = {}) => {
  const { page, limit, skip } = parsePagination(query.page, query.limit);
  const term = query.search?.trim();

  const roles = (query.role ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter((value): value is Role =>
      Object.values(Role).includes(value as Role)
    );

  const status =
    query.status && Object.values(UserStatus).includes(query.status as UserStatus)
      ? (query.status as UserStatus)
      : undefined;

  const where: Prisma.UserWhereInput = {
    ...(roles.length > 0 && { role: { in: roles } }),
    ...(status && { status }),
    ...(term && {
      OR: [
        { name: { contains: term, mode: "insensitive" as const } },
        { email: { contains: term, mode: "insensitive" as const } },
      ],
    }),
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      omit: { password: true },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const updateUserStatusIntoDB = async (id: string, payload: IUpdatedStatus) => {
  const { status } = payload;

  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.role === Role.ADMIN || user.role === Role.SUPER_ADMIN) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Admin and super admin accounts cannot be blocked, banned, or deleted"
    );
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      status,
    },
    omit: {
      password: true,
    },
  });

  return updatedUser;
};

const getStatsFromDB = async () => {
  const [users, problemCount] = await Promise.all([
    prisma.user.findMany({
      select: { role: true, status: true, createdAt: true },
    }),
    prisma.problem.count(),
  ]);

  const roleCounts = { KIDS: 0, ADMIN: 0, SUPER_ADMIN: 0 };
  const statusCounts = { ACTIVE: 0, BLOCKED: 0, DELETED: 0 };

  for (const user of users) {
    roleCounts[user.role] += 1;
    statusCounts[user.status] += 1;
  }

  const now = new Date();
  const registrations = Array.from({ length: 6 }, (_, index) => {
    const start = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 1);

    return {
      label: start.toLocaleString("en-US", { month: "short" }),
      count: users.filter(
        (user) => user.createdAt >= start && user.createdAt < end
      ).length,
    };
  });

  return {
    totals: {
      users: users.length,
      kids: roleCounts.KIDS,
      admins: roleCounts.ADMIN,
      superAdmins: roleCounts.SUPER_ADMIN,
      problems: problemCount,
    },
    roles: [
      { label: "Kids", value: roleCounts.KIDS },
      { label: "Admins", value: roleCounts.ADMIN },
      { label: "Super Admins", value: roleCounts.SUPER_ADMIN },
    ],
    statuses: {
      active: statusCounts.ACTIVE,
      blocked: statusCounts.BLOCKED,
      deleted: statusCounts.DELETED,
    },
    registrations,
  };
};

const getAllProblemsFromDB = async (query: TAdminProblemQuery = {}) => {
  const { page, limit, skip } = parsePagination(query.page, query.limit);
  const term = query.search?.trim();

  const difficulty =
    query.difficulty &&
    Object.values(Difficulty).includes(query.difficulty as Difficulty)
      ? (query.difficulty as Difficulty)
      : undefined;

  const published =
    query.published === "true"
      ? true
      : query.published === "false"
        ? false
        : undefined;

  const where: Prisma.ProblemWhereInput = {
    ...(difficulty && { difficulty }),
    ...(published !== undefined && { isPublished: published }),
    ...(term && {
      OR: [
        { title: { contains: term, mode: "insensitive" as const } },
        { description: { contains: term, mode: "insensitive" as const } },
        { topic: { contains: term, mode: "insensitive" as const } },
      ],
    }),
  };

  const [problems, total] = await Promise.all([
    prisma.problem.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            submissions: true,
            testCases: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.problem.count({ where }),
  ]);

  return {
    problems,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getProblemByIdFromDB = async (problemId: string) => {
  const problem = await prisma.problem.findUnique({
    where: { id: problemId },
    include: {
      author: {
        select: { id: true, name: true, email: true },
      },
      testCases: {
        orderBy: { order: "asc" },
      },
      _count: {
        select: { submissions: true },
      },
    },
  });

  if (!problem) {
    throw new AppError(httpStatus.NOT_FOUND, "Problem not found");
  }

  return problem;
};

const generateUniqueSlug = async (
  title: string,
  excludeProblemId?: string
): Promise<string> => {
  const baseSlug = slugify(title);

  if (!baseSlug) {
    throw new AppError(httpStatus.BAD_REQUEST, "Title must contain letters or numbers");
  }

  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma.problem.findUnique({ where: { slug } });

    if (!existing || existing.id === excludeProblemId) {
      return slug;
    }

    slug = `${baseSlug}-${counter++}`;
  }
};

const buildTestCaseCreateData = (
  testCases: TAdminTestCasePayload[] | undefined
) =>
  (testCases ?? []).map((testCase, index) => ({
    input: testCase.input ?? "",
    expectedOutput: testCase.expectedOutput,
    isPublic: testCase.isPublic ?? false,
    explanation: testCase.explanation,
    order: testCase.order ?? index,
  }));

const createProblemIntoDB = async (
  authorId: string,
  payload: TCreateProblemPayload
) => {
  const slug = await generateUniqueSlug(payload.title);
  const testCases = buildTestCaseCreateData(payload.testCases);

  const problem = await prisma.problem.create({
    data: {
      authorId,
      title: payload.title,
      slug,
      description: payload.description,
      difficulty: payload.difficulty,
      ...(payload.number !== undefined && { number: payload.number }),
      ...(payload.points !== undefined && { points: payload.points }),
      ...(payload.topic !== undefined && { topic: payload.topic }),
      ...(payload.inputFormat !== undefined && {
        inputFormat: payload.inputFormat,
      }),
      ...(payload.outputFormat !== undefined && {
        outputFormat: payload.outputFormat,
      }),
      ...(payload.constraints !== undefined && {
        constraints: payload.constraints,
      }),
      ...(payload.hints !== undefined && { hints: payload.hints }),
      ...(payload.starterCode !== undefined && {
        starterCode: payload.starterCode as Prisma.InputJsonValue,
      }),
      ...(payload.supportedLanguages !== undefined && {
        supportedLanguages: payload.supportedLanguages,
      }),
      ...(payload.timeLimit !== undefined && { timeLimit: payload.timeLimit }),
      ...(payload.memoryLimit !== undefined && {
        memoryLimit: payload.memoryLimit,
      }),
      ...(payload.isPublished !== undefined && {
        isPublished: payload.isPublished,
      }),
      ...(testCases.length > 0 && {
        testCases: { create: testCases },
      }),
    },
    include: {
      author: {
        select: { id: true, name: true, email: true },
      },
      testCases: {
        orderBy: { order: "asc" },
      },
    },
  });

  return problem;
};

const updateProblemIntoDB = async (
  problemId: string,
  payload: TUpdateProblemPayload
) => {
  const existing = await prisma.problem.findUnique({
    where: { id: problemId },
  });

  if (!existing) {
    throw new AppError(httpStatus.NOT_FOUND, "Problem not found");
  }

  return prisma.$transaction(async (tx) => {
    if (payload.testCases !== undefined) {
      await tx.testCase.deleteMany({ where: { problemId } });
    }

    const updated = await tx.problem.update({
      where: { id: problemId },
      data: {
        ...(payload.title !== undefined && { title: payload.title }),
        ...(payload.description !== undefined && {
          description: payload.description,
        }),
        ...(payload.difficulty !== undefined && {
          difficulty: payload.difficulty,
        }),
        ...(payload.number !== undefined && { number: payload.number }),
        ...(payload.points !== undefined && { points: payload.points }),
        ...(payload.topic !== undefined && { topic: payload.topic }),
        ...(payload.inputFormat !== undefined && {
          inputFormat: payload.inputFormat,
        }),
        ...(payload.outputFormat !== undefined && {
          outputFormat: payload.outputFormat,
        }),
        ...(payload.constraints !== undefined && {
          constraints: payload.constraints,
        }),
        ...(payload.hints !== undefined && { hints: payload.hints }),
        ...(payload.starterCode !== undefined && {
          starterCode: payload.starterCode as Prisma.InputJsonValue,
        }),
        ...(payload.supportedLanguages !== undefined && {
          supportedLanguages: payload.supportedLanguages,
        }),
        ...(payload.timeLimit !== undefined && {
          timeLimit: payload.timeLimit,
        }),
        ...(payload.memoryLimit !== undefined && {
          memoryLimit: payload.memoryLimit,
        }),
        ...(payload.isPublished !== undefined && {
          isPublished: payload.isPublished,
        }),
        ...(payload.testCases !== undefined &&
          payload.testCases.length > 0 && {
            testCases: {
              create: buildTestCaseCreateData(payload.testCases),
            },
          }),
      },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
        testCases: {
          orderBy: { order: "asc" },
        },
      },
    });

    return updated;
  });
};

const deleteProblemFromDB = async (problemId: string) => {
  const problem = await prisma.problem.findUnique({
    where: { id: problemId },
    select: { id: true, _count: { select: { submissions: true } } },
  });

  if (!problem) {
    throw new AppError(httpStatus.NOT_FOUND, "Problem not found");
  }

  if (problem._count.submissions > 0) {
    throw new AppError(
      httpStatus.CONFLICT,
      "This problem has submissions and cannot be deleted. Unpublish it instead."
    );
  }

  const deletedProblem = await prisma.problem.delete({
    where: { id: problemId },
  });

  return deletedProblem;
};




export const adminService = {
  getAllUsersFromDB,
  updateUserStatusIntoDB,
  getStatsFromDB,
  getAllProblemsFromDB,
  getProblemByIdFromDB,
  createProblemIntoDB,
  updateProblemIntoDB,
  deleteProblemFromDB,
};
