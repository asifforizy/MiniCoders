import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

import { redisClient } from "../lib/redis";
import { AppError } from "../utils/AppError";
import { catchAsync } from "../utils/catchAsync";

type RateLimitOptions = {
  bucket: string;
  windowMs: number;
  max: number;
};

type MemoryBucket = {
  hits: number[];
};

const memoryBuckets = new Map<string, MemoryBucket>();

const pruneMemoryBucket = (key: string, windowMs: number) => {
  const now = Date.now();
  const bucket = memoryBuckets.get(key);

  if (!bucket) return [];

  bucket.hits = bucket.hits.filter((timestamp) => now - timestamp < windowMs);

  if (bucket.hits.length === 0) {
    memoryBuckets.delete(key);
  }

  return bucket.hits;
};

export const rateLimit = ({ bucket, windowMs, max }: RateLimitOptions) =>
  catchAsync(async (req: Request, _res: Response, next: NextFunction) => {
    const identity = req.user?.userId ?? req.ip ?? "anonymous";
    const key = `ratelimit:${bucket}:${identity}`;

    if (redisClient.isReady) {
      try {
        const count = await redisClient.incr(key);

        if (count === 1) {
          await redisClient.pExpire(key, windowMs);
        }

        if (count > max) {
          throw new AppError(
            httpStatus.TOO_MANY_REQUESTS,
            "Too many requests. Please wait a moment and try again."
          );
        }

        next();
        return;
      } catch (error) {
        if (error instanceof AppError) {
          throw error;
        }

        console.error("Redis rate limiter failed, using memory:", error);
      }
    }

    const hits = pruneMemoryBucket(key, windowMs);
    hits.push(Date.now());

    if (!memoryBuckets.has(key)) {
      memoryBuckets.set(key, { hits });
    }

    if (hits.length > max) {
      throw new AppError(
        httpStatus.TOO_MANY_REQUESTS,
        "Too many requests. Please wait a moment and try again."
      );
    }

    next();
  });
