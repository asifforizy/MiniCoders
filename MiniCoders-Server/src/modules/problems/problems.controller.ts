import type { Request, Response } from "express";
import httpStatus from "http-status";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import type { TProblemQuery } from "./problems.interface";
import { problemsService } from "./problems.service";

const getAllProblems = catchAsync(async (req: Request, res: Response) => {
  const query: TProblemQuery = {
    search: req.query.search as string | undefined,
    difficulty: req.query.difficulty as string | undefined,
    topic: req.query.topic as string | undefined,
    sortBy: req.query.sortBy as string | undefined,
    sortOrder: req.query.sortOrder as string | undefined,
    page: req.query.page as string | undefined,
    limit: req.query.limit as string | undefined,
  };

  const result = await problemsService.getAllProblemsFromDB(
    query,
    req.user?.userId
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Problems fetched successfully",
    data: result,
    meta: result.meta,
  });
});

const getProblemBySlug = catchAsync(async (req: Request, res: Response) => {
  const slug = req.params.slug as string;

  const result = await problemsService.getProblemBySlugFromDB(
    slug,
    req.user?.userId
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Problem fetched successfully",
    data: result,
  });
});

export const problemsController = {
  getAllProblems,
  getProblemBySlug,
};
