import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const publicPrefixes = ["/", "/onboarding"];

export async function middleware(req: NextRequest) {
  const sessionId = req.cookies.get("session_id")?.value;
  const pathname = req.nextUrl.pathname;

  const isPublic = publicPrefixes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  let userSession = null;
  if (sessionId) {
    userSession = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { user: true },
    });

    if (!userSession || new Date() > userSession.expiresAt) {
      userSession = null;
    }
  }

  if (isPublic && userSession) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (!isPublic && !userSession) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
