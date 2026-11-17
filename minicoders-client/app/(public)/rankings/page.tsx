import { Suspense, type ReactNode } from "react";
import type { Metadata } from "next";
import { Medal, Target, Trophy, Users } from "lucide-react";

import { getRankings } from "@/services/rankingsApi";
import { RankingEntry, RankingsData } from "@/utils/types";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Rankings | MiniCoders",
  description: "See the top coders ranked by the number of problems they solved.",
};

function getInitials(name: string) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return initials || "?";
}

const podiumStyles: Record<
  number,
  { badge: string; row: string; avatar: string }
> = {
  1: {
    badge: "bg-amber-500/15 text-amber-600",
    row: "bg-amber-500/5",
    avatar: "bg-amber-500/15 text-amber-700 ring-amber-500/30",
  },
  2: {
    badge: "bg-slate-500/15 text-slate-600",
    row: "bg-slate-500/5",
    avatar: "bg-slate-500/15 text-slate-700 ring-slate-500/30",
  },
  3: {
    badge: "bg-orange-500/15 text-orange-600",
    row: "bg-orange-500/5",
    avatar: "bg-orange-500/15 text-orange-700 ring-orange-500/30",
  },
};

function RankBadge({ rank }: { rank: number }) {
  const style = podiumStyles[rank];

  if (style) {
    return (
      <span
        className={cn(
          "flex size-10 items-center justify-center rounded-full",
          style.badge
        )}
      >
        {rank === 1 ? (
          <Trophy className="size-5" />
        ) : (
          <Medal className="size-5" />
        )}
      </span>
    );
  }

  return (
    <span className="flex size-10 items-center justify-center rounded-full bg-muted text-sm font-semibold tabular-nums text-muted-foreground">
      {rank}
    </span>
  );
}

function RankingRow({
  entry,
  topSolved,
}: {
  entry: RankingEntry;
  topSolved: number;
}) {
  const style = podiumStyles[entry.rank];

  return (
    <div
      className={cn(
        "grid grid-cols-[48px_minmax(0,1fr)_auto] items-center gap-3 rounded-xl px-3 py-3 sm:px-4",
        style?.row
      )}
    >
      <RankBadge rank={entry.rank} />

      <div className="flex min-w-0 items-center gap-3">
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ring-1",
            style?.avatar ?? "bg-muted text-muted-foreground ring-border"
          )}
        >
          {getInitials(entry.name)}
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground sm:text-base">
            {entry.name}
          </p>
          <p className="text-xs text-muted-foreground">
            Rank #{entry.rank}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <div className="hidden h-1.5 w-28 overflow-hidden rounded-full bg-muted sm:block">
          <div
            className="h-full rounded-full bg-primary"
            style={{
              width: `${Math.max((entry.solvedCount / topSolved) * 100, 8)}%`,
            }}
          />
        </div>

        <div className="min-w-14 text-right">
          <p className="text-lg font-bold tabular-nums text-foreground">
            {entry.solvedCount}
          </p>
          <p className="text-[11px] text-muted-foreground">solved</p>
        </div>
      </div>
    </div>
  );
}

function RankingsShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-background px-3 py-10 text-foreground sm:px-5">
      <div className="mx-auto max-w-5xl">{children}</div>
    </main>
  );
}

function RankingsSkeleton() {
  return (
    <RankingsShell>
      <div className="mb-8 flex flex-col items-center gap-3">
        <div className="size-14 animate-pulse rounded-2xl bg-muted" />
        <div className="h-9 w-52 animate-pulse rounded-full bg-muted" />
        <div className="h-4 w-80 max-w-full animate-pulse rounded-full bg-muted" />
      </div>
      <div className="h-12 animate-pulse rounded-xl bg-muted" />
      <div className="mt-3 space-y-2">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="h-16 animate-pulse rounded-xl bg-muted/60"
          />
        ))}
      </div>
    </RankingsShell>
  );
}

export default function RankingsPage() {
  return (
    <Suspense fallback={<RankingsSkeleton />}>
      <RankingsContent />
    </Suspense>
  );
}

async function RankingsContent() {
  let data: RankingsData | null = null;
  let errorMessage: string | null = null;

  try {
    data = await getRankings();
  } catch (error) {
    errorMessage =
      error instanceof Error ? error.message : "Failed to load rankings";
  }

  if (errorMessage || !data) {
    return (
      <RankingsShell>
        <div className="rounded-2xl border border-border bg-card px-6 py-20 text-center">
          <Trophy className="mx-auto mb-4 size-10 text-muted-foreground" />
          <h1 className="text-xl font-semibold">Rankings are unavailable</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {errorMessage ?? "Please try again later."}
          </p>
        </div>
      </RankingsShell>
    );
  }

  const { rankings, totalParticipants } = data;
  const topSolved = rankings[0]?.solvedCount ?? 1;

  return (
    <RankingsShell>
      <header className="mb-8 text-center">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/10">
          <Trophy className="size-7 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Rankings
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
          Coders ranked by the number of problems they have solved. Solve more
          problems to climb to the top.
        </p>
      </header>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="size-4" />
          <span>
            {totalParticipants} participant{totalParticipants === 1 ? "" : "s"}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Target className="size-4" />
          <span>Accepted solutions count once per problem</span>
        </div>
      </div>

      {rankings.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card px-6 py-20 text-center">
          <Trophy className="mx-auto mb-4 size-10 text-muted-foreground" />
          <h2 className="text-lg font-semibold">No rankings yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Be the first to solve a problem and claim the top spot.
          </p>
        </div>
      ) : (
        <section className="rounded-2xl border border-border bg-card p-2 shadow-sm sm:p-3">
          <div className="grid grid-cols-[48px_minmax(0,1fr)_auto] items-center gap-3 px-3 pb-2 pt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground sm:px-4">
            <span>Rank</span>
            <span>Coder</span>
            <span className="text-right">Problems solved</span>
          </div>

          <div className="space-y-1">
            {rankings.map((entry) => (
              <RankingRow
                key={entry.userId}
                entry={entry}
                topSolved={topSolved}
              />
            ))}
          </div>
        </section>
      )}
    </RankingsShell>
  );
}
