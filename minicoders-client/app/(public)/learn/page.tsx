import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CircleCheck,
  Clock,
  Sparkles,
} from "lucide-react";

import {
  lessonModules,
  pythonLessons,
  type LessonModule,
} from "@/lib/learn/python-lessons";

export const metadata: Metadata = {
  title: "Learn Python | MiniCoders",
  description:
    "A beginner-friendly Python course covering syntax, variables, data types, input, type conversion, operators, conditionals, lists, tuples, dictionaries, and sets.",
};

function lessonsByModule(module: LessonModule) {
  return pythonLessons.filter((lesson) => lesson.module === module);
}

export default function LearnPage() {
  const firstLesson = pythonLessons[0];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-size-[48px_48px] opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />
        <div className="pointer-events-none absolute -left-32 -top-32 size-96 rounded-full bg-primary/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 right-0 size-96 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-semibold text-muted-foreground backdrop-blur">
              <Sparkles className="size-3.5 text-primary" />
              Python Basics · Beginner friendly
            </span>

            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Learn{" "}
              <span className="bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
                Python
              </span>{" "}
              from zero, one small step at a time.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              Short, clear lessons that start with your very first print
              statement and finish with lists, tuples, dictionaries, and sets.
              Read, try the examples, and complete a small challenge after every
              lesson.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href={`/learn/${firstLesson.slug}`}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg transition hover:scale-[1.02] hover:bg-primary/90"
              >
                Start learning
                <ArrowRight className="size-4" />
              </Link>

              <Link
                href="#lessons"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-5 py-2.5 text-sm font-semibold transition hover:bg-muted"
              >
                Browse lessons
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <CircleCheck className="size-4 text-primary" />
                {pythonLessons.length} short lessons
              </span>
              <span className="inline-flex items-center gap-2">
                <CircleCheck className="size-4 text-primary" />
                No setup needed
              </span>
              <span className="inline-flex items-center gap-2">
                <CircleCheck className="size-4 text-primary" />
                Built for beginners
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-primary/20 via-transparent to-primary/10 blur-2xl" />

            <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 text-zinc-100 shadow-2xl">
              <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-3">
                <span className="size-2.5 rounded-full bg-red-400/80" />
                <span className="size-2.5 rounded-full bg-amber-400/80" />
                <span className="size-2.5 rounded-full bg-emerald-400/80" />
                <span className="ml-2 text-xs text-zinc-500">first_program.py</span>
              </div>

              <pre className="overflow-x-auto p-5 text-[13px] leading-7 sm:text-sm">
                <code>
                  <span className="text-zinc-500"># Your first Python program</span>
                  {"\n"}
                  <span className="text-sky-300">name</span>
                  <span className="text-zinc-400"> = </span>
                  <span className="text-emerald-300">input</span>
                  <span className="text-zinc-300">(</span>
                  <span className="text-amber-300">&quot;Your name: &quot;</span>
                  <span className="text-zinc-300">)</span>
                  {"\n\n"}
                  <span className="text-emerald-300">print</span>
                  <span className="text-zinc-300">(</span>
                  <span className="text-amber-300">f&quot;Hello, </span>
                  <span className="text-zinc-300">{"{"}</span>
                  <span className="text-sky-300">name</span>
                  <span className="text-zinc-300">{"}"}</span>
                  <span className="text-amber-300">!&quot;</span>
                  <span className="text-zinc-300">)</span>
                </code>
              </pre>

              <div className="border-t border-zinc-800 bg-zinc-900/60 px-5 py-4">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                  Output
                </p>
                <pre className="mt-1 font-mono text-[13px] leading-6 text-emerald-300">
                  <code>
                    Your name: Ava{"\n"}
                    Hello, Ava!
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="lessons" className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <header className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-wide text-primary">
            The learning path
          </span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to start coding
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
            Follow the lessons in order, or jump straight to a topic you want to
            review. Each lesson builds on the one before it.
          </p>
        </header>

        <div className="mt-10 space-y-12">
          {lessonModules.map((module, moduleIndex) => {
            const lessons = lessonsByModule(module);

            return (
              <div key={module}>
                <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Module {moduleIndex + 1}
                    </p>
                    <h3 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
                      {module}
                    </h3>
                  </div>

                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                    {lessons.length} lessons
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {lessons.map((lesson) => {
                    const Icon = lesson.icon;

                    return (
                      <Link
                        key={lesson.slug}
                        href={`/learn/${lesson.slug}`}
                        className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10">
                            <Icon className="size-5 text-primary" />
                          </span>

                          <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
                            Lesson {String(lesson.order).padStart(2, "0")}
                          </span>
                        </div>

                        <h4 className="mt-4 text-base font-semibold tracking-tight">
                          {lesson.title}
                        </h4>

                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          {lesson.summary}
                        </p>

                        <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-4 text-xs">
                          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                            <Clock className="size-3.5" />
                            {lesson.readTime}
                          </span>

                          <span className="inline-flex items-center gap-1 font-semibold text-primary">
                            Read lesson
                            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-12 sm:px-6 md:flex-row md:items-center lg:px-8">
          <div className="flex items-start gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <BookOpen className="size-6 text-primary" />
            </span>

            <div>
              <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
                Ready to write your first line?
              </h2>
              <p className="mt-1 max-w-xl text-sm leading-6 text-muted-foreground">
                Start with a gentle introduction to Python, then work your way
                through the full beginner path.
              </p>
            </div>
          </div>

          <Link
            href={`/learn/${firstLesson.slug}`}
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg transition hover:scale-[1.02] hover:bg-primary/90"
          >
            Start learning
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
