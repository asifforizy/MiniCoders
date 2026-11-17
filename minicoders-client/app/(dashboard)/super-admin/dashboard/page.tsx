import { Suspense } from "react";

import { StatCards } from "@/components/super-admin/dashboard/stat-cards";
import { UserManagement } from "@/components/super-admin/dashboard/user-management";
import { RegistrationLineChart } from "@/components/charts/registration-line-chart";
import { RolePieChart } from "@/components/charts/role-pie-chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSuperAdminStats, getSuperAdminUsers } from "@/services/superAdminApi";
import type { AdminStats, AdminUser } from "@/utils/types";

type DashboardData = {
  stats: AdminStats;
  users: AdminUser[];
};

export default function SuperAdminDashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <SuperAdminDashboardContent />
    </Suspense>
  );
}

async function SuperAdminDashboardContent() {
  let data: DashboardData | null = null;
  let errorMessage = "Something went wrong while loading dashboard data.";

  try {
    data = await loadDashboardData();
  } catch (error) {
    errorMessage =
      error instanceof Error ? error.message : "Unable to load admin data.";
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-background px-4 py-12 text-foreground sm:px-6">
        <div className="mx-auto max-w-xl">
          <Card>
            <CardHeader>
              <CardTitle>Unable to load the super admin dashboard</CardTitle>
              <CardDescription>
                Sign in with a super admin account and try again.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-destructive">{errorMessage}</p>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  const { stats, users } = data;

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight">
            Super admin dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Monitor the platform, manage accounts, and assign admin roles.
          </p>
        </header>

        <StatCards stats={stats} />

        <div className="grid gap-4 lg:grid-cols-2">
          <RegistrationLineChart data={stats.registrations} />
          <RolePieChart data={stats.roles} />
        </div>

        <UserManagement users={users} />
      </div>
    </main>
  );
}

async function loadDashboardData(): Promise<DashboardData> {
  const [stats, users] = await Promise.all([
    getSuperAdminStats(),
    getSuperAdminUsers(),
  ]);

  return { stats, users };
}

function DashboardSkeleton() {
  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="space-y-2">
          <div className="h-8 w-64 animate-pulse rounded-md bg-muted" />
          <div className="h-4 w-96 animate-pulse rounded-md bg-muted/70" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-28 animate-pulse rounded-xl bg-muted/60"
            />
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="h-80 animate-pulse rounded-xl bg-muted/60" />
          <div className="h-80 animate-pulse rounded-xl bg-muted/60" />
        </div>

        <div className="h-96 animate-pulse rounded-xl bg-muted/60" />
      </div>
    </main>
  );
}
