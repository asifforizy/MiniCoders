import express from "express";

import { optionalAuth } from "../../middleware/optionalAuth";
import { problemsController } from "./problems.controller";

const router = express.Router();

router.get("/", optionalAuth, problemsController.getAllProblems);
router.get("/:slug", optionalAuth, problemsController.getProblemBySlug);

export const problemsRoutes = router;
