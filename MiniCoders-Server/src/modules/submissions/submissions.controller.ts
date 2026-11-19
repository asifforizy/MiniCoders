import type { Request, Response } from "express";
import httpStatus from "http-status";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import type {
  TCustomInputPayload,
  TRunPayload,
  TSubmissionQuery,
  TSubmitPayload,
} from "./submissions.interface";
import { submissionsService } from "./submissions.service";

const run = catchAsync(async (req: Request, res: Response) => {
  const result = await submissionsService.runProblem(
    req.user!.userId,
    req.body as TRunPayload
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Code executed against public test cases",
    data: result,
  });
});

const customInput = catchAsync(async (req: Request, res: Response) => {
  const result = await submissionsService.runCustomInput(
    req.user!.userId,
    req.body as TCustomInputPayload
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Code executed with custom input",
    data: result,
  });
});

const submit = catchAsync(async (req: Request, res: Response) => {
  const result = await submissionsService.submitProblem(
    req.user!.userId,
    req.body as TSubmitPayload
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Submission judged",
    data: result,
  });
});

const getMySubmissions = catchAsync(async (req: Request, res: Response) => {
  const query: TSubmissionQuery = {
    problemId: req.query.problemId as string | undefined,
    page: req.query.page as string | undefined,
    limit: req.query.limit as string | undefined,
  };

  const result = await submissionsService.getUserSubmissionsFromDB(
    req.user!.userId,
    query
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Submissions fetched successfully",
    data: result,
    meta: result.meta,
  });
});

const getSubmissionById = catchAsync(async (req: Request, res: Response) => {
  const result = await submissionsService.getSubmissionByIdFromDB(
    req.user!.userId,
    req.params.id as string
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Submission fetched successfully",
    data: result,
  });
});

export const submissionsController = {
  run,
  customInput,
  submit,
  getMySubmissions,
  getSubmissionById,
};
