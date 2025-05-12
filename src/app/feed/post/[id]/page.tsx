"use client";

import { use, useEffect, useState } from "react";
import { useRouter, notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FeedWrapper } from "@/components/common/FeedWrapper";
import { ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "sonner";
import clsx from "clsx";
import { CommentsThread } from "@/components/common/CommentsThread";
import type { FullPost } from "@/types";

type VoteResponse = {
  status?: "created" | "updated" | "removed";
  error?: string;
};

type CommentWithAuthor = {
  id: number;
  content: string;
  author: { username: string };
  replies?: CommentWithAuthor[];
};

type FullPostWithComments = FullPost & {
  comments: CommentWithAuthor[];
};

export default function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [checkingSession, setCheckingSession] = useState(true);
  const [userValid, setUserValid] = useState(false);
  const [post, setPost] = useState<FullPostWithComments | null>(null);
  const [isLoadingPost, setIsLoadingPost] = useState(true);
  const [userVote, setUserVote] = useState<number | null>(null);
  const [comments, setComments] = useState<CommentWithAuthor[]>([]);

  useEffect(() => {
    const checkSession = async () => {
      const res = await fetch("/api/auth/session", { credentials: "include" });
      const data = await res.json();
      const user = data?.user;

      if (!user || !user.name || !user.username) {
        router.replace("/");
      } else {
        setUserValid(true);
        setCheckingSession(false);
      }
    };

    checkSession();
  }, [router]);

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoadingPost(true);
      try {
        const res = await fetch(`/api/posts/${id}`);
        if (res.status === 404) return notFound();
        const data = await res.json();
        setPost(data);
        setUserVote(data.userVote ?? null);
        setComments(data.comments || []);
      } catch {
        return notFound();
      } finally {
        setIsLoadingPost(false);
      }
    };

    if (userValid) fetchPost();
  }, [userValid, id]);

  const vote = async (value: 1 | -1) => {
    if (!post) return;

    try {
      const res = await fetch("/api/posts/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ postId: post.id, value }),
      });

      const isJSON = res.headers
        .get("content-type")
        ?.includes("application/json");
      const result: VoteResponse = isJSON ? await res.json() : {};

      if (!res.ok) {
        toast.error(result.error || "Something went wrong");
        return;
      }

      const diff =
        result.status === "removed"
          ? -value
          : result.status === "updated"
            ? 2 * value
            : value;

      setPost((prev) => prev && { ...prev, points: prev.points + diff });
      setUserVote(result.status === "removed" ? null : value);

      toast(
        result.status === "removed"
          ? "Vote removed"
          : result.status === "updated"
            ? `Vote changed to ${value === 1 ? "upvote" : "downvote"}`
            : value === 1
              ? "Upvoted"
              : "Downvoted"
      );
    } catch (err) {
      console.error("Vote error:", err);
      toast.error("Voting failed");
    }
  };

  if (checkingSession || isLoadingPost) {
    return (
      <FeedWrapper pageLabel="Post" canSubmit={false}>
        <Skeleton className="h-8 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/3 mb-4" />
        <Skeleton className="h-24 w-full" />
      </FeedWrapper>
    );
  }

  if (!post) return notFound();

  const formattedDate = new Date(post.createdAt).toLocaleDateString();

  return (
    <FeedWrapper pageLabel="Post" canSubmit={true}>
      <h1 className="text-2xl font-bold">{post.title}</h1>

      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
        <span>
          by {post.author.username} • {post.points} points • {comments.length}{" "}
          comments • {formattedDate}
        </span>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => vote(1)}
            className={clsx(userVote === 1 && "text-blue-500")}
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => vote(-1)}
            className={clsx(userVote === -1 && "text-red-500")}
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <p className="text-base whitespace-pre-line mb-6">{post.content}</p>

      <CommentsThread
        postId={post.id}
        comments={comments}
        setComments={setComments}
      />
    </FeedWrapper>
  );
}
