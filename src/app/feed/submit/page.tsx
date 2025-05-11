"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FeedWrapper } from "@/components/common/FeedWrapper";

export default function SubmitPage() {
  const router = useRouter();
  const [checkingSession, setCheckingSession] = useState(true);
  const [content, setContent] = useState("");

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

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setContent("");
  };

  if (checkingSession) return null;

  return (
    <FeedWrapper pageLabel="Submit" canSubmit={false}>
      <h1 className="text-2xl font-semibold mb-4">Create a Post</h1>
      <Textarea
        placeholder="Write something awesome..."
        className="min-h-[160px] w-full resize-none"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <Button onClick={handleSubmit} className="mt-3">
        Submit
      </Button>
    </FeedWrapper>
  );
}
