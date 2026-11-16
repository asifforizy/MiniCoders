
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Gamepad2,
  Brain,
  Puzzle,
  Code2,
  Trophy,
  Zap,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Games – Coming Soon",
};

const teasers: {
  icon: LucideIcon;
  title: string;
  text: string;
}[] = [
  {
    icon: Brain,
    title: "Brain Challenges",
    text: "Train your logical thinking",
  },
  {
    icon: Puzzle,
    title: "Logic Puzzles",
    text: "Solve fun interactive puzzles",
  },
  {
    icon: Trophy,
    title: "Game Leaderboards",
    text: "Challenge and compete with others",
  },
];

export default function GamesPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4 text-foreground">

      {/* Grid Background */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-size-[48px_48px] opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />

      {/* Glowing Background */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 animate-pulse rounded-full bg-primary/20 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 animate-pulse rounded-full bg-primary/20 blur-3xl [animation-delay:1.5s]" />

      <div className="relative z-10 w-full max-w-2xl text-center">

        {/* Game Icon */}
        <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-2xl border border-border bg-card shadow-lg">
          <Gamepad2 className="h-10 w-10 text-primary" />
        </div>

        {/* Heading */}
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl">
          <span className="bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
            Games
          </span>
          <br />
          <span className="text-foreground/80">
            are coming soon
          </span>
        </h1>

        <p className="mx-auto mt-5 max-w-md text-muted-foreground">
          Learning doesn't have to be boring! We're building exciting
          educational games to help you improve your programming skills,
          sharpen your logic, and have fun while learning.
        </p>


        {/* Game Teasers */}
        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {teasers.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-xl border border-border bg-card/60 p-4 backdrop-blur transition hover:-translate-y-1 hover:border-primary/50 hover:bg-card"
            >
              <Icon className="mx-auto h-6 w-6 text-primary" />

              <div className="mt-2 font-semibold">
                {title}
              </div>

              <div className="text-sm text-muted-foreground">
                {text}
              </div>
            </div>
          ))}
        </div>

        {/* Coming Soon Status */}
        <div className="mt-8 flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground">
          <Sparkles className="h-4 w-4 text-primary" />
          Something fun is on its way!
        </div>

        {/* Back Button */}
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-7 py-3 font-semibold text-primary-foreground shadow-lg transition hover:scale-105 hover:bg-primary/90"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>
    </main>
  );
}
