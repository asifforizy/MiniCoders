import type { Metadata } from "next";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BarChart3,
  Check,
  Gamepad2,
  Heart,
  Lightbulb,
  Medal,
  Play,
  Puzzle,
  Rocket,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  UserPlus,
} from "lucide-react";

const BRAND = "MiniCoders";

export const metadata: Metadata = {
  title: `${BRAND} – Learn Programming by Playing`,
  description:
    "A fun place where kids learn programming by playing games, solving problems and joining contests.",
};


const stats = [
  { value: "50+", label: "Game levels" },
  { value: "200+", label: "Practice problems" },
  { value: "100%", label: "Beginner friendly" },
];

const ways: {
  icon: LucideIcon;
  title: string;
  text: string;
  href: string;
  soon?: boolean;
}[] = [
  {
    icon: Gamepad2,
    title: "Play Games",
    text: "Guide characters, beat levels and unlock new worlds by writing your own code.",
    href: "/games",
  },
  {
    icon: Puzzle,
    title: "Solve Problems",
    text: "Bite-sized puzzles that grow from easy warm-ups to brain-bending challenges.",
    href: "/problems",
  },
  {
    icon: Trophy,
    title: "Join Contests",
    text: "Race against friends, climb the leaderboard and win badges for your skills.",
    href: "/contest",
    soon: true,
  },
];

const steps: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: UserPlus,
    title: "Pick your adventure",
    text: "Create a free account and choose a game or a puzzle to start with.",
  },
  {
    icon: Rocket,
    title: "Code to win",
    text: "Write simple code to solve the challenge and see the result right away.",
  },
  {
    icon: Medal,
    title: "Earn rewards",
    text: "Collect stars and badges, level up and unlock harder challenges.",
  },
];

const benefits: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: Heart,
    title: "Fun comes first",
    text: "Learning feels like playing, so kids stay curious and keep coming back.",
  },
  {
    icon: Lightbulb,
    title: "Real thinking skills",
    text: "Kids practice logic, patience and creative problem solving, not just syntax.",
  },
  {
    icon: BarChart3,
    title: "Learn at your own pace",
    text: "Every child can start from the basics and move forward when they are ready.",
  },
  {
    icon: ShieldCheck,
    title: "Safe and friendly",
    text: "A positive space built for young learners to explore and grow.",
  },
];

export default function HomePage() {
  return (
    <main>
      {/* 1. HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:48px_48px] opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
        <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-20 text-center sm:pt-28">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur">
            <Sparkles className="h-4 w-4 text-primary" />
            Programming made fun for kids
          </div>

          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold tracking-tight sm:text-6xl">
            Learn to code by{" "}
            <span className="bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
              playing
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
            Play games, solve puzzles and join contests while building real
            programming skills, one fun level at a time.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-7 py-3 font-semibold text-primary-foreground shadow-lg transition hover:scale-105 hover:bg-primary/90"
            >
              Start playing
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/problems"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-7 py-3 font-semibold transition hover:bg-accent"
            >
              <Play className="h-4 w-4" />
              Try a problem
            </Link>
          </div>

          {/* code preview */}
          <div className="mx-auto mt-14 max-w-xl overflow-hidden rounded-xl border border-border bg-card/70 text-left shadow-2xl backdrop-blur">
            <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-destructive/70" />
              <span className="h-3 w-3 rounded-full bg-muted-foreground/50" />
              <span className="h-3 w-3 rounded-full bg-primary/70" />
              <span className="ml-3 text-xs text-muted-foreground">level-1.js</span>
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-sm leading-relaxed">
              <code>
                <span className="text-muted-foreground/70">{"// Help the robot reach the star"}</span>
                {"\n"}
                <span className="text-foreground">robot</span>
                <span className="text-muted-foreground">.</span>
                <span className="text-primary">moveRight</span>
                <span className="text-muted-foreground">(3);</span>
                {"\n"}
                <span className="text-foreground">robot</span>
                <span className="text-muted-foreground">.</span>
                <span className="text-primary">jump</span>
                <span className="text-muted-foreground">();</span>
                {"\n"}
                <span className="text-foreground">robot</span>
                <span className="text-muted-foreground">.</span>
                <span className="text-primary">collectStar</span>
                <span className="text-muted-foreground">();</span>
              </code>
            </pre>
            <div className="flex items-center justify-between border-t border-border px-4 py-3 text-sm">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Check className="h-4 w-4 text-primary" />
                Level complete!
              </span>
              <span className="flex gap-0.5 text-primary">
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
              </span>
            </div>
          </div>

          {/* stats */}
          <div className="mx-auto mt-14 grid max-w-2xl grid-cols-3 gap-6">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="text-3xl font-bold text-primary">{s.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. THREE WAYS TO LEARN */}
      <section id="learn" className="border-t border-border bg-muted/30 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading
            eyebrow="Ways to learn"
            title="Three fun ways to grow your skills"
            text="Mix and match. Every path teaches real programming."
          />
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {ways.map(({ icon: Icon, title, text, href, soon }) => (
              <Link
                key={title}
                href={href}
                className="group rounded-xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:border-primary/50"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </span>
                  {soon && (
                    <span className="rounded-full border border-primary px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-primary">
                      Soon
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  {soon ? "Learn more" : "Explore"}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section id="how-it-works" className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading
            eyebrow="How it works"
            title="Start your coding adventure in 3 steps"
            text="No setup and nothing to install. Just open the page and play."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {steps.map(({ icon: Icon, title, text }, i) => (
              <div
                key={title}
                className="relative rounded-xl border border-border bg-card p-6 text-center"
              >
                <span className="absolute -top-3 left-1/2 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <span className="mx-auto mb-4 mt-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. WHY KIDS AND PARENTS LOVE IT */}
      <section id="why" className="border-t border-border bg-muted/30 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading
            eyebrow="Why us"
            title="Built for young learners"
            text="Kids have fun, parents see real progress."
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-xl border border-border bg-card p-6">
                <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FINAL CTA */}
      <section className="px-4 py-20">
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-2xl border border-border bg-card px-6 py-16 text-center">
          <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
          <h2 className="relative text-3xl font-bold sm:text-4xl">
            Ready to start your first level?
          </h2>
          <p className="relative mx-auto mt-4 max-w-md text-muted-foreground">
            Join for free and write your first line of code in minutes.
          </p>
          <Link
            href="/register"
            className="relative mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-7 py-3 font-semibold text-primary-foreground shadow-lg transition hover:scale-105 hover:bg-primary/90"
          >
            Create free account
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}

function SectionHeading({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <span className="text-sm font-semibold uppercase tracking-wider text-primary">
        {eyebrow}
      </span>
      <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      <p className="mt-4 text-muted-foreground">{text}</p>
    </div>
  );
}