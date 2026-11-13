import express from "express";
import { auth } from "../../middleware/checkAuth";
import { Role } from "../../../prisma/generated/prisma/client";
import { adminController } from "./admin.controller";
import { problemValidation } from "./admin.validation";
import { validateRequest } from "../../middleware/validateRequest";


const router = express.Router();




router.get("/users", auth(Role.ADMIN, Role.SUPER_ADMIN), adminController.getAllUsers);
router.patch("/users/:id", auth(Role.ADMIN, Role.SUPER_ADMIN), adminController.updateUserStatus);
router.get("/problems", auth(Role.ADMIN, Role.SUPER_ADMIN), adminController.getAllProblems);
router.post("/problems", auth(Role.ADMIN, Role.SUPER_ADMIN),  validateRequest(problemValidation.createProblem),adminController.createProblem);

export const adminRoutes = router;
