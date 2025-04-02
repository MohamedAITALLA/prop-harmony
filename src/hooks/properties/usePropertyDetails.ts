
import { useQuery } from "@tanstack/react-query";
import { propertyService } from "@/services/api-service";
import { useState } from "react";

export function usePropertyDetails(id: string | undefined) {
  const [retryAttempt, setRetryAttempt] = useState(0);

  const { 
    data: propertyResponse, 
    isLoading: propertyLoading, 
    error: propertyError, 
    refetch: refetchProperty,
    isError,
    isRefetching
  } = useQuery({
    queryKey: ["property", id, retryAttempt],
    queryFn: async () => {
      if (!id) throw new Error("Property ID is required");
      
      try {
        console.log("Fetching property details for ID:", id);
        return await propertyService.getProperty(id);
      } catch (error) {
        console.error("Error fetching property:", error);
        
        // Enhanced error handling for network errors
        if (error.message && (
          error.message.includes("Network Error") || 
          error.message.includes("ERR_NETWORK") ||
          error.message.includes("timeout")
        )) {
          throw new Error("Network connection issue. Please check your internet connection and try again.");
        }
        
        throw error;
      }
    },
    retry: 3, // Retry failed requests up to 3 times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const manualRetry = () => {
    setRetryAttempt(prev => prev + 1);
  };

  // Extract property from response with proper fallbacks
  const property = propertyResponse?.data?.property || 
                   propertyResponse?.property || 
                   (propertyResponse?.success ? propertyResponse.data : null);

  return {
    property,
    propertyResponse,
    propertyLoading,
    propertyError,
    refetchProperty,
    isError,
    isRefetching,
    manualRetry
  };
}
