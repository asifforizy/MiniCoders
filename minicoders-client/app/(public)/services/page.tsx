
import { Bot, Code2, Gamepad2, GraduationCap } from "lucide-react";

export default function ServicesPage() {
  const services = [
    {
      icon: GraduationCap,
      title: "Coding Lessons",
      description:
        "Learn programming concepts through simple, interactive, and beginner-friendly lessons.",
    },
    {
      icon: Code2,
      title: "Coding Challenges",
      description:
        "Practice programming by solving fun challenges designed to improve your problem-solving skills.",
    },
    {
      icon: Bot,
      title: "AI Coding Assistant",
      description:
        "Get helpful explanations, hints, and guidance when you get stuck while coding.",
    },
    {
      icon: Gamepad2,
      title: "Learning Projects",
      description:
        "Build small and exciting projects that help you turn what you learn into real skills.",
    },
  ];

  return (
    <main className="container mx-auto px-6 py-16">
      <section className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold tracking-tight">Our Services</h1>

        <p className="mt-4 text-muted-foreground">
          Everything Mini Coders provides to make learning programming easier,
          more interactive, and more fun.
        </p>
      </section>

      <section className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-2">
        {services.map((service) => {
          const Icon = service.icon;

          return (
            <div
              key={service.title}
              className="rounded-2xl border p-6 transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-primary/10">
                <Icon className="size-6 text-primary" />
              </div>

              <h2 className="text-lg font-semibold">{service.title}</h2>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {service.description}
              </p>
            </div>
          );
        })}
      </section>
    </main>
  );
}