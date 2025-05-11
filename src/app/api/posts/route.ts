import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const filter = req.nextUrl.searchParams.get("filter") || "New";
    const sessionId = req.cookies.get("session_id")?.value;

    let userId: number | null = null;

    // Step 1: Get session & user
    if (sessionId) {
      const session = await prisma.session.findUnique({
        where: { id: sessionId },
        include: { user: true },
      });

      if (session && new Date() < session.expiresAt) {
        userId = session.user.id;
      }
    }

    // Step 2: Sort type based on filter
    let orderBy: { createdAt: "desc" } | { points: "desc" } = {
      createdAt: "desc",
    };
    if (filter === "Top") {
      orderBy = { points: "desc" };
    }

    // Step 3: Get all posts
    const posts = await prisma.post.findMany({
      orderBy,
      include: {
        author: true,
        comments: true,
      },
    });

    // Step 4: Fetch user's votes
    let userVotesMap: Record<number, number> = {};
    if (userId) {
      const votes = await prisma.vote.findMany({ where: { userId } });
      userVotesMap = votes.reduce(
        (acc, vote) => {
          acc[vote.postId] = vote.value;
          return acc;
        },
        {} as Record<number, number>
      );
    }

    // Step 5: Build result with optional score
    let result = posts.map((post) => {
      const unique = Math.min(
        post.comments.length,
        Math.floor(post.points / 5)
      );
      const score = post.points + unique / 2;

      return {
        id: post.id,
        title: post.title,
        content: post.content,
        createdAt: post.createdAt,
        points: post.points,
        author: post.author.username,
        commentsCount: post.comments.length,
        userVote: userVotesMap[post.id] ?? null,
        score,
      };
    });

    if (filter === "Best") {
      result = result.sort((a, b) => b.score - a.score);
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("GET /api/posts error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
