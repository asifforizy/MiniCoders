"use server";

import { cookies } from "next/headers";

export async function logout() {
  const cookieStore = await cookies();

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  };

  cookieStore.set("accessToken", "", { ...options, maxAge: 0 });
  cookieStore.set("refreshToken", "", { ...options, maxAge: 0 });

  return { success: true as const };
}
