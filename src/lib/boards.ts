import { POSITION_GAP } from "@/lib/positions";
import { prisma } from "@/lib/prisma";

export const DEFAULT_LIST_TITLES = ["To Do", "In Progress", "Done"] as const;

export function defaultListCreates() {
  return DEFAULT_LIST_TITLES.map((title, index) => ({
    title,
    position: (index + 1) * POSITION_GAP,
  }));
}

export async function getBoardWithListsAndCards(boardId: string) {
  return prisma.board.findUnique({
    where: { id: boardId },
    include: {
      lists: {
        orderBy: { position: "asc" },
        include: {
          cards: {
            orderBy: { position: "asc" },
          },
        },
      },
    },
  });
}
