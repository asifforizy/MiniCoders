import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from 'cors';
import { notFound } from "./middleware/notFound";
import config from "./config";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import { AuthRoutes } from "./modules/auth/auth.routes";
import { adminRoutes } from "./modules/admin/admin.route";
import { kidsRoutes } from "./modules/kids/kids.routes";
import { problemsRoutes } from "./modules/problems/problems.route";
import { superAdminRoutes } from "./modules/super-admin/super-admin.route";



const app: Application = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: config.app_url,
    credentials: true
  })
);


app.use("/api/v1/auth", AuthRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/super-admin", superAdminRoutes);
app.use("/api/v1/kids", kidsRoutes);
app.use("/api/v1/problems", problemsRoutes); 



app.get("/", async (req: Request, res: Response) => {
  res.send("MiniCoders server is running");
});



app.use(notFound)
app.use(globalErrorHandler)
export default app;