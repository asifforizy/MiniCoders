import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

import { Pagination } from "@/components/admin/dashboard/pagination";
import { ProblemManagement } from "@/components/admin/dashboard/problem-management";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getAdminProblems } from "@/services/adminApi";
import type { AdminProblemsData, AdminProblemsQuery } from "@/utils/types";

export default function AdminProblemsPage({
  searchParams,
}: {
  searchParams: Promise<AdminProblemsQuery>;
}) {
  return (
    <Suspense fallback={<ProblemsSkeleton />}>
      <AdminProblemsContent searchParams={searchParams} />
    </Suspense>
  );
}

async function AdminProblemsContent({
  searchParams,
}: {
  searchParams: Promise<AdminProblemsQuery>;
}) {
  const params = await searchParams;

  let data: AdminProblemsData | null = null;
  let errorMessage = "Something went wrong while loading problems.";

  try {
    data = await getAdminProblems(params);
  } catch (error) {
    errorMessage =
      error instanceof Error ? error.message : "Unable to load problems.";
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-background px-4 py-12 text-foreground sm:px-6">
        <div className="mx-auto max-w-xl">
          <Card>
            <CardHeader>
              <CardTitle>Unable to load problem management</CardTitle>
              <CardDescription>
                Sign in with an admin account and try again.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-destructive">{errorMessage}</p>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  const { problems, meta } = data;

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="space-y-2">
          <Link
            href="/admin/dashboard"
            className="inline-flex h-8 w-fit items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 text-sm font-medium transition hover:bg-muted"
          >
            <ArrowLeft className="size-4" />
            Back to dashboard
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">
            Problem management
          </h1>
          <p className="text-sm text-muted-foreground">
            Review published and draft problems, then add or edit them.
          </p>
        </header>

        <form
          method="GET"
          className="flex flex-col gap-2 sm:flex-row sm:items-center"
        >
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              name="search"
              defaultValue={params.search ?? ""}
              placeholder="Search by title, description, or topic"
              className="pl-8"
            />
          </div>

          <select
            name="difficulty"
            defaultValue={params.difficulty ?? ""}
            aria-label="Filter problems by difficulty"
            className="h-8 min-w-[140px] rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
          >
            <option value="">All difficulties</option>
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
            <option value="EXPERT">Expert</option>
          </select>

          <select
            name="published"
            defaultValue={params.published ?? ""}
            aria-label="Filter problems by status"
            className="h-8 min-w-[140px] rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
          >
            <option value="">All statuses</option>
            <option value="true">Published</option>
            <option value="false">Draft</option>
          </select>

          <button
            type="submit"
            className="h-8 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            Apply
          </button>

          <Link
            href="/admin/problems"
            className="inline-flex h-8 items-center justify-center rounded-lg border border-border px-3 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            Reset
          </Link>
        </form>

        <ProblemManagement problems={problems} total={meta.total} />

        <Pagination
          meta={meta}
          basePath="/admin/problems"
          params={{
            search: params.search,
            difficulty: params.difficulty,
            published: params.published,
          }}
        />
      </div>
    </main>
  );
}

function ProblemsSkeleton() {
  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="space-y-2">
          <div className="h-8 w-32 animate-pulse rounded-lg bg-muted/70" />
          <div className="h-8 w-64 animate-pulse rounded-md bg-muted" />
          <div className="h-4 w-96 animate-pulse rounded-md bg-muted/70" />
        </div>

        <div className="h-8 animate-pulse rounded-lg bg-muted/60" />
        <div className="h-96 animate-pulse rounded-xl bg-muted/60" />
      </div>
    </main>
  );
}
