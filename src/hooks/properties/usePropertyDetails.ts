
import { useQuery } from "@tanstack/react-query";
import { propertyService } from "@/services/api-service";
import { useState } from "react";
import { toast } from "sonner";
import { ensureMongoId } from "@/lib/mongo-helpers";

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
        
        // Try to validate or convert the ID format if needed
        const validId = id; // We'll use the ID as-is and let the API handle validation
        
        return await propertyService.getProperty(validId);
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
