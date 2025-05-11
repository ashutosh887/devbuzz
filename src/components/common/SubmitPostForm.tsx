"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import config from "@/config";

const { MIN_TITLE_LENGTH, MAX_TITLE_LENGTH, MIN_CONTENT_WORDS } =
  config.postConstraints;

export function SubmitPostForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const trimmedTitle = title.trim();
  const trimmedContent = content.trim();

  const titleLength = trimmedTitle.length;
  const wordCount = trimmedContent.split(/\s+/).filter(Boolean).length;

  const titleValid =
    titleLength >= MIN_TITLE_LENGTH && titleLength <= MAX_TITLE_LENGTH;
  const contentValid = wordCount >= MIN_CONTENT_WORDS;

  const isValid = titleValid && contentValid;

  const handleSubmit = async () => {
    if (!isValid) return;

    setSubmitting(true);

    try {
      const res = await fetch("/api/posts/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: trimmedTitle, content: trimmedContent }),
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

  return (
    <div className="w-full space-y-3">
      <div className="space-y-1">
        <Input
          placeholder="Enter a compelling title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-base font-medium"
        />
        <p className="text-xs text-muted-foreground">
          {titleLength}/{MAX_TITLE_LENGTH} characters • min {MIN_TITLE_LENGTH}
        </p>
      </div>

      <div className="space-y-1">
        <Textarea
          placeholder="Write your post content here..."
          className="min-h-[200px] w-full resize-none"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          {wordCount} words • min {MIN_CONTENT_WORDS}
        </p>
      </div>

      <Button
        onClick={handleSubmit}
        className="mt-1"
        disabled={!isValid || submitting}
      >
        {submitting ? "Submitting..." : "Submit"}
      </Button>
    </div>
  );
}
