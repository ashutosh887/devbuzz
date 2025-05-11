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

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/posts");
        const data = await res.json();
        setAllPosts(data);
      } catch (err) {
        console.error("Failed to load posts", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const getFilteredPosts = (): Post[] => {
    const sorted = [...allPosts];

    if (filter === "New") {
      sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (filter === "Top") {
      sorted.sort((a, b) => b.points - a.points);
    } else if (filter === "Best") {
      sorted.sort((a, b) => {
        const uniqueA = Math.min(a.commentsCount, Math.floor(a.points / 5));
        const uniqueB = Math.min(b.commentsCount, Math.floor(b.points / 5));
        const scoreA = a.points + uniqueA / 2;
        const scoreB = b.points + uniqueB / 2;
        return scoreB - scoreA;
      });
    }

    return sorted;
  };

  const filteredPosts = getFilteredPosts();
  const postsToShow = filteredPosts.slice(0, page * 5);

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

        {!isLoading && postsToShow.length < filteredPosts.length && (
          <div ref={loadMoreRef} className="h-10" />
        )}
      </div>
    </div>
  );
}
