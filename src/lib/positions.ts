import { prisma } from "@/lib/prisma";

export const POSITION_GAP = 1000;

export async function nextListPosition(boardId: string) {
  const last = await prisma.list.findFirst({
    where: { boardId },
    orderBy: { position: "desc" },
    select: { position: true },
  });

  return (last?.position ?? 0) + POSITION_GAP;
}

export async function nextCardPosition(listId: string) {
  const last = await prisma.card.findFirst({
    where: { listId },
    orderBy: { position: "desc" },
    select: { position: true },
  });

  return (last?.position ?? 0) + POSITION_GAP;
}

/** Midpoint between two positions (for future drag-and-drop inserts). */
export function midPosition(before: number, after: number) {
  return Math.floor((before + after) / 2);
}
