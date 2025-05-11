"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FeedWrapper } from "@/components/common/FeedWrapper";
import { PostList } from "@/components/feed/PostList";
import { ScrollToTopButton } from "@/components/common/ScrollToTopButton";

export default function FeedPage() {
  const router = useRouter();
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const res = await fetch("/api/auth/session", { credentials: "include" });
      const data = await res.json();
      const user = data?.user;

      if (!user || !user.name || !user.username) {
        router.replace("/");
      } else {
        setCheckingSession(false);
      }
    };

    checkSession();
  }, [router]);

  if (checkingSession) return null;

  return (
    <FeedWrapper pageLabel="Feed" canSubmit>
      <PostList />
      <ScrollToTopButton />
    </FeedWrapper>
  );
}
