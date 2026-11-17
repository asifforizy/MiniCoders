"use server";

import { cookies } from "next/headers";
import type { AdminStats, AdminUser, UserStatus } from "@/utils/types";

async function superAdminFetch<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const accessToken = (await cookies()).get("accessToken")?.value;

  if (!accessToken) {
    throw new Error("You are not logged in. Please log in again.");
  }

  const baseUrl = process.env.BACKEND_API_URL;

  if (!baseUrl) {
    throw new Error("BACKEND_API_URL is not configured");
  }

  const res = await fetch(`${baseUrl}/api/v1/super-admin${path}`, {
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

export async function getSuperAdminStats() {
  return superAdminFetch<AdminStats>("/stats");
}

export async function getSuperAdminUsers() {
  return superAdminFetch<AdminUser[]>("/users");
}

export async function updateUserStatus(id: string, status: UserStatus) {
  return runMutation(() =>
    superAdminFetch<AdminUser>(`/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    })
  );
}

export async function makeUserAdmin(id: string) {
  return runMutation(() =>
    superAdminFetch(`/users/${id}/make-admin`, {
      method: "PATCH",
    })
  );
}
