"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function BoardsPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex flex-1 items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <p className="text-sm text-zinc-500">Loading session…</p>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-zinc-50 px-6 dark:bg-zinc-950">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          You need to sign in to view boards.
        </p>
        <Link
          href="/login"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 py-24 font-sans dark:bg-zinc-950">
      <main className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-10 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-sm font-medium uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          SyncBoard
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Your boards
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Signed in as{" "}
          <span className="font-medium text-zinc-900 dark:text-zinc-100">
            {session.user.email}
          </span>
        </p>
        <p className="mt-1 text-xs text-zinc-500">
          User ID: {session.user.id}
        </p>
        <p className="mt-6 text-sm text-zinc-500">
          Board list comes in Phase 2. Auth session is working.
        </p>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="mt-8 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          Sign out
        </button>
      </main>
    </div>
  );
}
