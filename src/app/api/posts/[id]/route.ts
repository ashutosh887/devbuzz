import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();
  const postId = parseInt(id || "", 10);

  if (isNaN(postId)) {
    return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      author: {
        select: { username: true },
      },
      comments: {
        select: { id: true },
      },
    },
  });

  if (!post) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: post.id,
    title: post.title,
    content: post.content,
    points: post.points,
    author: {
      username: post.author.username,
    },
    commentsCount: post.comments.length,
    createdAt: post.createdAt.toISOString(),
  });
}
