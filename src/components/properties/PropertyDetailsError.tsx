
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
        {error && (
          <div className="bg-red-50 p-3 rounded-md border border-red-200 mt-2">
            <p className="text-sm text-red-700 font-medium">Error details:</p>
            <p className="text-xs text-red-600">{error.message}</p>
          </div>
        )}
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
