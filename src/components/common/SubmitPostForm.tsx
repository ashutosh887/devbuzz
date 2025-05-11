"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function SubmitPostForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) return;

    setSubmitting(true);

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), content: content.trim() }),
      });

      const data = await res.json();

      if (res.ok && data.id) {
        toast.success("Post created successfully!");
        setTitle("");
        setContent("");
        router.push(`/feed/post/${data.id}`);
      } else {
        toast.error(data.error || "Failed to create post");
      }
    } catch {
      toast.error("Something went wrong while submitting.");
    } finally {
      setSubmitting(false);
    }
  };

  const isValid = title.trim() !== "" && content.trim() !== "";

  return (
    <div className="w-full space-y-4">
      <Input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="text-base font-medium"
      />

      <Textarea
        placeholder="Write something awesome..."
        className="min-h-[160px] w-full resize-none"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <Button
        onClick={handleSubmit}
        className="mt-2"
        disabled={!isValid || submitting}
      >
        {submitting ? "Submitting..." : "Submit"}
      </Button>
    </div>
  );
}
