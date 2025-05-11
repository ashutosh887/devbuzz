import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown } from "lucide-react";
import Link from "next/link";

interface PostItemProps {
  post: {
    id: number;
    title: string;
    content: string;
    author: string;
    points: number;
    comments_count: number;
  };
}

export function PostItem({ post }: PostItemProps) {
  return (
    <Card className="w-full">
      <CardContent className="p-4 flex gap-4 items-start">
        <div className="flex flex-col items-center gap-1 pt-1">
          <Button size="icon" variant="ghost">
            <ArrowUp className="h-4 w-4" />
          </Button>
          <span className="text-xs">{post.points}</span>
          <Button size="icon" variant="ghost">
            <ArrowDown className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 space-y-2">
          <Link
            href={`/feed/post/${post.id}`}
            className="text-base sm:text-lg font-semibold hover:underline"
          >
            {post.title}
          </Link>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {post.content}
          </p>
          <div className="text-xs text-muted-foreground flex justify-between">
            <span>by {post.author}</span>
            <span>{post.comments_count} comments</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
