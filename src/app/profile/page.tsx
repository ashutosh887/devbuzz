"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { FeedWrapper } from "@/components/common/FeedWrapper";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { UserData } from "@/types";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [name, setName] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/user/profile", {
          credentials: "include",
        });

        if (res.status === 401) {
          router.replace("/");
          return;
        }

        const data = await res.json();
        setUser(data);
        setName(data?.name || "");
      } catch {
        toast.error("Failed to load profile.");
      }
    };

    fetchProfile();
  }, [router]);

  const updateName = async () => {
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        body: JSON.stringify({ name }),
        headers: { "Content-Type": "application/json" },
      });

      let result: { success?: boolean; error?: string } = {};

      try {
        result = await res.json();
      } catch {
        toast.error("Unexpected response from server.");
        return;
      }

      if (!res.ok || result.error) {
        toast.error(result.error || "Failed to update name.");
        return;
      }

      toast.success("Your name has been updated successfully.");
    } catch {
      toast.error("Something went wrong while updating your name.");
    }
  };

  if (!user) return null;

  return (
    <FeedWrapper pageLabel="Profile">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>

      <div className="space-y-2 mb-6">
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Username:</strong> {user.username}
        </p>
        <div className="flex gap-2 items-center">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-64"
          />
          <Button onClick={updateName}>Update Name</Button>
        </div>
      </div>

      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="posts">My Posts</TabsTrigger>
          <TabsTrigger value="upvotes">Upvoted</TabsTrigger>
          <TabsTrigger value="downvotes">Downvoted</TabsTrigger>
        </TabsList>

        <TabsContent value="posts">
          {!user.posts || user.posts.length === 0 ? (
            <div className="mb-2 p-1 text-sm text-muted-foreground">
              No posts yet.
            </div>
          ) : (
            user.posts.map((post) => (
              <div key={post.id} className="flex items-center gap-2 mb-2">
                <Link
                  href={`/feed/post/${post.id}`}
                  className="text-blue-600 hover:underline"
                >
                  {post.title}
                </Link>
                <span className="text-sm text-muted-foreground">
                  ({post.points} points)
                </span>
                {post.status === "pending" && (
                  <Badge variant="outline" className="text-xs">
                    Pending Approval
                  </Badge>
                )}
              </div>
            ))
          )}
        </TabsContent>

        <TabsContent value="upvotes">
          {!user.upvotedPosts || user.upvotedPosts.length === 0 ? (
            <div className="mb-2 p-1 text-sm text-muted-foreground">
              No upvoted posts.
            </div>
          ) : (
            user.upvotedPosts.map((post) => (
              <Link
                key={post.id}
                href={`/feed/post/${post.id}`}
                className="block text-blue-600 hover:underline mb-2"
              >
                {post.title}
              </Link>
            ))
          )}
        </TabsContent>

        <TabsContent value="downvotes">
          {!user.downvotedPosts || user.downvotedPosts.length === 0 ? (
            <div className="mb-2 p-1 text-sm text-muted-foreground">
              No downvoted posts.
            </div>
          ) : (
            user.downvotedPosts.map((post) => (
              <Link
                key={post.id}
                href={`/feed/post/${post.id}`}
                className="block text-blue-600 hover:underline mb-2"
              >
                {post.title}
              </Link>
            ))
          )}
        </TabsContent>
      </Tabs>
    </FeedWrapper>
  );
}
