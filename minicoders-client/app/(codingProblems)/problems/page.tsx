import { Suspense } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Check,
  Circle,
  Filter,
  Search,
  Trophy,
} from "lucide-react";

import { getProblems } from "@/services/problemsApi";
import { getMyProgress } from "@/services/submissionsApi";
import type {
  Difficulty,
  ProblemsData,
  ProblemsSearchParams,
  UserProgress,
} from "@/utils/types";

const difficultyStyles: Record<Difficulty, string> = {
  EASY: "text-chart-2",
  MEDIUM: "text-chart-4",
  HARD: "text-destructive",
  EXPERT: "text-chart-5",
};

const difficultyLabels: Record<Difficulty, string> = {
  EASY: "Easy",
  MEDIUM: "Medium",
  HARD: "Hard",
  EXPERT: "Expert",
};

export default function ProblemsPage({
  searchParams,
}: {
  searchParams: Promise<ProblemsSearchParams>;
}) {
  return (
    <Suspense fallback={<ProblemsSkeleton />}>
      <ProblemsContent searchParams={searchParams} />
    </Suspense>
  );
}

async function ProblemsContent({
  searchParams,
}: {
  searchParams: Promise<ProblemsSearchParams>;
}) {
  const params = await searchParams;

  let data: ProblemsData | null = null;
  let progress: UserProgress | null = null;
  let errorMessage: string | null = null;

  try {
    [data, progress] = await Promise.all([
      getProblems(params),
      getMyProgress(),
    ]);
  } catch (error) {
    errorMessage =
      error instanceof Error ? error.message : "Failed to load problems";
  }

  if (errorMessage || !data) {
    return (
      <main className="min-h-screen bg-background px-3 py-5 text-foreground sm:px-5">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-border bg-card px-6 py-20 text-center">
            <AlertCircle className="mx-auto mb-3 size-9 text-destructive" />
            <h1 className="text-lg font-semibold">Unable to load problems</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {errorMessage ?? "Something went wrong. Please try again."}
            </p>
            <Link
              href="/problems"
              className="mt-5 inline-block text-sm font-medium text-primary hover:underline"
            >
              Try again
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const { meta, problems, topics } = data;

  const buildHref = (page: number) => {
    const qs = new URLSearchParams();

    Object.entries({ ...params, page: String(page) }).forEach(
      ([key, value]) => {
        if (typeof value === "string" && value) {
          qs.set(key, value);
        }
      }
    );

    return `/problems?${qs.toString()}`;
  };

  return (
    <main className="min-h-screen bg-background px-3 py-5 text-foreground sm:px-5">
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Problems</h1>
            <p className="text-sm text-muted-foreground">
              Practise coding with beginner-friendly challenges.
            </p>
          </div>

          {progress ? (
            <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-2.5">
              <Trophy className="size-5 text-chart-4" />
              <div className="min-w-32">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-foreground">
                    {progress.totals.solved} solved
                  </span>
                  <span className="text-muted-foreground">
                    {progress.totals.completion}%
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${progress.totals.completion}%` }}
                  />
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <form
            method="GET"
            className="flex min-w-0 flex-1 flex-wrap items-center gap-2"
          >
            <div className="relative min-w-[180px] flex-1">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                name="search"
                defaultValue={params.search ?? ""}
                placeholder="Search problems"
                className="h-10 w-full rounded-full border border-input bg-card pl-9 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <select
              name="difficulty"
              defaultValue={params.difficulty ?? ""}
              aria-label="Filter by difficulty"
              className="h-10 min-w-[125px] rounded-full border border-input bg-card px-4 text-sm text-foreground outline-none transition hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">All difficulties</option>
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
              <option value="EXPERT">Expert</option>
            </select>

            <select
              name="topic"
              defaultValue={params.topic ?? ""}
              aria-label="Filter by topic"
              className="h-10 min-w-[125px] rounded-full border border-input bg-card px-4 text-sm text-foreground outline-none transition hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">All topics</option>
              {topics.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>

            <select
              name="sortBy"
              defaultValue={params.sortBy ?? "createdAt"}
              aria-label="Sort problems by"
              className="h-10 min-w-[115px] rounded-full border border-input bg-card px-4 text-sm text-foreground outline-none transition hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="createdAt">Newest</option>
              <option value="number">Problem number</option>
              <option value="title">Title</option>
              <option value="points">Points</option>
              <option value="difficulty">Difficulty</option>
            </select>

            <select
              name="sortOrder"
              defaultValue={params.sortOrder ?? "desc"}
              aria-label="Sort order"
              className="h-10 min-w-[95px] rounded-full border border-input bg-card px-4 text-sm text-foreground outline-none transition hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>

            <button
              type="submit"
              className="h-10 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Apply
            </button>

            <Link
              href="/problems"
              className="flex h-10 items-center rounded-full border border-border px-4 text-sm text-muted-foreground transition hover:bg-accent hover:text-foreground"
            >
              Reset
            </Link>
          </form>

          <div className="ml-auto flex items-center gap-2 whitespace-nowrap px-2 text-sm text-muted-foreground">
            <Filter className="size-4" />
            <span>{meta.total} problems</span>
          </div>
        </div>

        {problems.length === 0 ? (
          <div className="rounded-lg border border-border bg-card py-20 text-center">
            <Search size={30} className="mx-auto mb-3 text-muted-foreground" />
            <p className="font-medium text-foreground">No problems found.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try changing your search or filters.
            </p>
            <Link
              href="/problems"
              className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
            >
              Clear all filters
            </Link>
          </div>
        ) : (
          <div className="space-y-0.5">
            {problems.map((problem, index) => (
              <Link
                key={problem.id}
                href={`/problems/${problem.slug}`}
                className={`
                  group grid grid-cols-[minmax(0,1fr)_auto]
                  items-center gap-2 rounded-lg px-3 py-3.5
                  transition-colors duration-150
                  hover:bg-accent
                  sm:grid-cols-[44px_minmax(0,1fr)_110px_100px_90px]
                  sm:px-5
                  ${index % 2 === 0 ? "bg-muted/50" : ""}
                `}
              >
                <div className="hidden items-center gap-2 sm:flex">
                  {problem.isSolved ? (
                    <span className="flex size-4 items-center justify-center rounded-full bg-emerald-600 text-white">
                      <Check size={11} strokeWidth={3} />
                    </span>
                  ) : (
                    <Circle className="size-3.5 text-border" />
                  )}
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {problem.number ?? "-"}
                  </span>
                </div>

                <div className="flex min-w-0 items-center gap-3">
                  {problem.isSolved ? (
                    <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white sm:hidden">
                      <Check size={11} strokeWidth={3} />
                    </span>
                  ) : null}
                  <div className="min-w-0">
                    <h2 className="truncate text-sm font-semibold text-foreground transition group-hover:text-primary">
                      {problem.title}
                    </h2>
                    <p className="truncate text-xs text-muted-foreground sm:hidden">
                      {problem.topic ?? "General"} ·{" "}
                      <span className={difficultyStyles[problem.difficulty]}>
                        {difficultyLabels[problem.difficulty]}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="hidden truncate text-xs text-muted-foreground sm:block">
                  {problem.topic ?? "General"}
                </div>

                <div
                  className={`text-right text-xs font-medium sm:text-sm ${
                    difficultyStyles[problem.difficulty]
                  }`}
                >
                  {difficultyLabels[problem.difficulty]}
                </div>

                <div className="text-right text-xs tabular-nums text-muted-foreground sm:text-sm">
                  {problem.points} pts
                </div>
              </Link>
            ))}
          </div>
        )}

        {meta.totalPages > 1 && (
          <nav className="mt-6 flex items-center justify-between">
            {meta.page > 1 ? (
              <Link
                href={buildHref(meta.page - 1)}
                className="rounded-md border border-border px-4 py-2 text-sm text-foreground transition hover:bg-accent"
              >
                Previous
              </Link>
            ) : (
              <span />
            )}

            <span className="text-sm text-muted-foreground">
              Page {meta.page} of {meta.totalPages}
            </span>

            {meta.page < meta.totalPages ? (
              <Link
                href={buildHref(meta.page + 1)}
                className="rounded-md border border-border px-4 py-2 text-sm text-foreground transition hover:bg-accent"
              >
                Next
              </Link>
            ) : (
              <span />
            )}
          </nav>
        )}
      </div>
    </main>
  );
}

function ProblemsSkeleton() {
  return (
    <main className="min-h-screen bg-background px-3 py-5 text-foreground sm:px-5">
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 h-12 w-56 animate-pulse rounded-full bg-muted" />
        <div className="mb-4 h-10 animate-pulse rounded-full bg-muted" />
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-12 animate-pulse rounded-lg bg-muted/60"
            />
          ))}
        </div>
      </div>
    </main>
  );
}
