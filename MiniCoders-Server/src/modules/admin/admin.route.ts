import express from "express";
import { auth } from "../../middleware/checkAuth";
import { Role } from "../../../prisma/generated/prisma/client";
import { adminController } from "./admin.controller";
import { problemValidation } from "./admin.validation";
import { validateRequest } from "../../middleware/validateRequest";


const router = express.Router();




router.get("/users", auth(Role.ADMIN), adminController.getAllUsers);
router.patch("/users/:id", auth(Role.ADMIN), adminController.updateUserStatus);
router.get("/problems", auth(Role.ADMIN), adminController.getAllProblems);
router.post("/problems", auth(Role.ADMIN),  validateRequest(problemValidation.createProblem),adminController.createProblem);
router.delete("/problems/:id", auth(Role.ADMIN), adminController.deleteProblem);
router.get("/stats", auth(Role.ADMIN), adminController.getStats);


export const adminRoutes = router;
