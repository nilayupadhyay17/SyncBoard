import { jsonError, jsonOk, parseJsonBody } from "@/lib/api";
import { defaultListCreates } from "@/lib/boards";
import { prisma } from "@/lib/prisma";
import { requireApiUser } from "@/lib/session";
import { createBoardSchema } from "@/lib/validations/board";

export async function GET() {
  const authResult = await requireApiUser();
  if ("error" in authResult) return authResult.error;

  const { user } = authResult;

  const memberships = await prisma.boardMember.findMany({
    where: { userId: user.id },
    include: {
      board: {
        select: {
          id: true,
          title: true,
          ownerId: true,
          createdAt: true,
        },
      },
    },
    orderBy: {
      board: { createdAt: "desc" },
    },
  });

  const boards = memberships.map((membership) => ({
    ...membership.board,
    role: membership.role,
  }));

  return jsonOk({ boards });
}

export async function POST(request: Request) {
  const authResult = await requireApiUser();
  if ("error" in authResult) return authResult.error;

  const { user } = authResult;

  const parsedBody = await parseJsonBody(request);
  if ("error" in parsedBody) return parsedBody.error;

  const parsed = createBoardSchema.safeParse(parsedBody.body);
  if (!parsed.success) {
    return jsonError(
      "Validation failed",
      400,
      parsed.error.flatten().fieldErrors,
    );
  }

  const board = await prisma.board.create({
    data: {
      title: parsed.data.title,
      ownerId: user.id,
      members: {
        create: {
          userId: user.id,
          role: "OWNER",
        },
      },
      lists: {
        create: defaultListCreates(),
      },
    },
    include: {
      lists: {
        orderBy: { position: "asc" },
      },
    },
  });

  return jsonOk(
    {
      board: {
        id: board.id,
        title: board.title,
        ownerId: board.ownerId,
        createdAt: board.createdAt,
        role: "OWNER" as const,
        lists: board.lists,
      },
    },
    201,
  );
}
