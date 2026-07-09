import type { Board, BoardMember, BoardRole } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { jsonError } from "@/lib/api";
import { NextResponse } from "next/server";

const ROLE_RANK: Record<BoardRole, number> = {
  VIEWER: 1,
  EDITOR: 2,
  OWNER: 3,
};

export function hasMinRole(role: BoardRole, minRole: BoardRole) {
  return ROLE_RANK[role] >= ROLE_RANK[minRole];
}

export type BoardAccess = {
  board: Board;
  membership: BoardMember;
};

export async function assertBoardAccess(
  userId: string,
  boardId: string,
  minRole: BoardRole = "VIEWER",
): Promise<{ access: BoardAccess } | { error: NextResponse }> {
  const board = await prisma.board.findUnique({
    where: { id: boardId },
  });

  if (!board) {
    return { error: jsonError("Board not found", 404) };
  }

  const membership = await prisma.boardMember.findUnique({
    where: {
      boardId_userId: {
        boardId,
        userId,
      },
    },
  });

  if (!membership) {
    return { error: jsonError("Board not found", 404) };
  }

  if (!hasMinRole(membership.role, minRole)) {
    return { error: jsonError("Forbidden", 403) };
  }

  return { access: { board, membership } };
}

export async function assertListAccess(
  userId: string,
  listId: string,
  minRole: BoardRole = "VIEWER",
) {
  const list = await prisma.list.findUnique({
    where: { id: listId },
  });

  if (!list) {
    return { error: jsonError("List not found", 404) };
  }

  const accessResult = await assertBoardAccess(userId, list.boardId, minRole);
  if ("error" in accessResult) return accessResult;

  return { list, access: accessResult.access };
}

export async function assertCardAccess(
  userId: string,
  cardId: string,
  minRole: BoardRole = "VIEWER",
) {
  const card = await prisma.card.findUnique({
    where: { id: cardId },
    include: { list: true },
  });

  if (!card) {
    return { error: jsonError("Card not found", 404) };
  }

  const accessResult = await assertBoardAccess(
    userId,
    card.list.boardId,
    minRole,
  );
  if ("error" in accessResult) return accessResult;

  return { card, access: accessResult.access };
}
