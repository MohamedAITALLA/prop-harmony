
import { FormValues } from "./PropertyFormSchema";
import { propertyService } from "@/services/api-service";
import { toast } from "sonner";
import { NavigateFunction } from "react-router-dom";
import { Property } from "@/types/api-responses";

export const handleEditFormSubmission = async (
  values: FormValues, 
  propertyId: string,
  navigate: NavigateFunction,
  initialData: Property,
  refetchProperty?: () => Promise<void>,
  uploadedImages: { [key: number]: File | null } = {},
  imagesToDelete: string[] = []
) => {
  try {
    toast.info("Updating property...");
    console.log("Submitting property update with values:", values);
    
    // Prepare new image files
    const newImageFiles: File[] = [];
    Object.values(uploadedImages).forEach(file => {
      if (file) {
        newImageFiles.push(file);
      }
    });
    
    console.log("Images to delete:", imagesToDelete);
    console.log("New image files:", newImageFiles.length);
    
    // Send empty object to API as requested
    const propertyData = {};
    
    console.log("Submitting update with data:", propertyData);
    const response = await propertyService.updateProperty(propertyId, propertyData, newImageFiles, imagesToDelete);
    console.log("Update response:", response);
    
    // Get updated fields from response if available
    const updatedFields = response?.data?.meta?.updated_fields || [];
    const changesCount = response?.data?.meta?.changes_count || 0;
    const imagesAdded = response?.data?.meta?.images_added || 0;
    const imagesDeleted = response?.data?.meta?.images_deleted || 0;
    
    if (response?.success) {
      // Explicitly log the updated property data to confirm image updates
      console.log("Updated property data:", response?.data?.property);
      console.log("Updated images:", response?.data?.property?.images || []);
      console.log("Original images count:", initialData.images?.length);
      console.log("Updated images count:", response?.data?.property?.images?.length || 0);

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
        if (imagesAdded > 0 || imagesDeleted > 0) {
          const imageChanges = [];
          if (imagesAdded > 0) {
            imageChanges.push(`${imagesAdded} image${imagesAdded > 1 ? 's' : ''} added`);
          }
          if (imagesDeleted > 0) {
            imageChanges.push(`${imagesDeleted} image${imagesDeleted > 1 ? 's' : ''} deleted`);
          }
          if (imageChanges.length > 0) {
            successMessage += ` (${imageChanges.join(', ')})`;
          }
        }
        
        toast.success(successMessage);
      }
      
      // Navigate to the property details page
      navigate(`/properties/${propertyId}`);
    } else {
      toast.error("Failed to update property. Please check your inputs and try again.");
    }
  } catch (error) {
    console.error("Error updating property:", error);
    toast.error("Failed to update property. Please try again.");
  }
};
