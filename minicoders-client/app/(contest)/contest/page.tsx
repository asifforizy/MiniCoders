import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contests – Coming Soon",
};

export default function ContestsPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white px-8 py-12 text-center dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-4 text-5xl">🏆</div>

        <span className="mb-4 inline-block rounded-full border border-indigo-600 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:border-indigo-400 dark:text-indigo-400">
          Coming Soon
        </span>

        <h1 className="mb-3 text-3xl font-bold">Contests</h1>

        <p className="mb-7 leading-relaxed text-gray-500 dark:text-gray-400">
          The contest feature isn&apos;t available yet. We&apos;re working on it
          and will implement it later. Meanwhile, keep practicing with problems!
        </p>

        <Link
          href="/"
          className="inline-block rounded-lg bg-indigo-600 px-6 py-2.5 font-semibold text-white transition hover:bg-indigo-700"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}