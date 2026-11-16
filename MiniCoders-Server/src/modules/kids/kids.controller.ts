import type { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AppError } from "../../utils/AppError";
import { kidsService } from "./kids.service";

const getAllProblems = catchAsync(async (req: Request, res: Response) => {
  const result = await kidsService.getAllProblemsFromDB({
    difficulty: req.query.difficulty as string | undefined,
    search: req.query.search as string | undefined,
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Problems fetched successfully",
    data: result,
  });
});

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized");
  }

  const result = await kidsService.getMyProfileFromDB(req.user.userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Profile fetched successfully",
    data: result,
  });
});

export const kidsController = {
  getAllProblems,
  getMyProfile,
};