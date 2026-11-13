import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { slugify } from "../../utils/generateSlug";
import { IUpdatedStatus, TCreateProblemPayload } from "./admin.interface";
import httpStatus from 'http-status';

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

const getAllProblemsFromDB = async () => {
  const allProblems = await prisma.problem.findMany({
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return allProblems;
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



export const adminService = {
  getAllUsersFromDB,
  updateUserStatusIntoDB,
  getAllProblemsFromDB,
  createProblemIntoDB,
};
