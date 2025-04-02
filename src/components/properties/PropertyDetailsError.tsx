
import React from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface PropertyDetailsErrorProps {
  onRetry: () => void;
}

export function PropertyDetailsError({ onRetry }: PropertyDetailsErrorProps) {
  return (
    <Alert variant="destructive" className="my-8">
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Failed to load property details. Please try again later.
      </AlertDescription>
      <Button variant="outline" onClick={onRetry} className="mt-4">
        Retry
      </Button>
    </Alert>
  );
}
