
import { toast } from "sonner";
import { handleImageResponseData } from "./imageUtils";
import { NavigateFunction } from "react-router-dom";

/**
 * Creates and displays appropriate toast messages based on the API response
 */
export const handleSuccessResponse = (
  response: any,
  navigate: NavigateFunction,
  propertyId: string
): void => {
  // Get updated fields from response if available
  const changesCount = response?.data?.meta?.changes_count || 0;
  const imagesAdded = response?.data?.meta?.images_added || 0;
  const imagesDeleted = response?.data?.meta?.images_deleted || 0;
  
  // Show different toast messages based on the changes
  if (changesCount === 0 && imagesAdded === 0 && imagesDeleted === 0) {
    toast.info("No changes were made to the property.");
  } else {
    let successMessage = `Property updated successfully!`;
    
    // Add details about changes
    if (changesCount > 0) {
      successMessage += ` (${changesCount} field${changesCount > 1 ? 's' : ''} updated)`;
    }
    
    // Add details about image changes
    const imageChangesText = handleImageResponseData(imagesAdded, imagesDeleted);
    if (imageChangesText) {
      successMessage += ` (${imageChangesText})`;
    }
    
    toast.success(successMessage);
  }
  
  // Navigate to the property details page
  navigate(`/properties/${propertyId}`);
};

/**
 * Handles property data refetch after update
 */
export const handlePropertyRefetch = async (
  refetchProperty?: () => Promise<void>
): Promise<void> => {
  // Force refetch the property data to ensure we have the latest data
  if (refetchProperty) {
    try {
      console.log("Refetching property data after update...");
      await refetchProperty();
      console.log("Property data refetched successfully after update");
    } catch (refetchError) {
      console.error("Error refetching property after update:", refetchError);
    }
  }
};
