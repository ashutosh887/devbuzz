import type { Post } from "@/types";
import { ProfilePostListItem } from "./ProfilePostListItem";

interface Props {
  posts: Post[];
  emptyText: string;
}

export function ProfilePostList({ posts, emptyText }: Props) {
  if (!posts.length) {
    return (
      <div className="mb-2 p-1 text-sm text-muted-foreground">{emptyText}</div>
    );
  }

  return (
    <div className="space-y-3 p-1">
      {posts.map((post) => (
        <ProfilePostListItem
          key={post.id}
          id={post.id}
          title={post.title}
          points={post.points}
          status={post.status}
          createdAt={post.createdAt}
        />
      ))}
    </div>
  );
}
