"use client";

import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "sonner";

type Props = {
  email: string;
  otp: string;
  setOtp: (otp: string) => void;
  setStep: (step: "email" | "otp") => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
};

export default function OTPStep({
  email,
  otp,
  setOtp,
  loading,
  setLoading,
}: Props) {
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

      if (!res.ok || !data.user) {
        throw new Error(data.error || "Invalid OTP");
      }

      toast.success("OTP verified successfully!");
      window.location.href = "/onboarding";
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
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
  );
}
