"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type CommentWithAuthor = {
  id: number;
  content: string;
  author: { username: string };
  replies?: CommentWithAuthor[];
};

interface CommentsThreadProps {
  postId: number;
  comments: CommentWithAuthor[];
  setComments: React.Dispatch<React.SetStateAction<CommentWithAuthor[]>>; // ✅ allows function or direct set
}

export function CommentsThread({
  postId,
  comments,
  setComments,
}: CommentsThreadProps) {
  const [comment, setComment] = useState("");
  const [replyingToId, setReplyingToId] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Add reply recursively to any depth
  const addReplyRecursive = (
    list: CommentWithAuthor[],
    parentId: number,
    reply: CommentWithAuthor
  ): CommentWithAuthor[] => {
    return list.map((comment) => {
      if (comment.id === parentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), reply],
        };
      } else if (comment.replies) {
        return {
          ...comment,
          replies: addReplyRecursive(comment.replies, parentId, reply),
        };
      }
      return comment;
    });
  };

  const handleSubmit = async (parentId?: number) => {
    const content = parentId ? replyContent : comment;
    if (!content.trim()) return;

    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content, parentId }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to post comment");
        return;
      }

      toast.success("Comment posted");

      if (parentId) {
        // ✅ use current comments state
        setComments((prev) => addReplyRecursive(prev, parentId, data.comment));
        setReplyContent("");
        setReplyingToId(null);
      } else {
        setComments((prev) => [data.comment, ...prev]);
        setComment("");
      }
    } catch (err) {
      console.error("Comment error:", err);
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const render = (list: CommentWithAuthor[], level = 0) => (
    <div
      className={level > 0 ? "ml-4 border-l pl-3 space-y-3" : "space-y-3 mt-4"}
    >
      {list.map((c) => (
        <div key={c.id} className="border rounded-md p-2 text-sm bg-muted">
          <p className="font-medium text-xs mb-1">@{c.author.username}</p>
          <p className="mb-2">{c.content}</p>

          <Button
            variant="link"
            size="sm"
            className="text-xs px-0"
            onClick={() =>
              setReplyingToId((curr) => (curr === c.id ? null : c.id))
            }
          >
            {replyingToId === c.id ? "Cancel" : "Reply"}
          </Button>

          {replyingToId === c.id && (
            <div className="mt-2 space-y-2">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="w-full p-2 border rounded-md text-sm"
                placeholder="Write a reply..."
                rows={2}
              />
              <Button
                size="sm"
                disabled={isSubmitting}
                onClick={() => handleSubmit(c.id)}
              >
                {isSubmitting ? "Posting..." : "Post Reply"}
              </Button>
            </div>
          )}

          {c.replies && c.replies.length > 0 && render(c.replies, level + 1)}
        </div>
      ))}
    </div>
  );

  return (
    <div className="mt-4">
      <h2 className="text-lg font-semibold mb-2">Comments</h2>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write a comment..."
        className="w-full p-2 border rounded-md text-sm mb-2"
        rows={3}
      />
      <Button size="sm" onClick={() => handleSubmit()} disabled={isSubmitting}>
        {isSubmitting ? "Posting..." : "Post Comment"}
      </Button>

      {render(comments)}
    </div>
  );
}
