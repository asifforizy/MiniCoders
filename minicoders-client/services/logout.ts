import { revalidateTag } from "next/cache";

export const logout = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/logout`,
      {
        method: "POST",
        credentials: "include",
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Logout failed");
    }

    revalidateTag("my-profile", "max");
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};