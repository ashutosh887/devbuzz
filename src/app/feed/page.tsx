"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { increment, decrement } from "@/store/slices/counterSlice";

export default function FeedPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const counter = useAppSelector((state) => state.counter.value);

  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/auth/session", {
          credentials: "include",
        });
        const data = await res.json();
        const user = data?.user;

        if (!user || !user.name || !user.username) {
          router.replace("/");
        } else {
          setCheckingSession(false);
        }
      } catch (err) {
        console.error("Session check failed:", err);
        router.replace("/");
      }
    };

    checkSession();
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout-user", { method: "POST" });
    router.push("/");
  };

  if (checkingSession) return null;

  return (
    <div className="flex flex-col justify-center items-center min-h-screen w-full gap-4">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p>{counter}</p>

      <div className="flex gap-2">
        <Button onClick={() => dispatch(increment())}>Increment</Button>
        <Button onClick={() => dispatch(decrement())}>Decrement</Button>
      </div>

      <Button onClick={handleLogout} variant="outline">
        Logout
      </Button>
    </div>
  );
}
