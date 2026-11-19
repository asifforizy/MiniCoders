import type { NextFunction, Request, Response } from "express";
import type { JwtPayload } from "jsonwebtoken";

import config from "../config";
import { prisma } from "../lib/prisma";
import { catchAsync } from "../utils/catchAsync";
import { jwtUtils } from "../utils/jwt";
import type { Role } from "../../prisma/generated/prisma/enums";

/**
 * Populates req.user when a valid access token is present.
 * Invalid or missing tokens are ignored so public endpoints stay public.
 */
export const optionalAuth = catchAsync(
  async (req: Request, _res: Response, next: NextFunction) => {
    const token = req.cookies?.accessToken
      ? req.cookies.accessToken
      : req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : req.headers.authorization;

    if (!token) {
      next();
      return;
    }

    const verifiedToken = jwtUtils.verifyToken(token, config.jwt_access_secret);

    if (!verifiedToken.success) {
      next();
      return;
    }

    const { email, name, userId, role } = verifiedToken.data as JwtPayload;

    if (!userId || !email) {
      next();
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId, email, name, role: role as Role },
      select: { id: true, email: true, name: true, role: true, status: true },
    });

    if (!user || user.status === "BLOCKED") {
      next();
      return;
    }

    req.user = {
      email: user.email,
      name: user.name,
      userId: user.id,
      role: user.role,
    };

    next();
  }
);
