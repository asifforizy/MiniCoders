"use server";

import { cookies } from "next/headers";
import type {
  AdminProblem,
  AdminStats,
  AdminUser,
  CreateProblemPayload,
  UserStatus,
} from "@/utils/types";

async function adminFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const accessToken = (await cookies()).get("accessToken")?.value;

  if (!accessToken) {
    throw new Error("You are not logged in. Please log in again.");
  }

  const baseUrl = process.env.BACKEND_API_URL;

  if (!baseUrl) {
    throw new Error("BACKEND_API_URL is not configured");
  }

  const res = await fetch(`${baseUrl}/api/v1/admin${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Cookie: `accessToken=${accessToken}`,
    },
    cache: "no-store",
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(json?.message ?? "Request failed");
  }

  return json.data as T;
}

async function runMutation<T>(action: () => Promise<T>) {
  try {
    return { success: true as const, data: await action() };
  } catch (error) {
    return {
      success: false as const,
      message: error instanceof Error ? error.message : "Request failed",
    };
  }
}

export async function getAdminStats() {
  return adminFetch<AdminStats>("/stats");
}

export async function getAdminUsers() {
  return adminFetch<AdminUser[]>("/users");
}

export async function getAdminProblems() {
  return adminFetch<AdminProblem[]>("/problems");
}

export async function updateUserStatus(id: string, status: UserStatus) {
  return runMutation(() =>
    adminFetch<AdminUser>(`/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    })
  );
}

export async function createProblem(payload: CreateProblemPayload) {
  return runMutation(() =>
    adminFetch<AdminProblem>("/problems", {
      method: "POST",
      body: JSON.stringify(payload),
    })
  );
}

export async function deleteProblem(id: string) {
  return runMutation(() =>
    adminFetch<AdminProblem>(`/problems/${id}`, {
      method: "DELETE",
    })
  );
}
