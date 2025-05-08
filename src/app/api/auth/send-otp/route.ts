import { NextRequest, NextResponse } from "next/server";
import OTPEmailTemplate from "@/components/templates/otp-email-template";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import config from "@/config";
import { resend } from "@/lib/resend";

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
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    const hashedOtp = await bcrypt.hash(otp, 10);

    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({ data: { email } });
    }

    await prisma.oTP.upsert({
      where: { userId: user.id },
      update: {
        otpCode: hashedOtp,
        expiresAt: otpExpiry,
        createdAt: new Date(),
      },
      create: {
        userId: user.id,
        otpCode: hashedOtp,
        expiresAt: otpExpiry,
      },
    });

    const { error } = await resend.emails.send({
      from: `${config.appName} <onboarding@resend.dev>`,
      to: [email],
      subject: "Your OTP Code",
      react: OTPEmailTemplate({ email, otp }),
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "OTP sent" });
  } catch (err) {
    console.error("Error in send-otp:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
