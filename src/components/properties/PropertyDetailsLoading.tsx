
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function PropertyDetailsLoading() {
  return (
    <div className="space-y-6">
      {/* Header loading state */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-muted animate-pulse rounded-md"></div>
          <div className="h-5 w-48 bg-muted animate-pulse rounded-md"></div>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="h-10 w-24 bg-muted animate-pulse rounded-md"></div>
          <div className="h-10 w-24 bg-muted animate-pulse rounded-md"></div>
        </div>
      </div>

      {/* Tabs and content loading state */}
      <div className="space-y-4">
        <div className="h-10 w-full md:w-[400px] bg-muted animate-pulse rounded-md"></div>
        
        <Card>
          <CardHeader className="pb-0">
            <div className="h-7 w-48 bg-muted animate-pulse rounded-md mb-2"></div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center min-h-[40vh]">
              <div className="text-center">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-lg font-medium mb-1">Loading property details...</p>
                <p className="text-muted-foreground text-sm">This may take a moment</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
