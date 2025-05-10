"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "sonner";
import config from "@/config";

export default function Home() {
  const router = useRouter();
  const emailInputRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState<string>("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [loading, setLoading] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>("");

  useEffect(() => {
    const checkSession = async () => {
      const res = await fetch("/api/auth/session", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (data?.user) {
        router.push(data.user.name ? "/dashboard" : "/onboarding");
      }
    };
    checkSession();
  }, [router]);

  useEffect(() => {
    if (step === "email" && emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, [step]);

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

  const handleOtpSubmit = async () => {
    if (otp.length !== 6) return;

    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid OTP");

      toast.success("OTP verified successfully!");
      router.push(data.user.name ? "/dashboard" : "/onboarding");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-3xl font-bold mb-2">{config.appName}</h1>
      <h2 className="text-lg text-muted-foreground mb-4">{config.appTitle}</h2>

      <div className="w-full max-w-sm space-y-4 m-2">
        {step === "email" && (
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
        )}

        {step === "otp" && (
          <div className="flex flex-col items-center justify-center space-y-6">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(val) => setOtp(val)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && otp.length === 6 && !loading) {
                  handleOtpSubmit();
                }
              }}
              className="flex gap-x-2"
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <Button
              className="w-full"
              onClick={handleOtpSubmit}
              disabled={otp.length !== 6 || loading}
            >
              {loading ? "Verifying..." : "Submit"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
