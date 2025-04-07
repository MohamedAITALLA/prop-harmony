
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { icalConnectionService } from '@/services/ical-connection-service';
import { toast } from 'sonner';
import { TestResult } from '@/types/ical-connection';

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
      setTestResult({
        data: response.data.data,
        meta: response.data.data.meta,
        message: response.data.message,
        timestamp: response.data.timestamp
      });
      
      const valid = response.data.data.valid;
      
      if (valid) {
        const eventsFound = response.data.data.events_found || 0;
        toast.success(`Connection test successful`, {
          description: eventsFound > 0 
            ? `Found ${eventsFound} events in the iCal feed` 
            : "The feed is valid but contains no events"
        });
      } else {
        toast.error(`Connection test failed`, {
          description: response.data.data.error || "Could not validate the iCal feed"
        });
      }
    },
    onError: (error) => {
      setTestResult({
        data: null,
        meta: null,
        message: "Test failed with an error",
        timestamp: new Date().toISOString()
      });
      
      toast.error("Failed to test connection", {
        description: "There was a problem testing the calendar connection"
      });
      console.error("Error testing connection:", error);
    }
  });

  const handleTestConnection = (connectionId: string) => {
    setTestResult({
      data: null,
      meta: null,
      message: null,
      timestamp: null
    });
    testMutation.mutate(connectionId);
  };

  return {
    testResult,
    isLoading: testMutation.isPending,
    handleTestConnection
  };
}
