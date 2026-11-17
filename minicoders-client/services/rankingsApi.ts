import { RankingsData, RankingsResponse } from "@/utils/types";

export async function getRankings(): Promise<RankingsData> {
  const res = await fetch(
    `${process.env.BACKEND_API_URL}/api/v1/rankings`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message ?? "Failed to fetch rankings");
  }

  const json: RankingsResponse = await res.json();
  return json.data;
}
