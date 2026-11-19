import type { Request, Response } from "express";
import httpStatus from "http-status";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { progressService } from "./progress.service";

const getMyProgress = catchAsync(async (req: Request, res: Response) => {
  const result = await progressService.getUserProgressFromDB(req.user!.userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Progress fetched successfully",
    data: result,
  });
});

const getProblemProgress = catchAsync(async (req: Request, res: Response) => {
  const result = await progressService.getProblemProgressFromDB(
    req.user!.userId,
    req.params.problemId as string
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Problem progress fetched successfully",
    data: result,
  });
});

export const progressController = {
  getMyProgress,
  getProblemProgress,
};
