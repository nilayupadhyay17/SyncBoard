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
