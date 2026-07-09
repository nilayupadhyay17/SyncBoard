import { assertCardAccess } from "@/lib/access";
import { jsonError, jsonOk, parseJsonBody } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { requireApiUser } from "@/lib/session";
import { updateCardSchema } from "@/lib/validations/card";

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

  const parsed = updateCardSchema.safeParse(parsedBody.body);
  if (!parsed.success) {
    return jsonError(
      "Validation failed",
      400,
      parsed.error.flatten().fieldErrors,
    );
  }

  if (Object.keys(parsed.data).length === 0) {
    return jsonError("No fields to update", 400);
  }

  const card = await prisma.card.update({
    where: { id: cardId },
    data: {
      ...(parsed.data.title !== undefined ? { title: parsed.data.title } : {}),
      ...(parsed.data.description !== undefined
        ? { description: parsed.data.description }
        : {}),
      ...(parsed.data.dueDate !== undefined
        ? { dueDate: parsed.data.dueDate }
        : {}),
    },
  });

  return jsonOk({ card });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const authResult = await requireApiUser();
  if ("error" in authResult) return authResult.error;

  const { cardId } = await context.params;
  const accessResult = await assertCardAccess(
    authResult.user.id,
    cardId,
    "EDITOR",
  );
  if ("error" in accessResult) return accessResult.error;

  await prisma.card.delete({
    where: { id: cardId },
  });

  return jsonOk({ ok: true });
}
