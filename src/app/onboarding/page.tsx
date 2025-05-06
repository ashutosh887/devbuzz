"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function OnboardingPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    const session = localStorage.getItem("session");
    if (!session) router.push("/");
  }, []);

  const handleSubmit = () => {
    if (!name || !username) {
      toast.error("Please fill all fields");
      return;
    }

    const updated = {
      ...JSON.parse(localStorage.getItem("session") || "{}"),
      name,
      username,
    };

    localStorage.setItem("session", JSON.stringify(updated));
    toast.success("Onboarding complete!");
    router.push("/dashboard");
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
      <Button onClick={handleSubmit} className="w-full">
        Continue
      </Button>
    </div>
  );
}
