import { assertListAccess } from "@/lib/access";
import { jsonError, jsonOk, parseJsonBody } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { requireApiUser } from "@/lib/session";
import { updateListSchema } from "@/lib/validations/list";

type RouteContext = {
  params: Promise<{ listId: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
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

  const parsed = updateListSchema.safeParse(parsedBody.body);
  if (!parsed.success) {
    return jsonError(
      "Validation failed",
      400,
      parsed.error.flatten().fieldErrors,
    );
  }

  const list = await prisma.list.update({
    where: { id: listId },
    data: { title: parsed.data.title },
  });

  return jsonOk({ list });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const authResult = await requireApiUser();
  if ("error" in authResult) return authResult.error;

  const { listId } = await context.params;
  const accessResult = await assertListAccess(
    authResult.user.id,
    listId,
    "EDITOR",
  );
  if ("error" in accessResult) return accessResult.error;

  await prisma.list.delete({
    where: { id: listId },
  });

  return jsonOk({ ok: true });
}
