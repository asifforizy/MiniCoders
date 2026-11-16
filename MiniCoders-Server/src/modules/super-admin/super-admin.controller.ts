import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status';
import { superAdminService } from "./super-admin.service";


const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await superAdminService.getAllUsersFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Users retrieved successfully",
    data: result,
  });
});




const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await superAdminService.updateUserStatusIntoDB(req.params.id as string, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User status updated successfully ",
    data: result,
  });
});




const createProblem = catchAsync(async (req: Request, res: Response) => {
  const authorId = req.user!.userId; 

  const result = await superAdminService.createProblemIntoDB(authorId, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Problem created successfully",
    data: result,
  });
});

const deleteProblem = catchAsync(async (req: Request, res: Response) => {
  const result = await superAdminService.deleteProblemFromDB(req.params.id as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Problem deleted successfully",
    data: result,
  });
});



const makeAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await superAdminService.makeAdminIntoDB(req.params.id as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User promoted to admin successfully",
    data: result,
  });
});

export const superAdminController = {
    getAllUsers,
    updateUserStatus,
    createProblem,
    deleteProblem,
    makeAdmin,
}