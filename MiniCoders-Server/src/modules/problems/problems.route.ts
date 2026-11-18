import express from "express";
import { problemsController } from "./problems.controller";

const router = express.Router();

router.get("/",problemsController.getAllProblems);
router.get("/:slug",problemsController.getProblemBySlug);

export const problemsRoutes = router;