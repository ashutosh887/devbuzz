"use client";

import { use, useEffect, useState } from "react";
import { useRouter, notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown } from "lucide-react";
import { FeedWrapper } from "@/components/common/FeedWrapper";
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
      const res = await fetch(`/api/posts/${id}`);
      if (res.status === 404) return notFound();

      const data = await res.json();
      setPost(data);
    };

    if (userValid) fetchPost();
  }, [userValid, id]);

  const handleUpvote = () => console.log("Upvoted post:", post?.id);
  const handleDownvote = () => console.log("Downvoted post:", post?.id);

  if (checkingSession || !userValid || !post) return null;

  return (
    <FeedWrapper pageLabel="Post" canSubmit={true}>
      <h1 className="text-2xl font-bold">{post.title}</h1>

      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
        <span>
          by {post.author.username} • {post.points} points •{" "}
          {post.commentsCount} comments
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
