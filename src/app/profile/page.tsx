"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FeedWrapper } from "@/components/common/FeedWrapper";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfilePostList } from "@/components/profile/ProfilePostList";
import type { UserData } from "@/types";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);

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
      } catch {
        toast.error("Failed to load profile.");
      }
    };

    fetchProfile();
  }, [router]);

  if (!user) return null;

  return (
    <FeedWrapper pageLabel="Profile">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>

      <ProfileHeader
        email={user.email}
        username={user.username}
        initialName={user.name || ""}
      />

      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="posts">My Posts</TabsTrigger>
          <TabsTrigger value="upvotes">Upvoted</TabsTrigger>
          <TabsTrigger value="downvotes">Downvoted</TabsTrigger>
        </TabsList>

        <TabsContent value="posts">
          <ProfilePostList posts={user.posts} emptyText="No posts yet." />
        </TabsContent>

        <TabsContent value="upvotes">
          <ProfilePostList
            posts={user.upvotedPosts}
            emptyText="No upvoted posts."
          />
        </TabsContent>

        <TabsContent value="downvotes">
          <ProfilePostList
            posts={user.downvotedPosts}
            emptyText="No downvoted posts."
          />
        </TabsContent>
      </Tabs>
    </FeedWrapper>
  );
}
