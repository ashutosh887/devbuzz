import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { name, username } = (await req.json()) as {
      name?: string;
      username?: string;
    };

    if (!name || !username) {
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

    const sessionId = req.cookies.get("session_id")?.value;

    if (!sessionId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { user: true },
    });

    if (!session || new Date() > session.expiresAt) {
      return NextResponse.json({ error: "Session expired" }, { status: 401 });
    }

    const currentUser = session.user;

    // Check for username conflicts with other users
    const usernameTaken = await prisma.user.findUnique({
      where: { username },
    });

    if (usernameTaken && usernameTaken.id !== currentUser.id) {
      return NextResponse.json(
        { error: "Username already taken" },
        { status: 409 }
      );
    }

    await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        name: name.trim(),
        username: username.trim(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Onboarding error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
