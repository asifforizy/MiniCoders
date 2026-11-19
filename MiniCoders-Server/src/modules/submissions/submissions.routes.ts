import express from "express";

import { Role } from "../../../prisma/generated/prisma/enums";
import { auth } from "../../middleware/checkAuth";
import { rateLimit } from "../../middleware/rateLimit";
import { validateRequest } from "../../middleware/validateRequest";
import { submissionsController } from "./submissions.controller";
import { submissionValidation } from "./submissions.validation";

const router = express.Router();

const allRoles = [Role.KIDS, Role.ADMIN, Role.SUPER_ADMIN];

router.post(
  "/run",
  auth(...allRoles),
  rateLimit({ bucket: "run", windowMs: 60_000, max: 15 }),
  validateRequest(submissionValidation.run),
  submissionsController.run
);

router.post(
  "/custom-input",
  auth(...allRoles),
  rateLimit({ bucket: "custom-input", windowMs: 60_000, max: 20 }),
  validateRequest(submissionValidation.customInput),
  submissionsController.customInput
);

router.post(
  "/submit",
  auth(...allRoles),
  rateLimit({ bucket: "submit", windowMs: 60_000, max: 8 }),
  validateRequest(submissionValidation.submit),
  submissionsController.submit
);

router.get("/", auth(...allRoles), submissionsController.getMySubmissions);
router.get("/:id", auth(...allRoles), submissionsController.getSubmissionById);

export const submissionsRoutes = router;
