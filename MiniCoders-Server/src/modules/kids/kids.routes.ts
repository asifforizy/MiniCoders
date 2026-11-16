import express from "express";
import { auth } from "../../middleware/checkAuth";
import { Role } from "../../../prisma/generated/prisma/client";
import { kidsController } from "./kids.controller";


const router = express.Router();

router.get("/profile", auth(Role.KIDS), kidsController.getMyProfile);

export const kidsRoutes = router;