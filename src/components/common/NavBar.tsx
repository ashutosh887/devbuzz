"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import config from "@/config";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Settings, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  pageLabel?: string;
  canSubmit?: boolean;
}

export function Navbar({ pageLabel, canSubmit = true }: NavbarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout-user", { method: "POST" });
    router.push("/");
  };

  return (
    <nav className="w-full border-b bg-white sticky top-0 z-50 shadow-sm">
      <div className="w-full max-w-5xl mx-auto px-4 py-2 grid grid-cols-2 items-center">
        {/* LEFT: App name + badge */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/feed"
            className="text-base sm:text-lg font-bold text-black whitespace-nowrap"
          >
            {config.appName}
          </Link>

          <div className="w-[50px]">
            {pageLabel ? (
              <Badge
                variant="outline"
                className="text-xs px-2 py-0.5 rounded-md w-full text-center"
              >
                {pageLabel}
              </Badge>
            ) : (
              <div className="invisible">
                <Badge
                  variant="outline"
                  className="text-xs px-2 py-0.5 rounded-md w-full text-center"
                >
                  Placeholder
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Buttons (including fixed-width Submit) */}
        <div className="flex items-center justify-end gap-1 sm:gap-2">
          <div className="w-[84px]">
            {canSubmit ? (
              <Link href="/feed/submit">
                <Button
                  size="sm"
                  className="text-xs sm:text-sm px-3 sm:px-4 w-full"
                >
                  Submit
                </Button>
              </Link>
            ) : (
              <div className="invisible">
                <Button
                  size="sm"
                  className="text-xs sm:text-sm px-3 sm:px-4 w-full"
                >
                  Placeholder
                </Button>
              </div>
            )}
          </div>

          <Button variant="ghost" size="icon" className="p-1 sm:p-2">
            <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>

          <Button variant="ghost" size="icon" className="p-1 sm:p-2">
            <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-7 w-7 sm:h-8 sm:w-8 cursor-pointer">
                <AvatarImage src="" alt="@user" />
                <AvatarFallback>
                  <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => router.push("/profile")}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
