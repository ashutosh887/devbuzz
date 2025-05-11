import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, MessageCircle } from "lucide-react";
import Link from "next/link";
import type { Post } from "@/types";
import clsx from "clsx";
import { useState } from "react";
import { toast } from "sonner";

type VoteResponse = {
  status?: "created" | "updated" | "removed";
  error?: string;
};

interface PostItemProps {
  post: Post & { userVote?: number };
}

export function PostItem({ post }: PostItemProps) {
  const [points, setPoints] = useState(post.points);
  const [userVote, setUserVote] = useState<number | null>(
    post.userVote ?? null
  );

  const vote = async (value: 1 | -1) => {
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

      setPoints((prev) => prev + diff);
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

  const formattedDate = new Date(post.createdAt).toLocaleDateString();

  return (
    <Card className="w-full">
      <CardContent className="px-4 py-2 flex gap-4 items-start">
        <div className="flex flex-col items-center gap-1 pt-1 min-w-[28px]">
          <Button
            size="icon"
            variant="ghost"
            className={clsx("h-6 w-6", userVote === 1 && "text-blue-500")}
            onClick={() => vote(1)}
          >
            <ArrowUp className="h-3.5 w-3.5" />
          </Button>
          <span className="text-xs">{points}</span>
          <Button
            size="icon"
            variant="ghost"
            className={clsx("h-6 w-6", userVote === -1 && "text-red-500")}
            onClick={() => vote(-1)}
          >
            <ArrowDown className="h-3.5 w-3.5" />
          </Button>
        </div>

        <div className="flex-1 space-y-1.5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <Link
              href={`/feed/post/${post.id}`}
              className="text-base sm:text-lg font-semibold text-foreground hover:opacity-80 transition"
            >
              {post.title}
            </Link>
            <div className="text-xs text-muted-foreground flex items-center gap-3">
              <span>by {post.author}</span>
              <span>{formattedDate}</span>
              <span className="flex items-center gap-1">
                <MessageCircle className="h-3 w-3" />
                {post.commentsCount}
              </span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 leading-snug">
            {post.content}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
