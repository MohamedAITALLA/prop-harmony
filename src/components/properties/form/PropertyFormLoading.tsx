
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

export function PropertyFormLoading() {
  return (
    <Card>
      <CardContent className="pt-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-8">
          <Skeleton className="h-6 w-6 rounded" />
          <Skeleton className="h-7 w-48" />
        </div>

        {/* Form sections */}
        <div className="space-y-8">
          {/* Basic Info Section */}
          <div className="space-y-4">
            <Skeleton className="h-5 w-36" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>

          <Skeleton className="h-px w-full" /> {/* Separator */}

          {/* Address Section */}
          <div className="space-y-4">
            <Skeleton className="h-5 w-36" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          <Skeleton className="h-px w-full" /> {/* Separator */}

          {/* Capacity Section */}
          <div className="space-y-4">
            <Skeleton className="h-5 w-36" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          <div className="flex justify-center items-center py-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary/60 mr-2" />
            <span className="text-muted-foreground">Loading property data...</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
