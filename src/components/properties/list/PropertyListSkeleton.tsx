
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface PropertyListSkeletonProps {
  viewMode: 'grid' | 'list';
  count?: number;
}

export function PropertyListSkeleton({ viewMode, count = 6 }: PropertyListSkeletonProps) {
  return (
    <div className={viewMode === 'grid' ? "grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3" : "space-y-4"}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={viewMode === 'grid' ? "" : "flex"}>
          <Skeleton className={viewMode === 'grid' ? "h-[300px] w-full rounded-lg" : "h-[150px] w-[250px] rounded-lg flex-shrink-0"} />
          {viewMode === 'list' && (
            <div className="ml-4 flex-1 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
