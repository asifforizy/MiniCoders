import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";



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
  getMyProfileFromDB,
};