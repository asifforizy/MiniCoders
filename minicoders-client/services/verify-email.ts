"use server";

import { cookies } from "next/headers";

export async function verifyEmail(payload: { email: string; otp: string }) {
  const res = await fetch(`${process.env.BACKEND_API_URL}/api/v1/auth/verify-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    return { success: false as const, message: data?.message || "Email verification failed" };
  }

  const accessToken: string | undefined = data?.data?.accessToken;
  const refreshToken: string | undefined = data?.data?.refreshToken;

  if (accessToken) {
    const cookieStore = await cookies();
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
    };
    cookieStore.set("accessToken", accessToken, { ...options, maxAge: 60 * 60 * 24 });
    if (refreshToken) {
      cookieStore.set("refreshToken", refreshToken, { ...options, maxAge: 60 * 60 * 24 * 7 });
    }
  }

  return { success: true as const, data };
}