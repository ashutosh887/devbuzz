"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const session = localStorage.getItem("session");
    if (!session) router.push("/");
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("session");
    router.push("/");
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen w-full gap-4">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <Button onClick={handleLogout} variant="outline">
        Logout
      </Button>
    </div>
  );
}
