import { Suspense } from "react";
import { getProblems } from "@/services/problemsApi";
import { Difficulty, ProblemsSearchParams } from "@/utils/types";
import Link from "next/link";
import { Search, LockKeyhole, Star, Check } from "lucide-react";

const difficultyStyles: Record<Difficulty, string> = {
  EASY: "text-chart-2",
  MEDIUM: "text-chart-4",
  HARD: "text-destructive",
};

// ✅ New default export — sync wrapper with Suspense
export default function ProblemsPage({
  searchParams,
}: {
  searchParams: Promise<ProblemsSearchParams>;
}) {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-background px-3 py-5 text-foreground sm:px-5">
          <div className="mx-auto max-w-7xl">
            <div className="mb-4 h-10 animate-pulse rounded-full bg-muted" />
            <div className="space-y-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-12 animate-pulse rounded-lg bg-muted/60"
                />
              ))}
            </div>
          </div>
        </main>
      }
    >
      <ProblemsContent searchParams={searchParams} />
    </Suspense>
  );
}

// ⬇️ Your original component, unchanged except the name & props type
async function ProblemsContent({
  searchParams,
}: {
  searchParams: Promise<ProblemsSearchParams>;
}) {
  const params = await searchParams;                // ✅ now inside Suspense
  const { meta, problems } = await getProblems(params);

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

        {/* Toolbar */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <form method="GET" className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
            <div className="relative min-w-[180px] flex-1">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                name="search"
                defaultValue={params.search ?? ""}
                placeholder="Search questions"
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
            </select>

            <select
              name="sortBy"
              defaultValue={params.sortBy ?? "createdAt"}
              aria-label="Sort problems by"
              className="h-10 min-w-[115px] rounded-full border border-input bg-card px-4 text-sm text-foreground outline-none transition hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="createdAt">Newest</option>
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
              <option value="desc">Newest first</option>
              <option value="asc">Oldest first</option>
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
            <span className="h-4 w-4 rounded-full border-2 border-border" />
            <span>{meta.total} Problems</span>
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
            {problems.map((problem, index) => {
              const extra = problem as typeof problem & {
                acceptanceRate?: number;
                isPremium?: boolean;
                isSolved?: boolean;
              };

              return (
                <Link
                  key={problem.id}
                  href={`/problems/${problem.slug}`}
                  className={`
                    group grid grid-cols-[minmax(0,1fr)_65px_65px_22px_22px]
                    items-center gap-2 rounded-lg px-3 py-3.5
                    transition-colors duration-150
                    hover:bg-accent
                    sm:grid-cols-[minmax(0,1fr)_90px_85px_30px_30px]
                    sm:px-5
                    ${index % 2 === 0 ? "bg-muted/50" : ""}
                  `}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    {extra.isSolved ? (
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Check size={11} strokeWidth={3} />
                      </span>
                    ) : (
                      <span className="h-4 w-4 shrink-0 rounded-full border border-border" />
                    )}
                    <h2 className="truncate text-sm font-semibold text-foreground transition group-hover:text-primary">
                      {problem.title}
                    </h2>
                  </div>

                  <div className="text-right text-xs tabular-nums text-muted-foreground sm:text-sm">
                    {typeof extra.acceptanceRate === "number"
                      ? `${extra.acceptanceRate}%`
                      : ""}
                  </div>

                  <div
                    className={`text-right text-xs font-medium sm:text-sm ${
                      difficultyStyles[problem.difficulty]
                    }`}
                  >
                    {problem.difficulty === "MEDIUM"
                      ? "Med."
                      : problem.difficulty.charAt(0) +
                        problem.difficulty.slice(1).toLowerCase()}
                  </div>

                  <div className="flex justify-center">
                    {extra.isPremium && (
                      <LockKeyhole size={15} className="text-muted-foreground" />
                    )}
                  </div>

                  <div className="flex justify-center">
                    <Star
                      size={17}
                      className="text-muted-foreground transition group-hover:text-chart-4"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {meta.totalPages > 1 && (
          <nav className="mt-6 flex items-center justify-between">
            {meta.page > 1 ? (
              <Link
                href={buildHref(meta.page - 1)}
                className="rounded-md border border-border px-4 py-2 text-sm text-foreground transition hover:bg-accent"
              >
                ← Previous
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
                Next →
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