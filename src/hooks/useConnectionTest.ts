
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { icalConnectionService } from '@/services/ical-connection-service';
import { toast } from "sonner";
import { TestResult, TestConnectionMeta, TestConnectionResponse } from '@/types/ical-connection';

export function useConnectionTest(propertyId: string) {
  const [testResult, setTestResult] = useState<TestResult>({
    data: null,
    meta: null,
    message: null,
    timestamp: null
  });

  const testMutation = useMutation({
    mutationFn: (connectionId: string) => {
      return icalConnectionService.testConnection(propertyId, connectionId);
    },
    onSuccess: (response) => {
      // Store the test results using the actual API response format
      setTestResult({
        data: response.data.data as TestConnectionResponse,
        meta: response.data.meta as TestConnectionMeta,
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

  const handleTestConnection = (connectionId: string) => {
    setTestResult({ data: null, meta: null, message: null, timestamp: null });
    testMutation.mutate(connectionId);
  };

  return {
    testResult,
    isLoading: testMutation.isPending,
    handleTestConnection
  };
}
