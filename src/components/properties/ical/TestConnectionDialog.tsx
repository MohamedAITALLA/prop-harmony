
import React from 'react';
import { ICalConnection } from "@/types/api-responses";
import { Globe } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { useConnectionTest } from '@/hooks/useConnectionTest';
import { ConnectionDetailsCard } from './test-connection/ConnectionDetailsCard';
import { TestResultsSection } from './test-connection/TestResultsSection';
import { TestConnectionFooter } from './test-connection/TestConnectionFooter';

interface TestConnectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  propertyId: string;
  connection: ICalConnection | null;
}

export function TestConnectionDialog({ 
  open, 
  onOpenChange, 
  propertyId,
  connection
}: TestConnectionDialogProps) {
  const { testResult, isLoading, handleTestConnection } = useConnectionTest(propertyId);
  
  const handleTestClick = () => {
    if (!connection) return;
    handleTestConnection(connection._id);
  };
  
  if (!connection) return null;

  const hasTestResults = testResult.data !== null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Globe className="h-5 w-5 text-primary" />
            Test iCal Connection
          </DialogTitle>
          <DialogDescription>
            Verify that your iCal connection is working properly and accessible
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-3 space-y-4">
          <ConnectionDetailsCard connection={connection} />
          
          {hasTestResults ? (
            <TestResultsSection testResult={testResult} />
          ) : (
            <div className="bg-primary/5 p-3 rounded-md text-sm">
              <p>Testing will verify that the iCal feed URL is accessible and contains valid calendar data.</p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <TestConnectionFooter 
            onClose={() => onOpenChange(false)}
            onTest={handleTestClick}
            isLoading={isLoading}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
