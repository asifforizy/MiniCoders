import express from "express";

import { Role } from "../../../prisma/generated/prisma/enums";
import { auth } from "../../middleware/checkAuth";
import { progressController } from "./progress.controller";

const router = express.Router();

const allRoles = [Role.KIDS, Role.ADMIN, Role.SUPER_ADMIN];

router.get("/", auth(...allRoles), progressController.getMyProgress);
router.get(
  "/:problemId",
  auth(...allRoles),
  progressController.getProblemProgress
);

export const progressRoutes = router;
