import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, MessageCircle } from "lucide-react";
import Link from "next/link";
import type { Post } from "@/types";

interface PostItemProps {
  post: Post;
}

export function PostItem({ post }: PostItemProps) {
  const formattedDate = new Date(post.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Card className="w-full">
      <CardContent className="px-4 py-2 flex gap-4 items-start">
        <div className="flex flex-col items-center gap-1 pt-1 min-w-[28px]">
          <Button size="icon" variant="ghost" className="h-6 w-6">
            <ArrowUp className="h-3.5 w-3.5" />
          </Button>
          <span className="text-xs">{post.points}</span>
          <Button size="icon" variant="ghost" className="h-6 w-6">
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
