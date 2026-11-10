"use server";

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

  return { success: true as const, data };
}