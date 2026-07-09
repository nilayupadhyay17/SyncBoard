import { NextResponse } from "next/server";

export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function jsonError(error: string, status: number, details?: unknown) {
  return NextResponse.json(
    details === undefined ? { error } : { error, details },
    { status },
  );
}

export async function parseJsonBody(
  request: Request,
): Promise<{ body: unknown } | { error: NextResponse }> {
  try {
    const body = await request.json();
    return { body };
  } catch {
    return { error: jsonError("Invalid JSON body", 400) };
  }
}
