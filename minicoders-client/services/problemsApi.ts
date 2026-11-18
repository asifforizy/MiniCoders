
import {
  ProblemDetail,
  ProblemDetailResponse,
  ProblemsData,
  ProblemsResponse,
  ProblemsSearchParams,
} from "@/utils/types";

export async function getProblems(
  params: ProblemsSearchParams = {}
): Promise<ProblemsData> {
  const qs = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") { 
      qs.set(key, String(value)); 
    }
  });

const res = await fetch(
  `${process.env.BACKEND_API_URL}/api/v1/problems?${qs.toString()}`,
  {
    cache: "no-store",
  }
);

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message ?? "Failed to fetch problems");
  }

  const json: ProblemsResponse = await res.json();
  return json.data;
}

export async function getProblemBySlug(slug: string): Promise<ProblemDetail> {
  const res = await fetch(
    `${process.env.BACKEND_API_URL}/api/v1/problems/${encodeURIComponent(slug)}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message ?? "Failed to fetch problem");
  }

  const json: ProblemDetailResponse = await res.json();
  return json.data;
}
