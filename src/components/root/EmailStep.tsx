"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import config from "@/config";

type Props = {
  email: string;
  setEmail: (email: string) => void;
  setStep: (step: "email" | "otp") => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
};

export default function EmailStep({
  email,
  setEmail,
  setStep,
  loading,
  setLoading,
}: Props) {
  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleGetStarted = async () => {
    if (!isValidEmail) return;

    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to send OTP");
      }

      if (data.emailError) {
        toast.warning(`Email failed: ${data.emailError}`);
      }

      if (data.otp && config.featureFlags.SHOW_OTP_AS_TOAST) {
        toast.info(`Your OTP is ${data.otp}`, { duration: 10000 });
      }

      setStep("otp");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Input
        ref={emailInputRef}
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !loading && isValidEmail) {
            handleGetStarted();
          }
        }}
        disabled={loading}
      />
      <Button
        onClick={handleGetStarted}
        disabled={!isValidEmail || loading}
        variant={isValidEmail ? "default" : "outline"}
        className="w-full"
      >
        {loading ? "Sending OTP..." : "Get Started"}
      </Button>
    </div>
  );
}
