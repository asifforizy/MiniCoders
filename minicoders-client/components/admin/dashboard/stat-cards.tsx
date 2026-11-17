import { BookOpen, GraduationCap, ShieldCheck, Users } from "lucide-react";

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
    },
    {
      label: "Kids",
      value: stats.totals.kids,
      hint: `${stats.statuses.blocked} blocked accounts`,
      icon: GraduationCap,
    },
    {
      label: "Admins",
      value: stats.totals.admins,
      hint: `${stats.totals.superAdmins} super admins`,
      icon: ShieldCheck,
    },
    {
      label: "Problems",
      value: stats.totals.problems,
      hint: "Total problems created",
      icon: BookOpen,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <Card key={card.label} size="sm">
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <CardTitle className="text-sm font-normal text-muted-foreground">
                {card.label}
              </CardTitle>
              <Icon className="size-4 text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <p className="text-3xl font-semibold tracking-tight tabular-nums">
                {card.value}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{card.hint}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
