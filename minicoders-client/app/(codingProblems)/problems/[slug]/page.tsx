import { Suspense, type ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ChevronRight, Code2, Sparkles } from "lucide-react";

import { CodeWorkspace } from "@/components/problems/code-workspace";
import { getProblemBySlug } from "@/services/problemsApi";
import type { Difficulty, ProblemDetail } from "@/utils/types";

export const metadata: Metadata = {
  title: "Solve a Problem | MiniCoders",
  description: "Read the problem statement and write your solution.",
};

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

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-medium text-foreground">
        {value}
      </p>
    </div>
  );
}

function ProblemPageShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-background px-3 py-6 text-foreground sm:px-5 lg:py-8">
      <div className="mx-auto max-w-[1500px]">{children}</div>
    </main>
  );
}

function ProblemSkeleton() {
  return (
    <ProblemPageShell>
      <div className="mb-5 h-5 w-44 animate-pulse rounded-full bg-muted" />
      <div className="mb-4 h-10 w-2/3 max-w-lg animate-pulse rounded-full bg-muted" />
      <div className="mb-6 flex gap-2">
        <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
        <div className="h-6 w-24 animate-pulse rounded-full bg-muted" />
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="h-[540px] animate-pulse rounded-2xl bg-muted/60" />
        <div className="h-[540px] animate-pulse rounded-2xl bg-muted/60" />
      </div>
    </ProblemPageShell>
  );
}

export default function ProblemDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<ProblemSkeleton />}>
      <ProblemContent params={params} />
    </Suspense>
  );
}

async function ProblemContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let problem: ProblemDetail | null = null;
  let errorMessage: string | null = null;

  try {
    problem = await getProblemBySlug(slug);
  } catch (error) {
    errorMessage =
      error instanceof Error ? error.message : "Failed to load problem";
  }

  if (errorMessage || !problem) {
    return (
      <ProblemPageShell>
        <div className="rounded-2xl border border-border bg-card px-6 py-20 text-center">
          <Code2 className="mx-auto mb-4 size-10 text-muted-foreground" />
          <h1 className="text-xl font-semibold">Problem not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {errorMessage ?? "This problem does not exist."}
          </p>
          <Link
            href="/problems"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="size-4" />
            Back to problems
          </Link>
        </div>
      </ProblemPageShell>
    );
  }

  return (
    <ProblemPageShell>
      <div className="mb-4 flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
        <Link
          href="/problems"
          className="inline-flex shrink-0 items-center gap-1.5 transition hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Problems
        </Link>
        <ChevronRight className="size-3.5 shrink-0" />
        <span className="truncate text-foreground">{problem.title}</span>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {problem.title}
        </h1>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-semibold ${
              difficultyStyles[problem.difficulty]
            }`}
          >
            {difficultyLabels[problem.difficulty]}
          </span>

          <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            {problem.points} points
          </span>

          <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            by {problem.author.name}
          </span>
        </div>
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-2">
        <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="flex items-center gap-2 border-b border-border px-5 py-4">
            <Code2 className="size-4 text-primary" />
            <h2 className="text-sm font-semibold">Problem Statement</h2>
          </div>

          <div className="p-5">
            <div className="whitespace-pre-wrap text-sm leading-7 text-foreground/90">
              {problem.description || "No description provided."}
            </div>

            <div className="mt-8 flex items-start gap-3 rounded-xl border border-border bg-muted/30 p-4">
              <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-semibold">Demo mode</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  The editor is a preview. Code execution, test cases, and
                  submission judging will be connected later.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 border-t border-border p-4 sm:grid-cols-2">
            <DetailItem label="Author" value={problem.author.name} />
            <DetailItem
              label="Published"
              value={formatDate(problem.createdAt)}
            />
            <DetailItem
              label="Difficulty"
              value={difficultyLabels[problem.difficulty]}
            />
            <DetailItem label="Points" value={`${problem.points} points`} />
          </div>
        </section>

        <CodeWorkspace problemTitle={problem.title} />
      </div>
    </ProblemPageShell>
  );
}
