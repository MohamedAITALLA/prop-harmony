
import React from "react";

export function PropertyDetailsLoading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-lg font-medium mb-1">Loading property details...</p>
        <p className="text-muted-foreground text-sm">This may take a moment</p>
      </div>
    </div>
  );
}
