import Link from "next/link";
import { ArrowUpRight, BookOpen, GraduationCap, ShieldCheck, Users } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { AdminStats } from "@/utils/types";

type StatCardsProps = {
  stats: AdminStats;
};

export function StatCards({ stats }: StatCardsProps) {
  const cards = [
    {
      label: "Total users",
      value: stats.totals.users,
      hint: `${stats.statuses.active} active accounts`,
      icon: Users,
      href: "/admin/users",
    },
    {
      label: "Kids",
      value: stats.totals.kids,
      hint: `${stats.statuses.blocked} blocked accounts`,
      icon: GraduationCap,
      href: "/admin/users?role=KIDS",
    },
    {
      label: "Admins",
      value: stats.totals.admins + stats.totals.superAdmins,
      hint: `${stats.totals.admins} admins · ${stats.totals.superAdmins} super admins`,
      icon: ShieldCheck,
      href: "/admin/users?role=ADMIN,SUPER_ADMIN",
    },
    {
      label: "Problems",
      value: stats.totals.problems,
      hint: "Manage problems and test cases",
      icon: BookOpen,
      href: "/admin/problems",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <Link
            key={card.label}
            href={card.href}
            className="group block rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <Card
              size="sm"
              className="h-full transition hover:bg-muted/40 hover:ring-foreground/20"
            >
              <CardHeader className="flex flex-row items-center justify-between gap-2">
                <CardTitle className="text-sm font-normal text-muted-foreground">
                  {card.label}
                </CardTitle>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Icon className="size-4" />
                  <ArrowUpRight className="size-3.5 opacity-0 transition group-hover:opacity-100" />
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-3xl font-semibold tracking-tight tabular-nums">
                  {card.value}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {card.hint}
                </p>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
