"use client";

import { useCallback, useEffect, useState } from "react";
import { PostItem } from "./PostItem";
import { FilterTabs } from "./FilterTabs";
import mockPostData from "@/config/mock/posts.json";

type Filter = "New" | "Top" | "Best";

export function PostList() {
  const [filter, setFilter] = useState<Filter>("New");
  const [posts, setPosts] = useState(mockPostData);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const sorted = [...mockPostData];

    if (filter === "New") {
      sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (filter === "Top") {
      sorted.sort((a, b) => b.points - a.points);
    } else if (filter === "Best") {
      sorted.sort((a, b) => {
        const uniqueA = Math.min(a.comments_count, Math.floor(a.points / 5));
        const uniqueB = Math.min(b.comments_count, Math.floor(b.points / 5));
        const scoreA = a.points + uniqueA / 2;
        const scoreB = b.points + uniqueB / 2;
        return scoreB - scoreA;
      });
    }

    setPosts(sorted);
    setPage(1);
  }, [filter]);

  const loadMoreRef = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const postsToShow = posts.slice(0, page * 5);

  return (
    <div className="flex flex-col gap-3">
      <div className="sticky top-16 z-10 pt-1 pb-1.5">
        <FilterTabs selected={filter} onSelect={setFilter} />
      </div>

      <div className="flex flex-col gap-3">
        {postsToShow.map((post) => (
          <PostItem key={post.id} post={post} />
        ))}

        {postsToShow.length < posts.length && (
          <div ref={loadMoreRef} className="h-10" />
        )}
      </div>
    </div>
  );
}
