"use client";
import { useCallback, useEffect, useState } from "react";
import { PostItem } from "./PostItem";
import { FilterTabs, Filter } from "./FilterTabs";
import type { Post } from "@/types";
import { PostSkeleton } from "../common/PostSkeleton";

export function PostList() {
  const [filter, setFilter] = useState<Filter>("New");
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPosts = async (selectedFilter: Filter) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/posts?filter=${selectedFilter}`);
      const data = await res.json();
      setAllPosts(data);
    } catch (err) {
      console.error("Failed to load posts", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(filter);
    setPage(1);
  }, [filter]);

  const postsToShow = allPosts.slice(0, page * 5);

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

  return (
    <div className="flex flex-col gap-3">
      <div className="sticky top-16 z-10 pt-1 pb-1.5">
        <FilterTabs selected={filter} onSelect={setFilter} />
      </div>

      <div className="flex flex-col gap-3">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => <PostSkeleton key={i} />)
          : postsToShow.map((post) => <PostItem key={post.id} post={post} />)}

        {!isLoading && postsToShow.length < allPosts.length && (
          <div ref={loadMoreRef} className="h-10" />
        )}
      </div>
    </div>
  );
}
