import { assertBoardAccess } from "@/lib/access";
import { jsonError, jsonOk, parseJsonBody } from "@/lib/api";
import { getBoardWithListsAndCards } from "@/lib/boards";
import { prisma } from "@/lib/prisma";
import { requireApiUser } from "@/lib/session";
import { updateBoardSchema } from "@/lib/validations/board";

type RouteContext = {
  params: Promise<{ boardId: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const authResult = await requireApiUser();
  if ("error" in authResult) return authResult.error;

  const { boardId } = await context.params;
  const accessResult = await assertBoardAccess(
    authResult.user.id,
    boardId,
    "VIEWER",
  );
  if ("error" in accessResult) return accessResult.error;

  const board = await getBoardWithListsAndCards(boardId);
  if (!board) {
    return jsonError("Board not found", 404);
  }

  return jsonOk({
    board: {
      id: board.id,
      title: board.title,
      ownerId: board.ownerId,
      createdAt: board.createdAt,
      role: accessResult.access.membership.role,
      lists: board.lists,
    },
  });
}

export async function PATCH(request: Request, context: RouteContext) {
  const authResult = await requireApiUser();
  if ("error" in authResult) return authResult.error;

  const { boardId } = await context.params;
  const accessResult = await assertBoardAccess(
    authResult.user.id,
    boardId,
    "EDITOR",
  );
  if ("error" in accessResult) return accessResult.error;

  const parsedBody = await parseJsonBody(request);
  if ("error" in parsedBody) return parsedBody.error;

  const parsed = updateBoardSchema.safeParse(parsedBody.body);
  if (!parsed.success) {
    return jsonError(
      "Validation failed",
      400,
      parsed.error.flatten().fieldErrors,
    );
  }

  const board = await prisma.board.update({
    where: { id: boardId },
    data: { title: parsed.data.title },
    select: {
      id: true,
      title: true,
      ownerId: true,
      createdAt: true,
    },
  });

  return jsonOk({
    board: {
      ...board,
      role: accessResult.access.membership.role,
    },
  });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const authResult = await requireApiUser();
  if ("error" in authResult) return authResult.error;

  const { boardId } = await context.params;
  const accessResult = await assertBoardAccess(
    authResult.user.id,
    boardId,
    "OWNER",
  );
  if ("error" in accessResult) return accessResult.error;

  await prisma.board.delete({
    where: { id: boardId },
  });

  return jsonOk({ ok: true });
}
