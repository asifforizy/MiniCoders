import type { Request, Response } from "express";
import httpStatus from "http-status";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { rankingsService } from "./rankings.service";

const getRankings = catchAsync(async (req: Request, res: Response) => {
  const result = await rankingsService.getRankingsFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rankings retrieved successfully",
    data: result,
  });
});

export const rankingsController = {
  getRankings,
};
