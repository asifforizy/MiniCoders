import { Button } from "@/components/ui/button";
import {
ArrowRight,
Bot,
Code2,
Gamepad2,
Lightbulb,
Rocket,
Sparkles,
Trophy,
} from "lucide-react";

export default function HomePage() {
return ( <main className="min-h-screen bg-background">
{/* Hero Section */} <section className="relative overflow-hidden"> <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" /> <div className="absolute -right-20 top-20 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl" />


    <div className="container mx-auto px-6 py-20 lg:py-28">
      <div className="mx-auto max-w-4xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-2 text-sm font-medium">
          <Sparkles className="size-4 text-primary" />
          Learn. Build. Create.
        </div>

        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-7xl">
          Coding is more fun when{" "}
          <span className="text-primary">you build it yourself.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
          Welcome to Mini Coders — a fun and interactive place where kids
          can learn programming, solve challenges, build projects, and get
          help from an AI coding assistant.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button size="lg" className="gap-2">
            Start Learning
            <ArrowRight className="size-4" />
          </Button>

          <Button size="lg" variant="outline" className="gap-2">
            <Gamepad2 className="size-4" />
            Explore Challenges
          </Button>
        </div>
      </div>
    </div>
  </section>

  {/* Features */}
  <section className="border-y bg-muted/30">
    <div className="container mx-auto px-6 py-16">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold">
          Everything you need to code
        </h2>
        <p className="mt-3 text-muted-foreground">
          Learn programming through practice, projects, and challenges.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border bg-background p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
          <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-primary/10">
            <Code2 className="size-6 text-primary" />
          </div>
          <h3 className="font-semibold">Learn Coding</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Learn programming concepts through simple lessons designed for
            young learners.
          </p>
        </div>

        <div className="rounded-2xl border bg-background p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
          <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-yellow-500/10">
            <Lightbulb className="size-6 text-yellow-500" />
          </div>
          <h3 className="font-semibold">Solve Problems</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Practice your skills with fun coding problems and interactive
            challenges.
          </p>
        </div>

        <div className="rounded-2xl border bg-background p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
          <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-purple-500/10">
            <Bot className="size-6 text-purple-500" />
          </div>
          <h3 className="font-semibold">AI Coding Helper</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Stuck on your code? Ask our AI assistant for hints, explanations,
            and guidance.
          </p>
        </div>

        <div className="rounded-2xl border bg-background p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
          <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-orange-500/10">
            <Trophy className="size-6 text-orange-500" />
          </div>
          <h3 className="font-semibold">Earn &amp; Grow</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Complete challenges, track your progress, and celebrate your
            coding achievements.
          </p>
        </div>
      </div>
    </div>
  </section>

  {/* AI Assistant Section */}
  <section className="container mx-auto px-6 py-20 lg:py-28">
    <div className="grid items-center gap-10 lg:grid-cols-2">
      <div>
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-purple-500/10 px-3 py-1.5 text-sm font-medium text-purple-600 dark:text-purple-400">
          <Bot className="size-4" />
          Your Coding Companion
        </div>

        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Stuck on a problem?
          <br />
          <span className="text-primary">Ask your AI buddy.</span>
        </h2>

        <p className="mt-5 max-w-xl leading-7 text-muted-foreground">
          Mini Coders gives you more than just answers. Our AI assistant
          helps you understand what went wrong, explains difficult concepts,
          and guides you toward the solution.
        </p>

        <Button className="mt-7 gap-2">
          Meet Your AI Assistant
          <ArrowRight className="size-4" />
        </Button>
      </div>

      <div className="relative">
        <div className="rounded-3xl border bg-card p-6 shadow-lg">
          <div className="flex items-center gap-3 border-b pb-4">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
              <Bot className="size-5 text-primary" />
            </div>

            <div>
              <p className="font-semibold">Mini AI</p>
              <p className="text-xs text-muted-foreground">
                Your coding buddy
              </p>
            </div>
          </div>

          <div className="space-y-4 py-6">
            <div className="ml-auto max-w-[80%] rounded-2xl rounded-br-sm bg-primary px-4 py-3 text-sm text-primary-foreground">
              I don&apos;t understand why my loop isn&apos;t working.
            </div>

            <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-muted px-4 py-3 text-sm leading-6">
              No worries! Let&apos;s look at it together.
              <br />
              <br />
              First, let&apos;s understand what your loop is trying to do...
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="size-3" />
              AI is helping you learn, not just giving you the answer.
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  {/* CTA */}
  <section className="container mx-auto px-6 pb-20">
    <div className="relative overflow-hidden rounded-3xl border bg-muted/40 px-6 py-16 text-center">
      <Rocket className="mx-auto mb-5 size-10 text-primary" />

      <h2 className="text-3xl font-bold sm:text-4xl">
        Ready to become a Mini Coder?
      </h2>

      <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
        Start your coding journey today and build something amazing.
      </p>

      <Button size="lg" className="mt-7 gap-2">
        Start Coding
        <ArrowRight className="size-4" />
      </Button>
    </div>
  </section>

  {/* Footer */}
  <footer className="border-t">
    <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-muted-foreground sm:flex-row">
      <p>© 2026 Mini Coders. Learn. Build. Create.</p>

      <div className="flex items-center gap-2">
        <Code2 className="size-4" />
        Made for the next generation of coders.
      </div>
    </div>
  </footer>
</main>


);
}
