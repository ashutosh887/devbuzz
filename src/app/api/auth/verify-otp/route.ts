import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { otp } = await req.json();

    if (!otp || typeof otp !== "string") {
      return NextResponse.json({ error: "OTP is required" }, { status: 400 });
    }

    const otpRegex = /^\d{6}$/;
    if (!otpRegex.test(otp)) {
      return NextResponse.json(
        { error: "Invalid OTP format" },
        { status: 400 }
      );
    }

    const mockUser = {
      id: 1,
      email: "demo@example.com",
      name: null,
      isVerified: true,
    };

    return NextResponse.json({
      success: true,
      message: "OTP verified",
      user: mockUser,
    });
  } catch (err) {
    console.error("Error in verify-otp:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
