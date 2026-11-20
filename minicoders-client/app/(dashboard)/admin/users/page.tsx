import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

import { Pagination } from "@/components/admin/dashboard/pagination";
import { UserStatusManagement } from "@/components/admin/dashboard/user-status-management";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getAdminUsers } from "@/services/adminApi";
import type { AdminUsersData, AdminUsersQuery } from "@/utils/types";

export default function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<AdminUsersQuery>;
}) {
  return (
    <Suspense fallback={<UsersSkeleton />}>
      <AdminUsersContent searchParams={searchParams} />
    </Suspense>
  );
}

async function AdminUsersContent({
  searchParams,
}: {
  searchParams: Promise<AdminUsersQuery>;
}) {
  const params = await searchParams;

  let data: AdminUsersData | null = null;
  let errorMessage = "Something went wrong while loading users.";

  try {
    data = await getAdminUsers(params);
  } catch (error) {
    errorMessage =
      error instanceof Error ? error.message : "Unable to load users.";
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-background px-4 py-12 text-foreground sm:px-6">
        <div className="mx-auto max-w-xl">
          <Card>
            <CardHeader>
              <CardTitle>Unable to load user management</CardTitle>
              <CardDescription>
                Sign in with an admin account and try again.
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

  const { users, meta } = data;

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="space-y-2">
          <Link
            href="/admin/dashboard"
            className="inline-flex h-8 w-fit items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 text-sm font-medium transition hover:bg-muted"
          >
            <ArrowLeft className="size-4" />
            Back to dashboard
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">
            User management
          </h1>
          <p className="text-sm text-muted-foreground">
            Review accounts and block, restore, or delete users.
          </p>
        </header>

        <form
          method="GET"
          className="flex flex-col gap-2 sm:flex-row sm:items-center"
        >
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              name="search"
              defaultValue={params.search ?? ""}
              placeholder="Search by name or email"
              className="pl-8"
            />
          </div>

          <select
            name="role"
            defaultValue={params.role ?? ""}
            aria-label="Filter users by role"
            className="h-8 min-w-[140px] rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
          >
            <option value="">All roles</option>
            <option value="KIDS">Kids</option>
            <option value="ADMIN,SUPER_ADMIN">Admins &amp; super admins</option>
            <option value="ADMIN">Admins only</option>
            <option value="SUPER_ADMIN">Super admins only</option>
          </select>

          <select
            name="status"
            defaultValue={params.status ?? ""}
            aria-label="Filter users by status"
            className="h-8 min-w-[140px] rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
          >
            <option value="">All statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="BLOCKED">Blocked</option>
            <option value="DELETED">Deleted</option>
          </select>

          <button
            type="submit"
            className="h-8 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            Apply
          </button>

          <Link
            href="/admin/users"
            className="inline-flex h-8 items-center justify-center rounded-lg border border-border px-3 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            Reset
          </Link>
        </form>

        <UserStatusManagement users={users} />

        <Pagination
          meta={meta}
          basePath="/admin/users"
          params={{
            search: params.search,
            role: params.role,
            status: params.status,
          }}
        />
      </div>
    </main>
  );
}

function UsersSkeleton() {
  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="space-y-2">
          <div className="h-8 w-32 animate-pulse rounded-lg bg-muted/70" />
          <div className="h-8 w-56 animate-pulse rounded-md bg-muted" />
          <div className="h-4 w-80 animate-pulse rounded-md bg-muted/70" />
        </div>

        <div className="h-8 animate-pulse rounded-lg bg-muted/60" />
        <div className="h-96 animate-pulse rounded-xl bg-muted/60" />
      </div>
    </main>
  );
}
