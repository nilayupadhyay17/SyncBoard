import { assertBoardAccess } from "@/lib/access";
import { jsonError, jsonOk, parseJsonBody } from "@/lib/api";
import { nextListPosition } from "@/lib/positions";
import { prisma } from "@/lib/prisma";
import { requireApiUser } from "@/lib/session";
import { createListSchema } from "@/lib/validations/list";

type RouteContext = {
  params: Promise<{ boardId: string }>;
};

export async function POST(request: Request, context: RouteContext) {
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

  const parsed = createListSchema.safeParse(parsedBody.body);
  if (!parsed.success) {
    return jsonError(
      "Validation failed",
      400,
      parsed.error.flatten().fieldErrors,
    );
  }

  const position = await nextListPosition(boardId);

  const list = await prisma.list.create({
    data: {
      title: parsed.data.title,
      position,
      boardId,
    },
  });

  return jsonOk({ list }, 201);
}
