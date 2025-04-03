
import React from 'react';
import { format } from 'date-fns';
import { AlertCircle, Check, Clock, Calendar, AlertTriangle, FileText } from 'lucide-react';
import { TestResult } from '@/types/ical-connection';

interface TestResultsSectionProps {
  testResult: TestResult;
}

export const TestResultsSection: React.FC<TestResultsSectionProps> = ({ testResult }) => {
  if (!testResult.data) {
    return (
      <div className="py-6 text-center">
        <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-30" />
        <h3 className="text-lg font-medium mb-1">No Test Results</h3>
        <p className="text-muted-foreground">Run a test to check your connection</p>
      </div>
    );
  }

  const isValid = testResult.data.valid;

  return (
    <div className={`mt-6 rounded-lg border ${isValid ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'} p-4`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-full ${isValid ? 'bg-green-100' : 'bg-red-100'}`}>
          {isValid ? (
            <Check className="h-5 w-5 text-green-600" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-red-600" />
          )}
        </div>
        <div className="flex-1">
          <h3 className={`text-lg font-medium ${isValid ? 'text-green-800' : 'text-red-800'}`}>
            {isValid ? 'Connection Successful' : 'Connection Failed'}
          </h3>
          
          {/* Display test metadata */}
          <div className="mt-4 space-y-3">
            {testResult.meta?.tested_at && (
              <div className="flex items-center text-sm gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Tested at: {format(new Date(testResult.meta.tested_at), 'PPpp')}</span>
              </div>
            )}
            
            {/* Connection details if available */}
            {testResult.data.connection && (
              <div className="flex items-center text-sm gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {testResult.data.connection.platform} connection (status: {testResult.data.connection.status})
                </span>
              </div>
            )}

            {/* Response details */}
            <div className="grid grid-cols-2 gap-3 mt-3">
              {testResult.meta?.response_time_ms && (
                <div className="bg-white bg-opacity-50 p-2 rounded border border-gray-100">
                  <div className="text-xs text-muted-foreground mb-1">Response Time</div>
                  <div className="font-medium">{testResult.meta.response_time_ms}ms</div>
                </div>
              )}
              
              {testResult.data.events_found !== undefined && (
                <div className="bg-white bg-opacity-50 p-2 rounded border border-gray-100">
                  <div className="text-xs text-muted-foreground mb-1">Events Found</div>
                  <div className="font-medium">{testResult.data.events_found}</div>
                </div>
              )}
              
              {testResult.data.parse_time_ms !== undefined && (
                <div className="bg-white bg-opacity-50 p-2 rounded border border-gray-100">
                  <div className="text-xs text-muted-foreground mb-1">Parse Time</div>
                  <div className="font-medium">{testResult.data.parse_time_ms}ms</div>
                </div>
              )}
              
              {testResult.meta?.content_length && (
                <div className="bg-white bg-opacity-50 p-2 rounded border border-gray-100">
                  <div className="text-xs text-muted-foreground mb-1">Content Size</div>
                  <div className="font-medium">{(testResult.meta.content_length / 1024).toFixed(2)} KB</div>
                </div>
              )}
            </div>
          </div>
          
          {/* Error message if any */}
          {!isValid && testResult.data.error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-200 rounded">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle className="h-4 w-4 text-red-800" />
                <span className="font-medium text-red-800">Error Details</span>
              </div>
              <div className="text-sm text-red-700 font-mono bg-white bg-opacity-50 p-2 rounded mt-2 overflow-auto max-h-28">
                {testResult.data.error}
              </div>
            </div>
          )}
          
          {/* Connection info if available */}
          {testResult.data.connection && testResult.data.connection.error_message && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="h-4 w-4 text-amber-800" />
                <span className="font-medium text-amber-800">Previous Error</span>
              </div>
              <div className="text-sm text-amber-700 mt-1">{testResult.data.connection.error_message}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
