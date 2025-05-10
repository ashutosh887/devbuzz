"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function OnboardingPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !username) {
      toast.error("Please fill all fields");
      return;
    }

    const isValid = /^[a-zA-Z0-9_]{3,15}$/.test(username);
    if (!isValid) {
      toast.error(
        "Username must be 3-15 characters long and contain only letters, numbers, and underscores"
      );
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/user/onboard-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, username }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Something went wrong");
        return;
      }

      toast.success("Onboarding complete!");
      router.push("/dashboard");
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 gap-4 w-full max-w-sm mx-auto">
      <h1 className="text-xl font-bold mb-2">Welcome! Let’s onboard you</h1>
      <Input
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Button onClick={handleSubmit} disabled={loading} className="w-full">
        {loading ? "Submitting..." : "Continue"}
      </Button>
    </div>
  );
}
