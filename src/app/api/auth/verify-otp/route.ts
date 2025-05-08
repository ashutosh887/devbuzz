import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    const otpRegex = /^\d{6}$/;
    if (!otpRegex.test(otp)) {
      return NextResponse.json(
        { error: "Invalid OTP format" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const otpEntry = await prisma.oTP.findUnique({
      where: { userId: user.id },
    });
    if (!otpEntry || new Date() > otpEntry.expiresAt) {
      return NextResponse.json(
        { error: "OTP expired or not found" },
        { status: 400 }
      );
    }

    const isValid = await bcrypt.compare(otp, otpEntry.otpCode);
    if (!isValid) {
      return NextResponse.json({ error: "Incorrect OTP" }, { status: 400 });
    }

    await prisma.oTP.delete({ where: { userId: user.id } });

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true },
    });

    return NextResponse.json({
      success: true,
      message: "OTP verified",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Error in verify-otp:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
