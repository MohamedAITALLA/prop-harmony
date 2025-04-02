
import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { icalConnectionService } from '@/services/ical-connection-service';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ICalConnection } from "@/types/api-responses";
import { AlertCircle, CheckCircle2, Globe, RefreshCw, Clock, Calendar, FileJson, AlertTriangle } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { Separator } from "@/components/ui/separator";

interface TestConnectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  propertyId: string;
  connection: ICalConnection | null;
}

interface TestResponse {
  valid: boolean;
  connection: ICalConnection;
  error?: string;
}

interface TestResponseMeta {
  property_id: string;
  connection_id: string;
  platform: string;
  status: string;
  tested_at: string;
}

export function TestConnectionDialog({ 
  open, 
  onOpenChange, 
  propertyId,
  connection
}: TestConnectionDialogProps) {
  const [testResult, setTestResult] = useState<{
    data: TestResponse | null;
    meta: TestResponseMeta | null;
    message: string | null;
    timestamp: string | null;
  }>({
    data: null,
    meta: null,
    message: null,
    timestamp: null
  });

  // Test connection mutation
  const testMutation = useMutation({
    mutationFn: (connectionId: string) => {
      return icalConnectionService.testConnection(propertyId, connectionId);
    },
    onSuccess: (response) => {
      // Store the test results using the actual API response format
      setTestResult({
        data: response.data.data,
        meta: response.data.meta,
        message: response.data.message,
        timestamp: response.data.timestamp
      });

      // Check response.data.data.valid for the connection test result
      if (response.data.data.valid) {
        toast.success("Connection test passed successfully");
      } else {
        toast.error(`Connection test failed: ${response.data.data.error || 'Unknown error'}`);
      }
    },
    onError: (error) => {
      toast.error("Failed to test connection");
      console.error("Error testing connection:", error);
    }
  });

  const handleTestConnection = () => {
    if (!connection) return;
    setTestResult({ data: null, meta: null, message: null, timestamp: null });
    testMutation.mutate(connection._id);
  };
  
  if (!connection) return null;

  const isLoading = testMutation.isPending;
  const hasTestResults = testResult.data !== null;
  const isValid = testResult.data?.valid;
  
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
          <div className="bg-muted/30 p-4 rounded-lg border border-border/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Platform</span>
              <Badge variant="outline" className="capitalize">
                {connection.platform}
              </Badge>
            </div>
            
            <div className="space-y-1">
              <span className="text-sm font-medium">URL</span>
              <div className="p-2 bg-muted/50 rounded border border-border/50 break-all text-sm">
                {connection.ical_url}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status</span>
              <div className="flex items-center gap-1.5">
                {connection.status === "active" ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                )}
                <span className="capitalize">{connection.status}</span>
              </div>
            </div>
          </div>
          
          {hasTestResults ? (
            <div className="space-y-4 border rounded-lg p-4 bg-card">
              <div className="flex items-center justify-between pb-2 border-b">
                <h3 className="text-lg font-medium flex items-center gap-1.5">
                  <FileJson className="h-5 w-5 text-primary" />
                  Test Results
                </h3>
                <StatusBadge 
                  status={isValid ? "Success" : "Failed"} 
                  variant={isValid ? "success" : "error"} 
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Connection Status */}
                <div className="border rounded-md p-3 bg-muted/20">
                  <h4 className="font-medium text-sm mb-2 text-muted-foreground">Connection</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Status</span>
                      <StatusBadge 
                        status={testResult.data?.connection.status || "unknown"} 
                        size="sm" 
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Validity</span>
                      <div className="flex items-center gap-1">
                        {isValid ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-destructive" />
                        )}
                        <span className={isValid ? "text-green-500 text-sm" : "text-destructive text-sm"}>
                          {isValid ? "Valid" : "Invalid"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Timing Info */}
                <div className="border rounded-md p-3 bg-muted/20">
                  <h4 className="font-medium text-sm mb-2 text-muted-foreground">Timing</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        Tested At
                      </span>
                      <span className="text-sm">
                        {testResult.meta?.tested_at ? new Date(testResult.meta.tested_at).toLocaleString() : "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        Last Synced
                      </span>
                      <span className="text-sm">
                        {testResult.data?.connection.last_synced ? 
                          new Date(testResult.data.connection.last_synced).toLocaleString() : "Never"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Error Message */}
              {!isValid && testResult.data?.error && (
                <div className="border border-destructive/30 rounded-md p-3 bg-destructive/5">
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-1.5 text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    Error Details
                  </h4>
                  <div className="text-sm text-destructive/90 whitespace-pre-wrap">
                    {testResult.data.error}
                  </div>
                </div>
              )}
              
              {/* API Response Info */}
              <div className="border rounded-md p-3 bg-muted/20">
                <h4 className="font-medium text-sm mb-2 text-muted-foreground">Response Info</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Message</span>
                    <span className="text-sm font-mono">{testResult.message || "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Timestamp</span>
                    <span className="text-sm font-mono">
                      {testResult.timestamp ? new Date(testResult.timestamp).toLocaleString() : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Connection Details */}
              <div>
                <Separator className="my-3" />
                <details className="text-sm">
                  <summary className="font-medium cursor-pointer">Advanced Details</summary>
                  <div className="mt-2 p-3 rounded-md bg-muted/30 border text-xs font-mono whitespace-pre-wrap overflow-auto max-h-40">
                    {JSON.stringify(testResult.data?.connection, null, 2)}
                  </div>
                </details>
              </div>
            </div>
          ) : (
            <div className="bg-primary/5 p-3 rounded-md text-sm">
              <p>Testing will verify that the iCal feed URL is accessible and contains valid calendar data.</p>
            </div>
          )}
        </div>
        
        <DialogFooter className="gap-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button 
            type="button"
            className="gap-2"
            onClick={handleTestConnection}
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
