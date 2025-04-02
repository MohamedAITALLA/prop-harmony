
import { useQuery } from "@tanstack/react-query";
import { propertyService } from "@/services/api-service";

export function usePropertyDetails(id: string | undefined) {
  const { 
    data: propertyResponse, 
    isLoading: propertyLoading, 
    error: propertyError, 
    refetch: refetchProperty,
    isError
  } = useQuery({
    queryKey: ["property", id],
    queryFn: async () => {
      if (!id) throw new Error("Property ID is required");
      
      try {
        console.log("Fetching property details for ID:", id);
        return await propertyService.getProperty(id);
      } catch (error) {
        console.error("Error fetching property:", error);
        throw error;
      }
    },
    retry: 3, // Retry failed requests up to 3 times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });

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
    isError
  };
}
