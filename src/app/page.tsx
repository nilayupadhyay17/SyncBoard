import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getDatabaseStatus(): Promise<"connected" | "disconnected"> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return "connected";
  } catch {
    return "disconnected";
  }
}

export default async function Home() {
  const dbStatus = await getDatabaseStatus();

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 py-24 font-sans dark:bg-zinc-950">
      <main className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-10 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-sm font-medium uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          SyncBoard
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Real-time Kanban, coming soon
        </h1>
        <p className="mt-3 text-zinc-600 dark:text-zinc-400">
          Next.js + TypeScript + Tailwind + PostgreSQL + Prisma
        </p>

        <div className="mt-8 space-y-3 rounded-xl bg-zinc-50 p-4 dark:bg-zinc-950">
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-600 dark:text-zinc-400">Database</span>
            <span
              className={
                dbStatus === "connected"
                  ? "font-medium text-emerald-600 dark:text-emerald-400"
                  : "font-medium text-amber-600 dark:text-amber-400"
              }
            >
              {dbStatus === "connected" ? "Connected" : "Not connected"}
            </span>
          </div>
          {dbStatus === "disconnected" && (
            <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-500">
              Add your Neon or Supabase URLs to{" "}
              <code className="rounded bg-zinc-200 px-1 py-0.5 dark:bg-zinc-800">
                .env
              </code>{" "}
              then run{" "}
              <code className="rounded bg-zinc-200 px-1 py-0.5 dark:bg-zinc-800">
                npm run db:migrate
              </code>
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
