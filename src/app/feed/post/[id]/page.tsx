"use client";

import { use, useEffect, useState } from "react";
import { useRouter, notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown } from "lucide-react";
import { FeedWrapper } from "@/components/common/FeedWrapper";
import { Skeleton } from "@/components/ui/skeleton";
import type { FullPost } from "@/types";

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
      } catch {
        return notFound();
      } finally {
        setIsLoadingPost(false);
      }
    };

    if (userValid) fetchPost();
  }, [userValid, id]);

  const handleUpvote = () => console.log("Upvoted post:", post?.id);
  const handleDownvote = () => console.log("Downvoted post:", post?.id);

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

  const formattedDate = new Date(post.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <FeedWrapper pageLabel="Post" canSubmit={true}>
      <h1 className="text-2xl font-bold">{post.title}</h1>

      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
        <span>
          by {post.author.username} • {post.points} points •{" "}
          {post.commentsCount} comments • {formattedDate}
        </span>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleUpvote}>
            <ArrowUp className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleDownvote}>
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
