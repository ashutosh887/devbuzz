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

    const session = await prisma.session.create({
      data: {
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        userAgent: req.headers.get("user-agent") || undefined,
      },
    });

    const publicUser = {
      id: user.id,
      name: user.name,
      username: user.username,
    };

    const res = NextResponse.json({
      success: true,
      message: "OTP verified",
      user: publicUser,
    });

    res.cookies.set("session_id", session.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (err) {
    console.error("Error in verify-otp:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
