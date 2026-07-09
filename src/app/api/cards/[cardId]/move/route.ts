import { assertCardAccess } from "@/lib/access";
import { jsonError, jsonOk, parseJsonBody } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { requireApiUser } from "@/lib/session";
import { moveCardSchema } from "@/lib/validations/card";

type RouteContext = {
  params: Promise<{ cardId: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const authResult = await requireApiUser();
  if ("error" in authResult) return authResult.error;

  const { cardId } = await context.params;
  const accessResult = await assertCardAccess(
    authResult.user.id,
    cardId,
    "EDITOR",
  );
  if ("error" in accessResult) return accessResult.error;

  const parsedBody = await parseJsonBody(request);
  if ("error" in parsedBody) return parsedBody.error;

  const parsed = moveCardSchema.safeParse(parsedBody.body);
  if (!parsed.success) {
    return jsonError(
      "Validation failed",
      400,
      parsed.error.flatten().fieldErrors,
    );
  }

  const { listId, position } = parsed.data;
  const currentBoardId = accessResult.card.list.boardId;

  const targetList = await prisma.list.findUnique({
    where: { id: listId },
    select: { id: true, boardId: true },
  });

  if (!targetList) {
    return jsonError("Target list not found", 404);
  }

  if (targetList.boardId !== currentBoardId) {
    return jsonError("Cannot move card to a list on another board", 400);
  }

  const card = await prisma.card.update({
    where: { id: cardId },
    data: {
      listId,
      position,
    },
  });

  return jsonOk({ card });
}
