import express from "express";
import { auth } from "../../middleware/checkAuth";
import { Role } from "../../../prisma/generated/prisma/client";
import { validateRequest } from "../../middleware/validateRequest";
import { superAdminController } from "./super-admin.controller";
import { problemValidation } from "./super-admin.validation";



const router = express.Router();





router.get("/users", auth(Role.SUPER_ADMIN), superAdminController.getAllUsers);
router.patch("/users/:id", auth(Role.SUPER_ADMIN), superAdminController.updateUserStatus);
router.post("/problems", auth(Role.SUPER_ADMIN),  validateRequest(problemValidation.createProblem),superAdminController.createProblem);
router.delete("/problems/:id", auth(Role.SUPER_ADMIN), superAdminController.deleteProblem);
router.patch("/users/:id/make-admin", auth(Role.SUPER_ADMIN), superAdminController.makeAdmin);

export const superAdminRoutes = router;
