import express from "express";

import { rankingsController } from "./rankings.controller";

const router = express.Router();

router.get("/", rankingsController.getRankings);

export const rankingsRoutes = router;
