"use server";

import { cookies } from "next/headers";

export async function googleLogin(payload: { idToken: string }) {
  const res = await fetch(`${process.env.BACKEND_API_URL}/api/v1/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    return { success: false as const, message: data?.message || "Google login failed" };
  }

  // Tokens may come in the response body or in the backend's Set-Cookie headers
  let accessToken: string | undefined = data?.data?.accessToken ?? data?.accessToken;
  let refreshToken: string | undefined = data?.data?.refreshToken ?? data?.refreshToken;

  if (!accessToken) {
    for (const line of res.headers.getSetCookie()) {
      const [pair] = line.split(";");
      const index = pair.indexOf("=");
      const name = pair.slice(0, index).trim();
      const value = pair.slice(index + 1).trim();
      if (name === "accessToken") accessToken = value;
      if (name === "refreshToken") refreshToken = value;
    }
  }

  if (!accessToken) {
    return {
      success: false as const,
      message: "Google login worked, but no accessToken was found in the response",
    };
  }

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

  return { success: true as const, data };
}