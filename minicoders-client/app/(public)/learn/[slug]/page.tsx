import { Suspense, type ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  CircleCheck,
  Clock,
  Lightbulb,
  Sparkles,
} from "lucide-react";

import { LessonBlocks } from "@/components/learn/lesson-blocks";
import { LessonSidebar } from "@/components/learn/lesson-sidebar";
import {
  getLessonBySlug,
  getLessonNeighbors,
  pythonLessons,
} from "@/lib/learn/python-lessons";

type LessonPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return pythonLessons.map((lesson) => ({ slug: lesson.slug }));
}

export async function generateMetadata({
  params,
}: LessonPageProps): Promise<Metadata> {
  const { slug } = await params;
  const lesson = getLessonBySlug(slug);

  if (!lesson) {
    return { title: "Lesson not found | MiniCoders" };
  }

  return {
    title: `${lesson.title} | Python Basics | MiniCoders`,
    description: lesson.description,
  };
}

function LessonShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {children}
      </div>
    </main>
  );
}

function LessonSkeleton() {
  return (
    <LessonShell>
      <div className="mb-8 h-5 w-64 animate-pulse rounded-full bg-muted" />
      <div className="grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)]">
        <div className="hidden space-y-4 lg:block">
          <div className="h-8 w-40 animate-pulse rounded-lg bg-muted" />
          <div className="h-44 animate-pulse rounded-lg bg-muted/60" />
        </div>
        <div>
          <div className="h-9 w-3/4 animate-pulse rounded-full bg-muted" />
          <div className="mt-4 h-4 w-full animate-pulse rounded-full bg-muted" />
          <div className="mt-2 h-4 w-2/3 animate-pulse rounded-full bg-muted" />
          <div className="mt-8 h-40 animate-pulse rounded-2xl bg-muted/60" />
          <div className="mt-6 space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-4 animate-pulse rounded-full bg-muted/70"
              />
            ))}
          </div>
        </div>
      </div>
    </LessonShell>
  );
}

export default function LessonPage({ params }: LessonPageProps) {
  return (
    <Suspense fallback={<LessonSkeleton />}>
      <LessonContent params={params} />
    </Suspense>
  );
}

async function LessonContent({ params }: LessonPageProps) {
  const { slug } = await params;
  const lesson = getLessonBySlug(slug);

  if (!lesson) {
    notFound();
  }

  const { previous, next } = getLessonNeighbors(slug);
  const Icon = lesson.icon;

  return (
    <LessonShell>
      <div className="mb-6 flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
        <Link
          href="/learn"
          className="inline-flex shrink-0 items-center gap-1.5 transition hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Learn
        </Link>
        <ChevronRight className="size-3.5 shrink-0" />
        <span className="shrink-0">Python Basics</span>
        <ChevronRight className="size-3.5 shrink-0" />
        <span className="truncate text-foreground">{lesson.title}</span>
      </div>

      <div className="grid items-start gap-10 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="hidden lg:sticky lg:top-24 lg:block">
          <LessonSidebar activeSlug={lesson.slug} />
        </aside>

        <article className="min-w-0">
          <header>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <Icon className="size-3.5" />
                {lesson.module}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                <Clock className="size-3.5" />
                {lesson.readTime}
              </span>
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                Lesson {lesson.order} of {pythonLessons.length}
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
              {lesson.title}
            </h1>

            <p className="mt-3 text-[15px] leading-7 text-muted-foreground sm:text-base">
              {lesson.description}
            </p>
          </header>

          <section className="mt-6 rounded-2xl border border-border bg-card p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <CircleCheck className="size-4 text-primary" />
              What you will learn
            </h2>

            <ul className="mt-3 space-y-2">
              {lesson.objectives.map((objective) => (
                <li
                  key={objective}
                  className="flex items-start gap-2 text-sm leading-6 text-foreground/80"
                >
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                  {objective}
                </li>
              ))}
            </ul>
          </section>

          <div className="mt-8">
            <LessonBlocks blocks={lesson.blocks} />
          </div>

          <section className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <Lightbulb className="size-4 text-primary" />
              Key takeaways
            </h2>

            <ul className="mt-3 space-y-2">
              {lesson.keyPoints.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-2 text-sm leading-6 text-foreground/80"
                >
                  <CircleCheck className="mt-1 size-4 shrink-0 text-primary" />
                  {point}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
            <div className="flex items-center gap-2 border-b border-border px-5 py-3">
              <Sparkles className="size-4 text-primary" />
              <h2 className="text-sm font-semibold">Try it yourself</h2>
            </div>

            <div className="p-5">
              <p className="text-sm leading-7 text-foreground/85">
                {lesson.practice}
              </p>
              <p className="mt-3 text-xs text-muted-foreground">
                Tip: type the code by hand instead of copying it. Fixing your
                own mistakes is where the learning happens.
              </p>
            </div>
          </section>

          <nav
            aria-label="Lesson navigation"
            className="mt-10 grid gap-3 border-t border-border pt-6 sm:grid-cols-2"
          >
            {previous ? (
              <Link
                href={`/learn/${previous.slug}`}
                className="group flex flex-col rounded-xl border border-border p-4 transition hover:border-primary/40 hover:bg-muted/40"
              >
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <ArrowLeft className="size-3.5" />
                  Previous lesson
                </span>
                <span className="mt-1 text-sm font-semibold group-hover:text-primary">
                  {previous.title}
                </span>
              </Link>
            ) : (
              <span className="hidden sm:block" />
            )}

            {next ? (
              <Link
                href={`/learn/${next.slug}`}
                className="group flex flex-col rounded-xl border border-border p-4 text-right transition hover:border-primary/40 hover:bg-muted/40 sm:col-start-2"
              >
                <span className="inline-flex items-center justify-end gap-1.5 text-xs font-medium text-muted-foreground">
                  Next lesson
                  <ArrowRight className="size-3.5" />
                </span>
                <span className="mt-1 text-sm font-semibold group-hover:text-primary">
                  {next.title}
                </span>
              </Link>
            ) : (
              <Link
                href="/learn"
                className="group flex flex-col rounded-xl border border-border p-4 text-right transition hover:border-primary/40 hover:bg-muted/40 sm:col-start-2"
              >
                <span className="inline-flex items-center justify-end gap-1.5 text-xs font-medium text-muted-foreground">
                  Course complete
                  <ArrowRight className="size-3.5" />
                </span>
                <span className="mt-1 text-sm font-semibold group-hover:text-primary">
                  Back to all lessons
                </span>
              </Link>
            )}
          </nav>
        </article>
      </div>
    </LessonShell>
  );
}
