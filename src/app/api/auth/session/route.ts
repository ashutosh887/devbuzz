import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const sessionId = req.cookies.get("session_id")?.value;

  if (!sessionId) return NextResponse.json({ user: null });

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { user: true },
  });

  if (!session || new Date() > session.expiresAt) {
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({
    user: {
      id: session.user.id,
      name: session.user.name,
      username: session.user.username,
    },
  });
}
