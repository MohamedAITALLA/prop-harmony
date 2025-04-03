
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, CheckCircle2 } from "lucide-react";

interface TestConnectionFooterProps {
  onClose: () => void;
  onTest: () => void;
  onRetry?: () => void;
  isLoading: boolean;
}

export const TestConnectionFooter: React.FC<TestConnectionFooterProps> = ({ 
  onClose, 
  onTest,
  onRetry,
  isLoading 
}) => {
  // Use onRetry if provided, otherwise fall back to onTest
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      onTest();
    }
  };

  return (
    <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2">
      <Button type="button" variant="outline" onClick={onClose}>
        Close
      </Button>
      <Button 
        type="button"
        className="gap-2"
        onClick={handleRetry}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <RefreshCw className="h-4 w-4 animate-spin" />
            Testing Connection...
          </>
        ) : (
          <>
            <CheckCircle2 className="h-4 w-4" />
            Test Connection
          </>
        )}
      </Button>
    </div>
  );
};
