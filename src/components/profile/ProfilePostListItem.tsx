import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface Props {
  id: number;
  title: string;
  points: number;
  status?: string;
  createdAt: string;
}

export function ProfilePostListItem({
  id,
  title,
  points,
  status,
  createdAt,
}: Props) {
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-2">
      <div className="flex items-center gap-2">
        <Link
          href={`/feed/post/${id}`}
          className="text-foreground font-medium hover:opacity-80 transition"
        >
          {title}
        </Link>
        <span className="text-sm text-muted-foreground">({points} pts)</span>
        {status === "pending" && (
          <Badge variant="outline" className="text-xs">
            Pending Approval
          </Badge>
        )}
      </div>
      <span className="text-xs text-muted-foreground">
        {formatDate(createdAt)}
      </span>
    </div>
  );
}
