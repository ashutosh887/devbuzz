import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { resend } from "@/lib/resend";
import config from "@/config";
import OTPEmailTemplate from "@/components/templates/otp-email-template";

function isErrorWithMessage(error: unknown): error is { message: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as Record<string, unknown>).message === "string"
  );
}

function getErrorMessage(error: unknown): string {
  if (isErrorWithMessage(error)) {
    return error.message;
  } else if (typeof error === "string") {
    return error;
  }
  try {
    return JSON.stringify(error, null, 2);
  } catch {
    return "Unknown error";
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    const user =
      (await prisma.user.findUnique({ where: { email } })) ??
      (await prisma.user.create({ data: { email } }));

    await prisma.oTP.upsert({
      where: { userId: user.id },
      update: {
        otpCode: hashedOtp,
        expiresAt: expiry,
        createdAt: new Date(),
      },
      create: {
        userId: user.id,
        otpCode: hashedOtp,
        expiresAt: expiry,
      },
    });

    let emailErrorMessage: string | null = null;

    try {
      const { error } = await resend.emails.send({
        from: `${config.appName} <onboarding@resend.dev>`,
        to: [email],
        subject: "Your OTP Code",
        react: OTPEmailTemplate({ email, otp }),
      });

      if (error) {
        emailErrorMessage = getErrorMessage(error);
        console.warn("Email send error:", emailErrorMessage);
      }
    } catch (sendError: unknown) {
      emailErrorMessage = getErrorMessage(sendError);
      console.warn("Unexpected email send failure:", emailErrorMessage);
    }

    return NextResponse.json({
      success: true,
      message: emailErrorMessage
        ? "OTP generated, but email failed"
        : "OTP sent successfully",
      ...(config.featureFlags.SHOW_OTP_AS_TOAST ? { otp } : {}),
      ...(emailErrorMessage ? { emailError: emailErrorMessage } : {}),
    });
  } catch (err: unknown) {
    const errorMessage = getErrorMessage(err);
    console.error("Error in send-otp:", errorMessage);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
