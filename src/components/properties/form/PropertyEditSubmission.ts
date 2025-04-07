
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
    
    // Only include changed fields in the update payload
    const propertyData = {};
    
    // No need to send empty object, API will handle it
    
    console.log("Submitting update with data:", propertyData);
    const response = await propertyService.updateProperty(propertyId, propertyData, newImageFiles, imagesToDelete);
    console.log("Update response:", response);
    
    // Get updated fields from response if available
    const updatedFields = response?.data?.meta?.updated_fields || [];
    const changesCount = response?.data?.meta?.changes_count || 0;
    const imagesAdded = response?.data?.meta?.images_added || 0;
    const imagesDeleted = response?.data?.meta?.images_deleted || 0;
    
    if (response?.success) {
      // Refetch the property data if the update was successful
      if (refetchProperty) {
        await refetchProperty();
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
