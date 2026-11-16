import express from "express";
import { problemsController } from "./problems.controller";

const router = express.Router();

router.get("/",problemsController.getAllProblems);

export const problemsRoutes = router;