"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import config from "@/config";
import EmailStep from "@/components/root/EmailStep";
import OTPStep from "@/components/root/OTPStep";

export default function Home() {
  const router = useRouter();

  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/auth/session", {
          credentials: "include",
        });
        const data = await res.json();
        const user = data?.user;

        if (!user) return;

        if (user.name && user.username) {
          router.replace("/feed");
        } else {
          router.replace("/onboarding");
        }
      } catch (error) {
        console.error("Session check failed:", error);
      } finally {
        setIsCheckingSession(false);
      }
    };

    checkSession();
  }, [router]);

  if (isCheckingSession) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-3xl font-bold mb-2">{config.appName}</h1>
      <h2 className="text-lg text-muted-foreground mb-4">{config.appTitle}</h2>

      <div className="w-full max-w-sm space-y-4 m-2">
        {step === "email" && (
          <EmailStep
            email={email}
            setEmail={setEmail}
            setStep={setStep}
            loading={loading}
            setLoading={setLoading}
          />
        )}

        {step === "otp" && (
          <OTPStep
            email={email}
            otp={otp}
            setOtp={setOtp}
            loading={loading}
            setLoading={setLoading}
          />
        )}
      </div>
    </div>
  );
}
