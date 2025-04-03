
import React from 'react';
import { Button } from "@/components/ui/button";
import { ICalConnection } from "@/types/api-responses";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ConnectionDetailsCard } from './test-connection/ConnectionDetailsCard';
import { TestResultsSection } from './test-connection/TestResultsSection';
import { TestConnectionFooter } from './test-connection/TestConnectionFooter';
import { useConnectionTest } from '@/hooks/useConnectionTest';
import { ExternalLink, Loader2 } from 'lucide-react';

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

  React.useEffect(() => {
    // When the dialog opens and we have a connection, run the test
    if (open && connection && !testResult.data && !isLoading) {
      handleTestConnection(connection._id);
    }
  }, [open, connection, testResult.data, isLoading]);
  
  if (!connection) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5 text-primary" />
            iCal Connection Test
          </DialogTitle>
        </DialogHeader>

        <div className="py-2">
          <ConnectionDetailsCard connection={connection} />
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground">Testing connection...</p>
            </div>
          ) : (
            <TestResultsSection testResult={testResult} />
          )}
        </div>

        <TestConnectionFooter 
          onClose={() => onOpenChange(false)}
          onRetry={() => {
            if (connection) {
              handleTestConnection(connection._id);
            }
          }}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
