"use server";

export async function resetPassword(payload: { token: string; password: string }) {
  const res = await fetch(`${process.env.BACKEND_API_URL}/api/v1/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    return { success: false as const, message: data?.message || "Password reset failed" };
  }

  return { success: true as const, data };
}