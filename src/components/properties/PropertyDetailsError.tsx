
import React from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface PropertyDetailsErrorProps {
  onRetry: () => void;
  error?: Error | null;
}

export function PropertyDetailsError({ onRetry, error }: PropertyDetailsErrorProps) {
  return (
    <Alert variant="destructive" className="my-8">
      <AlertCircle className="h-5 w-5 mr-2" />
      <AlertTitle>Error Loading Property</AlertTitle>
      <AlertDescription className="flex flex-col gap-2">
        <p>Failed to load property details. This could be due to a network issue or the property may no longer exist.</p>
        {error && <p className="text-xs opacity-70">{error.message}</p>}
        <Button 
          variant="outline" 
          onClick={onRetry} 
          className="mt-4 gap-2 self-start"
        >
          <RefreshCw className="h-4 w-4" /> Try Again
        </Button>
      </AlertDescription>
    </Alert>
  );
}
