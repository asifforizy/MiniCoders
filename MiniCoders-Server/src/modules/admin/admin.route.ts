import express from "express";
import { auth } from "../../middleware/checkAuth";
import { Role } from "../../../prisma/generated/prisma/client";
import { adminController } from "./admin.controller";


const router = express.Router();




router.get("/users", auth(Role.ADMIN, Role.SUPER_ADMIN), adminController.getAllUsers);
router.patch("/users/:id", auth(Role.ADMIN, Role.SUPER_ADMIN), adminController.updateUserStatus);



export const adminRoutes = router;
