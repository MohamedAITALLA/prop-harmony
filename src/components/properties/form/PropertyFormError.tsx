
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

interface PropertyFormErrorProps {
  onRetry: () => void;
  onBack?: () => void;
  errorMessage?: string;
}

export function PropertyFormError({ onRetry, onBack, errorMessage }: PropertyFormErrorProps) {
  return (
    <Card className="border-destructive/30">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="bg-destructive/10 p-3 rounded-full mb-4">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          
          <h3 className="text-xl font-semibold mb-2">Failed to Load Property Data</h3>
          
          <p className="text-muted-foreground mb-2 max-w-md">
            We encountered an issue while loading the property information. 
            Please try again or return to the properties page.
          </p>
          
          {errorMessage && (
            <div className="bg-destructive/5 border border-destructive/20 rounded-md p-3 mb-4 max-w-md mx-auto">
              <p className="text-sm text-destructive/80 break-words">{errorMessage}</p>
            </div>
          )}
          
          <div className="flex flex-wrap gap-3 mt-2 justify-center">
            <Button 
              onClick={onRetry} 
              variant="outline" 
              className="flex items-center gap-2 border-destructive/30 hover:bg-destructive/10"
            >
              <RefreshCw className="h-4 w-4" /> Try Again
            </Button>
            
            {onBack ? (
              <Button 
                onClick={onBack} 
                variant="secondary"
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" /> Back to Properties
              </Button>
            ) : (
              <Link to="/properties">
                <Button 
                  variant="secondary"
                  className="flex items-center gap-2"
                >
                  <Home className="h-4 w-4" /> Back to Properties
                </Button>
              </Link>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
