import { assertListAccess } from "@/lib/access";
import { jsonError, jsonOk, parseJsonBody } from "@/lib/api";
import { nextCardPosition } from "@/lib/positions";
import { prisma } from "@/lib/prisma";
import { requireApiUser } from "@/lib/session";
import { createCardSchema } from "@/lib/validations/card";

type RouteContext = {
  params: Promise<{ listId: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const authResult = await requireApiUser();
  if ("error" in authResult) return authResult.error;

  const { listId } = await context.params;
  const accessResult = await assertListAccess(
    authResult.user.id,
    listId,
    "EDITOR",
  );
  if ("error" in accessResult) return accessResult.error;

  const parsedBody = await parseJsonBody(request);
  if ("error" in parsedBody) return parsedBody.error;

  const parsed = createCardSchema.safeParse(parsedBody.body);
  if (!parsed.success) {
    return jsonError(
      "Validation failed",
      400,
      parsed.error.flatten().fieldErrors,
    );
  }

  const position = await nextCardPosition(listId);

  const card = await prisma.card.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description ?? null,
      dueDate: parsed.data.dueDate ?? null,
      position,
      listId,
    },
  });

  return jsonOk({ card }, 201);
}
