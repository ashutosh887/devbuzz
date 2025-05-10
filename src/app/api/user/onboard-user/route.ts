import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const { name, username } = await req.json();

    if (!username || !name) {
      return NextResponse.json(
        { error: "Name and username are required" },
        { status: 400 }
      );
    }

    const isValidUsername = /^[a-zA-Z0-9_]{3,15}$/.test(username);
    if (!isValidUsername) {
      return NextResponse.json(
        { error: "Invalid username format" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const email = cookieStore.get("user_email")?.value;

    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const usernameTaken = await prisma.user.findUnique({
      where: { username },
    });

    if (usernameTaken) {
      return NextResponse.json(
        { error: "Username already taken" },
        { status: 409 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      await prisma.user.update({
        where: { email },
        data: { name, username },
      });
    } else {
      await prisma.user.create({
        data: {
          email,
          name,
          username,
          isVerified: true,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Onboarding error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
