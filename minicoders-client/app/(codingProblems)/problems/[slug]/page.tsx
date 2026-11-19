import { Suspense, type ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Clock,
  Code2,
  Cpu,
  Lightbulb,
  ListChecks,
  Tag,
} from "lucide-react";

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

function ProblemPageShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-background px-3 py-6 text-foreground sm:px-5 lg:py-8">
      <div className="mx-auto max-w-[1500px]">{children}</div>
    </main>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section>
      <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
        <span className="text-primary">{icon}</span>
        {title}
      </h3>
      <div className="text-sm leading-6 text-foreground/90">{children}</div>
    </section>
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
        <div className="h-[640px] animate-pulse rounded-2xl bg-muted/60" />
        <div className="h-[640px] animate-pulse rounded-2xl bg-muted/60" />
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
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          {problem.number ? (
            <span className="font-mono">#{problem.number}</span>
          ) : null}
          {problem.isSolved ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="size-3.5" />
              Solved
            </span>
          ) : null}
        </div>

        <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
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

          {problem.topic ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              <Tag className="size-3" />
              {problem.topic}
            </span>
          ) : null}

          <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            {problem.points} points
          </span>

          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            <Clock className="size-3" />
            {problem.timeLimit}s
          </span>

          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            <Cpu className="size-3" />
            {Math.round(problem.memoryLimit / 1024)} MB
          </span>
        </div>
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-2">
        <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="flex items-center gap-2 border-b border-border px-5 py-4">
            <Code2 className="size-4 text-primary" />
            <h2 className="text-sm font-semibold">Problem Statement</h2>
          </div>

          <div className="space-y-6 p-5">
            <div className="whitespace-pre-wrap text-sm leading-7 text-foreground/90">
              {problem.description || "No description provided."}
            </div>

            {problem.inputFormat ? (
              <Section title="Input Format" icon={<ListChecks className="size-4" />}>
                <p className="whitespace-pre-wrap">{problem.inputFormat}</p>
              </Section>
            ) : null}

            {problem.outputFormat ? (
              <Section title="Output Format" icon={<ListChecks className="size-4" />}>
                <p className="whitespace-pre-wrap">{problem.outputFormat}</p>
              </Section>
            ) : null}

            {problem.constraints ? (
              <Section title="Constraints" icon={<AlertIcon />}>
                <p className="whitespace-pre-wrap font-mono text-xs">
                  {problem.constraints}
                </p>
              </Section>
            ) : null}

            {problem.testCases.length > 0 ? (
              <Section title="Examples" icon={<Code2 className="size-4" />}>
                <div className="space-y-3">
                  {problem.testCases.map((testCase, index) => (
                    <div
                      key={testCase.id}
                      className="overflow-hidden rounded-lg border border-border"
                    >
                      <div className="border-b border-border bg-muted/40 px-3 py-1.5 text-xs font-medium text-muted-foreground">
                        Example {index + 1}
                      </div>
                      <div className="grid gap-3 p-3 sm:grid-cols-2">
                        <div>
                          <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                            Input
                          </p>
                          <pre className="max-h-40 overflow-auto rounded-md bg-background p-2 font-mono text-xs">
                            {testCase.input || "(no input)"}
                          </pre>
                        </div>
                        <div>
                          <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                            Output
                          </p>
                          <pre className="max-h-40 overflow-auto rounded-md bg-background p-2 font-mono text-xs">
                            {testCase.expectedOutput || "(no output)"}
                          </pre>
                        </div>
                      </div>
                      {testCase.explanation ? (
                        <p className="border-t border-border px-3 py-2 text-xs text-muted-foreground">
                          {testCase.explanation}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
              </Section>
            ) : null}

            {problem.hints.length > 0 ? (
              <Section title="Hints" icon={<Lightbulb className="size-4" />}>
                <ul className="list-disc space-y-1 pl-5">
                  {problem.hints.map((hint) => (
                    <li key={hint}>{hint}</li>
                  ))}
                </ul>
              </Section>
            ) : null}
          </div>

          <div className="grid gap-3 border-t border-border p-4 text-xs sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-background p-3">
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Author
              </p>
              <p className="mt-1 truncate text-sm font-medium text-foreground">
                {problem.author.name}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-background p-3">
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Published
              </p>
              <p className="mt-1 truncate text-sm font-medium text-foreground">
                {formatDate(problem.createdAt)}
              </p>
            </div>
          </div>
        </section>

        <CodeWorkspace problem={problem} />
      </div>
    </ProblemPageShell>
  );
}

function AlertIcon() {
  return <ListChecks className="size-4" />;
}
