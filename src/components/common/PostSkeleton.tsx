import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function PostSkeleton() {
  return (
    <Card className="w-full">
      <CardContent className="px-4 py-2 flex gap-4 items-start">
        <div className="flex flex-col items-center gap-1 pt-1 min-w-[28px]">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-3 w-6" />
          <Skeleton className="h-4 w-4 rounded-full" />
        </div>

        <div className="flex-1 space-y-1.5">
          <div className="flex justify-between items-center gap-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-3 w-1/4" />
          </div>
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </CardContent>
    </Card>
  );
}
