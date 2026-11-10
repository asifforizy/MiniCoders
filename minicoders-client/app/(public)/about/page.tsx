
import { Code2, Lightbulb, Rocket, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="container mx-auto px-6 py-16">
      <section className="mx-auto max-w-3xl text-center">
        <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl bg-primary/10">
          <Code2 className="size-7 text-primary" />
        </div>

        <h1 className="text-4xl font-bold tracking-tight">
          About Mini Coders
        </h1>

        <p className="mt-5 text-lg leading-8 text-muted-foreground">
          Mini Coders is a fun and interactive platform designed to help kids
          learn programming, solve coding challenges, and build their own
          projects.
        </p>
      </section>

      <section className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-3">
        <div className="rounded-2xl border p-6 text-center">
          <Lightbulb className="mx-auto mb-4 size-8 text-yellow-500" />
          <h2 className="font-semibold">Learn</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Understand programming through simple and engaging lessons.
          </p>
        </div>

        <div className="rounded-2xl border p-6 text-center">
          <Rocket className="mx-auto mb-4 size-8 text-primary" />
          <h2 className="font-semibold">Build</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Turn your ideas into real coding projects.
          </p>
        </div>

        <div className="rounded-2xl border p-6 text-center">
          <Users className="mx-auto mb-4 size-8 text-purple-500" />
          <h2 className="font-semibold">Grow</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Practice, solve challenges, and grow your coding skills.
          </p>
        </div>
      </section>
    </main>
  );
}
