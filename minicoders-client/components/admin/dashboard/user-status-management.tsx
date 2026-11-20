"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { updateUserStatus } from "@/services/adminApi";
import type { AdminUser, UserRole, UserStatus } from "@/utils/types";

type UserStatusManagementProps = {
  users: AdminUser[];
};

const roleClasses: Record<UserRole, string> = {
  SUPER_ADMIN: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  ADMIN: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  KIDS: "bg-muted text-muted-foreground",
};

const statusClasses: Record<UserStatus, string> = {
  ACTIVE: "text-emerald-600 dark:text-emerald-400",
  BLOCKED: "text-red-600 dark:text-red-400",
  DELETED: "text-muted-foreground",
};

function roleLabel(role: UserRole) {
  return role
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function UserStatusManagement({ users }: UserStatusManagementProps) {
  const router = useRouter();

  const [pendingId, setPendingId] = useState<string | null>(null);

  const handleStatusChange = async (user: AdminUser, status: UserStatus) => {
    if (status === user.status) return;

    if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") {
      toast.error("Admin and super admin accounts cannot be blocked or deleted");
      return;
    }

    setPendingId(user.id);

    const result = await updateUserStatus(user.id, status);

    setPendingId(null);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(`${user.name}'s status updated to ${status.toLowerCase()}`);
    router.refresh();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User status management</CardTitle>
        <CardDescription>
          Review accounts and block, restore, or delete users.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-left text-xs uppercase text-muted-foreground">
                <th className="px-3 py-2.5 font-medium">User</th>
                <th className="px-3 py-2.5 font-medium">Role</th>
                <th className="px-3 py-2.5 font-medium">Verified</th>
                <th className="px-3 py-2.5 font-medium">Joined</th>
                <th className="px-3 py-2.5 text-right font-medium">Status</th>
              </tr>
            </thead>

            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-3 py-12 text-center text-muted-foreground"
                  >
                    No users match your filters.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-3 py-2.5">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </td>

                    <td className="px-3 py-2.5">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${roleClasses[user.role]}`}
                      >
                        {roleLabel(user.role)}
                      </span>
                    </td>

                    <td className="px-3 py-2.5 text-xs text-muted-foreground">
                      {user.emailVerified ? "Yes" : "No"}
                    </td>

                    <td className="px-3 py-2.5 text-xs text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-3 py-2.5">
                      <div className="flex items-center justify-end gap-2">
                        {pendingId === user.id && (
                          <Spinner className="size-3.5 text-muted-foreground" />
                        )}

                        {user.role === "ADMIN" ||
                        user.role === "SUPER_ADMIN" ? (
                          <span
                            title="Admin and super admin accounts cannot be blocked, banned, or deleted"
                            className={`inline-flex h-8 items-center rounded-lg border border-input px-2 text-xs font-medium ${statusClasses[user.status]}`}
                          >
                            {user.status.charAt(0) +
                              user.status.slice(1).toLowerCase()}
                          </span>
                        ) : (
                          <select
                            value={user.status}
                            disabled={pendingId === user.id}
                            onChange={(event) =>
                              handleStatusChange(
                                user,
                                event.target.value as UserStatus
                              )
                            }
                            aria-label={`Status for ${user.name}`}
                            className={`h-8 rounded-lg border border-input bg-transparent px-2 text-xs font-medium outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50 dark:bg-input/30 ${statusClasses[user.status]}`}
                          >
                            <option value="ACTIVE">Active</option>
                            <option value="BLOCKED">Blocked</option>
                            <option value="DELETED">Deleted</option>
                          </select>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
