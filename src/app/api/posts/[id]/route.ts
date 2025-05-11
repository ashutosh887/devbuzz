import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.pathname.split("/").pop();
    const postId = parseInt(id || "", 10);

    if (isNaN(postId)) {
      return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
    }

    const sessionId = req.cookies.get("session_id")?.value;
    let userId: number | null = null;

    if (sessionId) {
      const session = await prisma.session.findUnique({
        where: { id: sessionId },
        include: { user: true },
      });

      if (session && new Date() < session.expiresAt) {
        userId = session.user.id;
      }
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: { select: { username: true } },
        comments: { select: { id: true } },
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    let userVote: number | null = null;
    if (userId) {
      const vote = await prisma.vote.findUnique({
        where: {
          userId_postId: { userId, postId },
        },
      });
      userVote = vote?.value ?? null;
    }

    return NextResponse.json({
      id: post.id,
      title: post.title,
      content: post.content,
      points: post.points,
      createdAt: post.createdAt,
      commentsCount: post.comments.length,
      author: {
        username: post.author.username,
      },
      userVote,
    });
  } catch (err) {
    console.error("GET /api/posts/[id] error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
