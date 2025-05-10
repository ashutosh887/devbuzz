import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const sessionId = req.cookies.get("session_id")?.value;

  if (sessionId) {
    await prisma.session.delete({ where: { id: sessionId } });
  }

  const res = NextResponse.json({ success: true });
  res.cookies.set("session_id", "", { maxAge: 0, path: "/" });

  return res;
}
