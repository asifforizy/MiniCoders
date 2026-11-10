
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageCircle } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="container mx-auto px-6 py-16">
      <section className="mx-auto max-w-3xl text-center">
        <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl bg-primary/10">
          <MessageCircle className="size-7 text-primary" />
        </div>

        <h1 className="text-4xl font-bold tracking-tight">
          Contact Mini Coders
        </h1>

        <p className="mt-4 text-muted-foreground">
          Have a question, suggestion, or need help? We would love to hear from
          you.
        </p>
      </section>

      <section className="mx-auto mt-12 grid max-w-5xl gap-10 md:grid-cols-2">
        <div className="rounded-2xl border bg-muted/30 p-8">
          <Mail className="mb-5 size-8 text-primary" />

          <h2 className="text-2xl font-semibold">Get in touch</h2>

          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Whether you need help with a coding lesson or have an idea for
            improving Mini Coders, feel free to send us a message.
          </p>

          <div className="mt-6 text-sm">
            <p className="font-medium">Email</p>
            <p className="mt-1 text-muted-foreground">
              support@minicoders.com
            </p>
          </div>
        </div>

        <form className="space-y-5 rounded-2xl border p-8">
          <div>
            <label className="mb-2 block text-sm font-medium">Name</label>
            <Input placeholder="Your name" />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Email</label>
            <Input type="email" placeholder="you@example.com" />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Message</label>
            <Textarea
              placeholder="Write your message..."
              className="min-h-32"
            />
          </div>

          <Button type="submit" className="w-full">
            Send Message
          </Button>
        </form>
      </section>
    </main>
  );
}