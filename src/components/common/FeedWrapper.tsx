import { Navbar } from "@/components/common/NavBar";

interface FeedWrapperProps {
  children: React.ReactNode;
  pageLabel: string;
  canSubmit?: boolean;
}

export function FeedWrapper({
  children,
  pageLabel,
  canSubmit = true,
}: FeedWrapperProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar pageLabel={pageLabel} canSubmit={canSubmit} />
      <main className="py-6">
        <div className="max-w-5xl mx-auto px-4">{children}</div>
      </main>
    </div>
  );
}
