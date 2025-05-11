"use client";

import { use, useEffect, useState } from "react";
import { useRouter, notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown } from "lucide-react";
import { FeedWrapper } from "@/components/common/FeedWrapper";
import { Skeleton } from "@/components/ui/skeleton";
import type { FullPost } from "@/types";
import clsx from "clsx";
import { toast } from "sonner";

type VoteResponse = {
  status?: "created" | "updated" | "removed";
  error?: string;
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
  const [post, setPost] = useState<FullPost | null>(null);
  const [isLoadingPost, setIsLoadingPost] = useState(true);
  const [userVote, setUserVote] = useState<number | null>(null);

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

      let result: VoteResponse = {};
      const isJSON = res.headers
        .get("content-type")
        ?.includes("application/json");
      if (isJSON) result = await res.json();

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
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-24 w-full" />
        </div>
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
          by {post.author.username} • {post.points} points •{" "}
          {post.commentsCount} comments • {formattedDate}
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

      <p className="text-base whitespace-pre-line">{post.content}</p>

      <hr className="my-6" />
      <h2 className="text-lg font-semibold">Comments (soon)</h2>
      <p className="text-sm text-muted-foreground">
        Comment section coming soon...
      </p>
    </FeedWrapper>
  );
}
