import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Next.js 16 proxy (replaces middleware.ts).
 * Uses JWT cookie check only — no Prisma/bcrypt on the request path.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });
  const isLoggedIn = !!token;
  const isOnBoards = pathname.startsWith("/boards");
  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/register");

  if (isOnBoards && !isLoggedIn) {
    const loginUrl = new URL("/login", request.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/boards", request.nextUrl.origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/boards/:path*", "/login", "/register"],
};
