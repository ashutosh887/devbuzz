import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function PostSkeleton() {
  return (
    <Card className="w-full">
      <CardContent className="p-4 flex gap-4 items-start">
        <div className="flex flex-col items-center gap-1 pt-1">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-3 w-6" />
          <Skeleton className="h-4 w-4 rounded-full" />
        </div>

        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </CardContent>
    </Card>
  );
}
