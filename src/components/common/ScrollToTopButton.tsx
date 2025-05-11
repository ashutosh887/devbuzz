"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <Button
      aria-label="Scroll to top"
      onClick={scrollToTop}
      variant="default"
      size="icon"
      className="fixed bottom-5 right-5 z-50 shadow-lg rounded-full bg-primary text-white hover:bg-primary/90 transition-all"
    >
      <ArrowUp className="h-4 w-4" />
    </Button>
  );
}
