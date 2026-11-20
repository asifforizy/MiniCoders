import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status';
import { adminService } from "./admin.service";

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.getAllUsersFromDB({
    search: req.query.search as string | undefined,
    role: req.query.role as string | undefined,
    status: req.query.status as string | undefined,
    page: req.query.page as string | undefined,
    limit: req.query.limit as string | undefined,
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Users retrieved successfully",
    data: result,
    meta: result.meta,
  });
});




const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.updateUserStatusIntoDB(req.params.id as string, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User status updated successfully ",
    data: result,
  });
});




const getStats = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.getStatsFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Dashboard stats retrieved successfully",
    data: result,
  });
});


const getAllProblems = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.getAllProblemsFromDB({
    search: req.query.search as string | undefined,
    difficulty: req.query.difficulty as string | undefined,
    published: req.query.published as string | undefined,
    page: req.query.page as string | undefined,
    limit: req.query.limit as string | undefined,
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "ALL Problems retrieved successfully",
    data: result,
    meta: result.meta,
  });
});


const getProblemById = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.getProblemByIdFromDB(
    req.params.id as string
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Problem retrieved successfully",
    data: result,
  });
});

const updateProblem = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.updateProblemIntoDB(
    req.params.id as string,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Problem updated successfully",
    data: result,
  });
});

const createProblem = catchAsync(async (req: Request, res: Response) => {
  const authorId = req.user!.userId; 

  const result = await adminService.createProblemIntoDB(authorId, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Problem created successfully",
    data: result,
  });
});

const deleteProblem = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.deleteProblemFromDB(req.params.id as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Problem deleted successfully",
    data: result,
  });
});






export const adminController = {
    getAllUsers,
    updateUserStatus,
    getStats,
    createProblem,
    getAllProblems,
    getProblemById,
    updateProblem,
    deleteProblem,
}