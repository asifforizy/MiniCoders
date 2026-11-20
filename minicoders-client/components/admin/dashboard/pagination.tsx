import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { AdminPaginationMeta } from "@/utils/types";

type PaginationProps = {
  meta: AdminPaginationMeta;
  basePath: string;
  params: Record<string, string | undefined>;
};

export function Pagination({ meta, basePath, params }: PaginationProps) {
  if (meta.totalPages <= 1) return null;

  const buildHref = (page: number) => {
    const qs = new URLSearchParams();

    Object.entries({ ...params, page: String(page) }).forEach(
      ([key, value]) => {
        if (typeof value === "string" && value.trim()) {
          qs.set(key, value);
        }
      }
    );

    const query = qs.toString();

    return query ? `${basePath}?${query}` : basePath;
  };

  return (
    <nav className="flex items-center justify-between gap-2">
      {meta.page > 1 ? (
        <Link
          href={buildHref(meta.page - 1)}
          className="inline-flex h-8 items-center gap-1 rounded-lg border border-border px-2.5 text-sm transition hover:bg-muted"
        >
          <ChevronLeft className="size-4" />
          Previous
        </Link>
      ) : (
        <span />
      )}

      <span className="text-sm text-muted-foreground">
        Page {meta.page} of {meta.totalPages} · {meta.total} total
      </span>

      {meta.page < meta.totalPages ? (
        <Link
          href={buildHref(meta.page + 1)}
          className="inline-flex h-8 items-center gap-1 rounded-lg border border-border px-2.5 text-sm transition hover:bg-muted"
        >
          Next
          <ChevronRight className="size-4" />
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
