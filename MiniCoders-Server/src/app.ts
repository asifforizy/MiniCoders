import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from 'cors';
import { notFound } from "./middleware/notFound";
import config from "./config";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import { AuthRoutes } from "./modules/auth/auth.routes";
import { adminRoutes } from "./modules/admin/admin.route";



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


app.get("/", async (req: Request, res: Response) => {
  res.send("MiniCoders server is running");
});



app.use(notFound)
app.use(globalErrorHandler)
export default app;