"use server";

import { cookies } from "next/headers";

import type { GetMeResponse } from "@/utils/types";

export const getMe = async (): Promise<GetMeResponse> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    console.log("getMe: no accessToken cookie on the Next server");
    return { success: false, message: "User not logged in!" };
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/me`,
      {
        headers: { Cookie: `accessToken=${accessToken}` },
        cache: "no-store",
      }
    );

    const result = await res.json().catch(() => null);
    console.log("getMe:", res.status, result?.message);

    if (!res.ok || !result) {
      return { success: false, message: result?.message ?? "Request failed" };
    }

    return result as GetMeResponse;
  } catch (error) {
    console.log("getMe: fetch failed", error);
    return { success: false, message: "Unable to reach server" };
  }
};