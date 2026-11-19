import Link from "next/link";
import { BookOpen } from "lucide-react";

import {
  lessonModules,
  pythonLessons,
  type Lesson,
} from "@/lib/learn/python-lessons";
import { cn } from "@/lib/utils";

function groupLessons(module: string): Lesson[] {
  return pythonLessons.filter((lesson) => lesson.module === module);
}

export function LessonSidebar({ activeSlug }: { activeSlug: string }) {
  return (
    <nav aria-label="Python lessons" className="space-y-6">
      <Link
        href="/learn"
        className="flex items-center gap-2 text-sm font-semibold text-foreground transition hover:text-primary"
      >
        <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
          <BookOpen className="size-4 text-primary" />
        </span>
        Python Basics
      </Link>

      <div className="space-y-5">
        {lessonModules.map((module) => (
          <div key={module}>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              {module}
            </p>

            <ul className="space-y-0.5 border-l border-border">
              {groupLessons(module).map((lesson) => {
                const isActive = lesson.slug === activeSlug;

                return (
                  <li key={lesson.slug}>
                    <Link
                      href={`/learn/${lesson.slug}`}
                      className={cn(
                        "-ml-px flex items-center gap-2 border-l-2 py-1.5 pl-3 text-sm transition",
                        isActive
                          ? "border-primary font-semibold text-foreground"
                          : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {lesson.order}
                      </span>
                      <span className="truncate">{lesson.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}
