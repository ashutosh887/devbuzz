"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FeedWrapper } from "@/components/common/FeedWrapper";
import { SubmitPostForm } from "@/components/common/SubmitPostForm";

export default function SubmitPostPage() {
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
    <FeedWrapper pageLabel="Submit" canSubmit={false}>
      <h1 className="text-2xl font-semibold mb-4">Create a Post</h1>
      <SubmitPostForm />
    </FeedWrapper>
  );
}
