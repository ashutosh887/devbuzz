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
      return NextResponse.json(
        { error: "Session expired or invalid" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    const { postId, value } = await req.json();

    if (typeof postId !== "number" || ![1, -1].includes(value)) {
      return NextResponse.json(
        { error: "Invalid postId or vote value" },
        { status: 400 }
      );
    }

    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingVote) {
      if (existingVote.value === value) {
        await prisma.$transaction([
          prisma.vote.delete({
            where: { userId_postId: { userId, postId } },
          }),
          prisma.post.update({
            where: { id: postId },
            data: { points: { decrement: value } },
          }),
        ]);
        return NextResponse.json({ status: "removed" });
      }

      await prisma.$transaction([
        prisma.vote.update({
          where: { userId_postId: { userId, postId } },
          data: { value },
        }),
        prisma.post.update({
          where: { id: postId },
          data: { points: { increment: 2 * value } },
        }),
      ]);
      return NextResponse.json({ status: "updated" });
    }

    await prisma.$transaction([
      prisma.vote.create({
        data: {
          userId,
          postId,
          value,
        },
      }),
      prisma.post.update({
        where: { id: postId },
        data: { points: { increment: value } },
      }),
    ]);

    return NextResponse.json({ status: "created" });
  } catch (err) {
    console.error("POST /api/posts/vote error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
