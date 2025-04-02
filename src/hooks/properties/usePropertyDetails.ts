
import { useQuery } from "@tanstack/react-query";
import { propertyService } from "@/services/api-service";

export function usePropertyDetails(id: string | undefined) {
  const { 
    data: property, 
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
        const responseData = await propertyService.getProperty(id);
        
        console.log("API response:", responseData);
        
        // Check if the response has the expected structure
        if (responseData?.success && responseData?.data?.property) {
          console.log("Property data found:", responseData.data.property);
          return responseData.data.property;
        } else {
          console.error("Unexpected API response structure:", responseData);
          throw new Error("Property data not found in the API response");
        }
      } catch (error) {
        console.error("Error fetching property:", error);
        throw error;
      }
    },
    retry: 2, // Retry failed requests up to 2 times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });

  return {
    property,
    propertyLoading,
    propertyError,
    refetchProperty,
    isError
  };
}
