
import { useQuery } from "@tanstack/react-query";
import { propertyService } from "@/services/api-service";
import { useState } from "react";
import { toast } from "sonner";

export function usePropertyDetails(id: string | undefined, include?: string) {
  const [retryAttempt, setRetryAttempt] = useState(0);
  const [forceRefresh, setForceRefresh] = useState(0); // Add state for forcing a refresh

  const { 
    data: propertyResponse, 
    isLoading: propertyLoading, 
    error: propertyError, 
    refetch: refetchPropertyInternal,
    isError,
    isRefetching
  } = useQuery({
    queryKey: ["property", id, retryAttempt, include, forceRefresh], // Add forceRefresh to queryKey
    queryFn: async () => {
      if (!id) throw new Error("Property ID is required");
      
      try {
        console.log("Fetching property details for ID:", id);
        
        const response = await propertyService.getProperty(id, include);
        
        // Enhanced validation to ensure we have property data
        if (!response?.data?.property && !response?.property && !(response?.success && response?.data)) {
          console.error("Invalid property data structure in response:", response);
          throw new Error("Property data not found in the API response");
        }
        
        return response;
      } catch (error) {
        console.error("Error fetching property:", error);
        
        // Enhanced error handling for the ObjectID error
        if (error.message && (
          error.message.includes("Cast to ObjectId failed") ||
          error.message.includes("invalid ObjectId")
        )) {
          toast.error("Invalid property ID format. Please check the URL and try again.");
          throw new Error("Invalid property ID format. The ID doesn't match the expected format.");
        }
        
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
    staleTime: 0, // Always get fresh data
    cacheTime: 1000, // Short cache time to ensure fresh data
    refetchOnWindowFocus: true, // Refresh when the window gets focus
  });

  const manualRetry = () => {
    setRetryAttempt(prev => prev + 1);
  };

  // Create a refetch function that forces a complete refresh
  const refetchProperty = async () => {
    console.log("Forcing property refetch...");
    
    // First invalidate the query by changing the forceRefresh key
    setForceRefresh(prev => prev + 1);
    
    // Then trigger the refetch
    const result = await refetchPropertyInternal();
    console.log("Property refetch result:", result);
    
    return result;
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
