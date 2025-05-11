"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Props {
  email: string;
  username: string;
  initialName: string;
}

export function ProfileHeader({ email, username, initialName }: Props) {
  const [name, setName] = useState(initialName);
  const [updating, setUpdating] = useState(false);

  const hasChanged = name.trim() !== initialName;

  const updateName = async () => {
    try {
      setUpdating(true);
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        body: JSON.stringify({ name }),
        headers: { "Content-Type": "application/json" },
      });

      const result = await res.json();

      if (!res.ok || result.error) {
        toast.error(result.error || "Failed to update name.");
        return;
      }

      toast.success("Your name has been updated successfully.");
    } catch {
      toast.error("Something went wrong while updating your name.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      {/* Left: Name Update */}
      <div className="flex items-center gap-2">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="w-52 h-8 text-sm"
        />
        <Button
          onClick={updateName}
          size="sm"
          className="h-8 px-3 text-sm"
          disabled={!hasChanged || updating}
        >
          Update
        </Button>
      </div>

      {/* Right: Email + Username */}
      <div className="text-sm space-y-1 text-muted-foreground sm:text-right">
        <p>
          <strong>Email:</strong> {email}
        </p>
        <p>
          <strong>Username:</strong> {username}
        </p>
      </div>
    </div>
  );
}
