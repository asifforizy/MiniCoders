import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, BarChart3, Trophy, TrendingUp, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Contests – Coming Soon",
};

const teasers: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Zap, title: "Live Contests", text: "Compete in real time" },
  { icon: BarChart3, title: "Leaderboards", text: "Climb the global ranks" },
  { icon: TrendingUp, title: "Ratings", text: "Track your growth" },
];

export default function ContestsPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4 text-foreground">
      {/* grid background */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:48px_48px] opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />

      {/* glowing blobs */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 animate-pulse rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 animate-pulse rounded-full bg-primary/20 blur-3xl [animation-delay:1.5s]" />

      <div className="relative z-10 w-full max-w-2xl text-center">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl">
          <span className="bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
            Contests
          </span>
          <br />
          <span className="text-foreground/80">are coming soon</span>
        </h1>

        <p className="mx-auto mt-5 max-w-md text-muted-foreground">
          We&apos;re building something big. The contest feature will be
          implemented later. Until then, sharpen your skills with practice
          problems.
        </p>

        {/* terminal card */}
        <div className="mx-auto mt-10 max-w-md overflow-hidden rounded-xl border border-border bg-card/70 text-left shadow-2xl backdrop-blur">
          <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-destructive/70" />
            <span className="h-3 w-3 rounded-full bg-muted-foreground/50" />
            <span className="h-3 w-3 rounded-full bg-primary/70" />
            <span className="ml-3 text-xs text-muted-foreground">contest.ts</span>
          </div>
          <pre className="overflow-x-auto p-4 font-mono text-sm leading-relaxed">
            <code>
              <span className="text-primary">function</span>{" "}
              <span className="text-foreground">startContest</span>
              <span className="text-muted-foreground">() {"{"}</span>
              {"\n"}
              {"  "}
              <span className="text-muted-foreground/70">{"// TODO: implement later"}</span>
              {"\n"}
              {"  "}
              <span className="text-primary">throw new</span>{" "}
              <span className="text-foreground">Error</span>
              <span className="text-muted-foreground">(</span>
              <span className="text-primary/80">&quot;Coming soon&quot;</span>
              <span className="text-muted-foreground">);</span>
              {"\n"}
              <span className="text-muted-foreground">{"}"}</span>
              <span className="ml-1 inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-primary" />
            </code>
          </pre>
        </div>

        {/* teasers */}
        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {teasers.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-xl border border-border bg-card/60 p-4 backdrop-blur transition hover:-translate-y-1 hover:border-primary/50 hover:bg-card"
            >
              <Icon className="mx-auto h-6 w-6 text-primary" />
              <div className="mt-2 font-semibold">{title}</div>
              <div className="text-sm text-muted-foreground">{text}</div>
            </div>
          ))}
        </div>

        <Link
          href="/"
          className="mt-10 inline-flex items-center gap-2 rounded-lg bg-primary px-7 py-3 font-semibold text-primary-foreground shadow-lg transition hover:scale-105 hover:bg-primary/90"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>
    </main>
  );
}