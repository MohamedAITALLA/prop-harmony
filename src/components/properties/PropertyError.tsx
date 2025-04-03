
import React from "react";
import { Button } from "@/components/ui/button";

interface PropertyErrorProps {
  onRetry: () => void;
}

export function PropertyError({ onRetry }: PropertyErrorProps) {
  return (
    <div className="py-8 px-4 text-center">
      <h2 className="text-xl font-bold mb-2">Failed to load properties</h2>
      <p className="text-muted-foreground mb-4">There was an error loading your properties.</p>
      <Button onClick={onRetry}>Try Again</Button>
    </div>
  );
}
