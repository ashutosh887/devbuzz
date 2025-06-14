"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function OnboardingPage() {
  const router = useRouter();

  const nameRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [checkingSession, setCheckingSession] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/auth/session", {
          credentials: "include",
        });
        const data = await res.json();
        const user = data?.user;

        if (!user) {
          router.replace("/");
          return;
        }

        if (user.name && user.username) {
          router.replace("/feed");
          return;
        }

        setEmail(user.email || "");
        setCheckingSession(false);
      } catch (err) {
        console.error("Session check failed:", err);
        router.replace("/");
      }
    };

    checkSession();
  }, [router]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      nameRef.current?.focus();
    }, 100);
    return () => clearTimeout(timeout);
  }, []);

  const handleSubmit = async () => {
    if (!name.trim() || !username.trim()) {
      toast.error("Please fill all fields");
      return;
    }

    const isValid = /^[a-zA-Z0-9_]{3,15}$/.test(username);
    if (!isValid) {
      toast.error(
        "Username must be 3–15 characters and only include letters, numbers, and underscores"
      );
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/user/onboard-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: name.trim(),
          username: username.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "Something went wrong");
        return;
      }

      toast.success("Onboarding complete!");
      router.replace("/feed");
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 gap-4 w-full max-w-sm mx-auto">
      <h1 className="text-xl font-bold mb-2">Welcome! Let’s onboard you</h1>
      {email && (
        <p className="text-sm text-muted-foreground mb-2 text-center">
          You are setting up your account for{" "}
          <span className="font-medium">{email}</span>
        </p>
      )}
      <Input
        ref={nameRef}
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !loading) {
            handleSubmit();
          }
        }}
      />
      <Button onClick={handleSubmit} disabled={loading} className="w-full">
        {loading ? "Submitting..." : "Continue"}
      </Button>
    </div>
  );
}
