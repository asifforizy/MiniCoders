import { Role } from "../../../prisma/generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { slugify } from "../../utils/generateSlug";
import httpStatus from 'http-status';
import { IUpdatedStatus, TCreateProblemPayload } from "./super-admin.interface";

const getAllUsersFromDB = async () => {
  return prisma.user.findMany({
    omit: { password: true },
    orderBy: { createdAt: "desc" },
  });
};

const updateUserStatusIntoDB = async (id: string, payload: IUpdatedStatus) => {
  const { status } = payload;

  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new Error("User not found");
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

const generateUniqueSlug = async (title: string): Promise<string> => {
  const baseSlug = slugify(title);

  if (!baseSlug) {
    throw new AppError(httpStatus.BAD_REQUEST, "Title must contain letters or numbers");
  }

  let slug = baseSlug;
  let counter = 1;

  while (await prisma.problem.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter++}`;
  }

  return slug; 
};

const createProblemIntoDB = async (
  authorId: string,
  payload: TCreateProblemPayload
) => {
  const slug = await generateUniqueSlug(payload.title);

  const problem = await prisma.problem.create({
    data: {
      authorId,
      title: payload.title,
      slug,
      description: payload.description,
      difficulty: payload.difficulty,
      ...(payload.points !== undefined && { points: payload.points }),
    },
    include: {
      author: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  return problem;
};

const deleteProblemFromDB = async (problemId: string) => {
  const problem = await prisma.problem.findUnique({
    where: { id: problemId },
  });

  if (!problem) {
    throw new AppError(httpStatus.NOT_FOUND, "Problem not found");
  }

  const deletedProblem = await prisma.problem.delete({
    where: { id: problemId },
  });

  return deletedProblem;
};


const makeAdminIntoDB = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (user.role === Role.SUPER_ADMIN) {
    throw new AppError(httpStatus.BAD_REQUEST, "Super admin role cannot be changed");
  }

  if (user.role === Role.ADMIN) {
    throw new AppError(httpStatus.CONFLICT, "This user is already an admin");
  }

  if (user.status === "BLOCKED") {
    throw new AppError(httpStatus.FORBIDDEN, "Cannot make a blocked user an admin");
  }

  const admin = await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: user.id },
      data: { role: Role.ADMIN },
    });

    // upsert, so a previously removed admin (isDeleted: true) gets restored
    return tx.admin.upsert({
      where: { adminId: user.id },
      create: {
        adminId: user.id,
        name: user.name,
        email: user.email,
      },
      update: {
        isDeleted: false,
        deletedAt: null,
      },
    });
  });

  return admin;
};





export const superAdminService = {
  getAllUsersFromDB,
  updateUserStatusIntoDB,
  getStatsFromDB,
  createProblemIntoDB,
  deleteProblemFromDB,
  makeAdminIntoDB,
};
