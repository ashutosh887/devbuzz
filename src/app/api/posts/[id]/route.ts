import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CommentNode } from "@/types";

function buildCommentTree(
  comments: CommentNode[],
  parentId: number | null = null
): CommentNode[] {
  return comments
    .filter((comment) => comment.parentId === parentId)
    .map((comment) => ({
      ...comment,
      replies: buildCommentTree(comments, comment.id),
    }));
}

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
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const rawComments = await prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: "asc" },
      include: {
        author: { select: { username: true } },
      },
    });

    const allComments: CommentNode[] = rawComments.map((comment) => ({
      ...comment,
      author: { username: comment.author.username! },
      replies: [],
    }));

    const commentTree = buildCommentTree(allComments);

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
      author: { username: post.author.username },
      comments: commentTree,
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
      return NextResponse.json({ error: "Session expired" }, { status: 401 });
    }

    const { content, parentId } = await req.json();
    const postId = parseInt(req.nextUrl.pathname.split("/").pop() || "", 10);

    if (!content || typeof content !== "string" || isNaN(postId)) {
      return NextResponse.json(
        { error: "Invalid comment input" },
        { status: 400 }
      );
    }

    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        authorId: session.user.id,
        postId,
        parentId: parentId ?? null,
      },
      include: {
        author: { select: { username: true } },
      },
    });

    return NextResponse.json({ status: "created", comment });
  } catch (err) {
    console.error("POST /api/posts/[id] error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
