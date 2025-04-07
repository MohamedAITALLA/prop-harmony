
import { FormValues } from "../PropertyFormSchema";
import { propertyService } from "@/services/api-service";
import { toast } from "sonner";
import { NavigateFunction } from "react-router-dom";
import { Property } from "@/types/api-responses";
import { extractChangedPropertyData } from "./propertyDataTransformer";
import { logImageDetails } from "./imageUtils";
import { handleSuccessResponse, handlePropertyRefetch } from "./responseHandlers";

/**
 * Main function for handling property edit form submission
 */
export const handleEditFormSubmission = async (
  values: FormValues, 
  propertyId: string,
  navigate: NavigateFunction,
  initialData: Property,
  refetchProperty?: () => Promise<void>,
  uploadedImages: { [key: number]: File | null } = {},
  imagesToDelete: string[] = []
): Promise<void> => {
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
    console.log("New image files count:", newImageFiles.length);
    
    // Extract changed fields by comparing with initialData
    const propertyData = extractChangedPropertyData(values, initialData);
    
    console.log("Submitting update with data:", propertyData);
    console.log(`About to call updateProperty with propertyId=${propertyId}, newImageFiles.length=${newImageFiles.length}, imagesToDelete=${JSON.stringify(imagesToDelete)}`);
    
    const response = await propertyService.updateProperty(
      propertyId, 
      propertyData, 
      newImageFiles, 
      imagesToDelete
    );
    
    console.log("Complete update response:", response);
    
    if (response?.success) {
      // Log image details for confirmation
      logImageDetails(response, initialData.images?.length || 0);

      // Handle refetching property data
      await handlePropertyRefetch(refetchProperty);
      
      // Handle success responses and navigation
      handleSuccessResponse(response, navigate, propertyId);
    } else {
      toast.error("Failed to update property. Please check your inputs and try again.");
    }
  } catch (error) {
    console.error("Error updating property:", error);
    toast.error("Failed to update property. Please try again.");
  }
};
