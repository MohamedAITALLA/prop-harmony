
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((index) => (
        <div key={index} className="border rounded-lg p-4 space-y-3">
          <Skeleton className="h-6 w-3/4" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-24" />
          </div>
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
};
