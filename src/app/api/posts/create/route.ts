import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const sessionId = req.cookies.get("session_id")?.value;

    if (!sessionId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { user: true },
    });

    if (!session || new Date() > session.expiresAt) {
      if (session) {
        await prisma.session.delete({ where: { id: session.id } });
      }
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, content } = await req.json();

    if (
      !title ||
      !content ||
      typeof title !== "string" ||
      typeof content !== "string"
    ) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const post = await prisma.post.create({
      data: {
        title: title.trim().slice(0, 100),
        content: content.trim(),
        authorId: session.user.id,
      },
    });

    return NextResponse.json({ id: post.id }, { status: 201 });
  } catch (err) {
    console.error("POST /api/posts error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
