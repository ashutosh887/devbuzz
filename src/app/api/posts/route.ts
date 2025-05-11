import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: { username: true },
        },
        _count: {
          select: { comments: true },
        },
      },
    });

    const formatted = posts.map((post) => ({
      id: post.id,
      title: post.title,
      content: post.content,
      points: post.points,
      createdAt: post.createdAt.toISOString(),
      author: post.author.username,
      commentsCount: post._count.comments,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("GET /api/posts error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
