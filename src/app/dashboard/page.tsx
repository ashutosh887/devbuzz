"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
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
