
import React from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

interface PropertyDetailsErrorProps {
  onRetry: () => void;
  onBack?: () => void;
  error?: Error | null;
}

export function PropertyDetailsError({ onRetry, onBack, error }: PropertyDetailsErrorProps) {
  const errorMessage = error?.message || "Unknown error occurred";
  
  return (
    <Alert variant="destructive" className="my-8">
      <AlertCircle className="h-5 w-5 mr-2" />
      <AlertTitle>Error Loading Property</AlertTitle>
      <AlertDescription className="flex flex-col gap-2">
        <p>Failed to load property details. This could be due to a network issue or the property may no longer exist.</p>
        <div className="bg-red-50 p-3 rounded-md border border-red-200 mt-2">
          <p className="text-sm text-red-700 font-medium">Error details:</p>
          <p className="text-xs text-red-600">{errorMessage}</p>
          {error?.stack && (
            <pre className="text-xs text-red-500 mt-2 overflow-auto max-h-32 p-2 bg-red-50">
              {error.stack.split('\n').slice(0, 3).join('\n')}
            </pre>
          )}
        </div>
        <div className="flex gap-2 mt-4">
          <Button 
            variant="outline" 
            onClick={onRetry} 
            className="gap-2 self-start"
          >
            <RefreshCw className="h-4 w-4" /> Try Again
          </Button>
          {onBack ? (
            <Button variant="secondary" onClick={onBack} className="gap-2">
              <Home className="h-4 w-4" /> Back to Properties
            </Button>
          ) : (
            <Link to="/properties">
              <Button variant="secondary" className="gap-2">
                <Home className="h-4 w-4" /> Back to Properties
              </Button>
            </Link>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
}
