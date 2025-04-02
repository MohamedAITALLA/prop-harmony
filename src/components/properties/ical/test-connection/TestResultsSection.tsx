
import React from "react";
import { TestResult } from "@/types/ical-connection";
import { StatusBadge } from "@/components/ui/status-badge";
import { CheckCircle2, AlertTriangle, Clock, Calendar, FileJson, AlertCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface TestResultsSectionProps {
  testResult: TestResult;
}

export const TestResultsSection: React.FC<TestResultsSectionProps> = ({ testResult }) => {
  const { data, meta, message, timestamp } = testResult;
  
  if (!data) return null;
  
  const isValid = data.valid;
  
  return (
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
                status={data.connection.status || "unknown"} 
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
                {meta?.tested_at ? new Date(meta.tested_at).toLocaleString() : "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                Last Synced
              </span>
              <span className="text-sm">
                {data.connection.last_synced ? 
                  new Date(data.connection.last_synced).toLocaleString() : "Never"}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Error Message */}
      {!isValid && data.error && (
        <div className="border border-destructive/30 rounded-md p-3 bg-destructive/5">
          <h4 className="font-medium text-sm mb-2 flex items-center gap-1.5 text-destructive">
            <AlertCircle className="h-4 w-4" />
            Error Details
          </h4>
          <div className="text-sm text-destructive/90 whitespace-pre-wrap">
            {data.error}
          </div>
        </div>
      )}
      
      {/* API Response Info */}
      <div className="border rounded-md p-3 bg-muted/20">
        <h4 className="font-medium text-sm mb-2 text-muted-foreground">Response Info</h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm">Message</span>
            <span className="text-sm font-mono">{message || "N/A"}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Timestamp</span>
            <span className="text-sm font-mono">
              {timestamp ? new Date(timestamp).toLocaleString() : "N/A"}
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
            {JSON.stringify(data.connection, null, 2)}
          </div>
        </details>
      </div>
    </div>
  );
};
