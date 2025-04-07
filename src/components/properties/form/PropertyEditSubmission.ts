
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
    console.log("New image files count:", newImageFiles.length);
    
    // Compare values with initialData to find changed fields
    const propertyData: Partial<{
      name: string;
      property_type: string;
      desc: string;
      address: {
        street: string;
        city: string;
        state_province: string;
        postal_code: string;
        country: string;
        coordinates?: {
          latitude: number;
          longitude: number;
        };
      };
      bedrooms: number;
      bathrooms: number;
      beds: number;
      accommodates: number;
      amenities: {
        wifi: boolean;
        kitchen: boolean;
        ac: boolean;
        heating: boolean;
        tv: boolean;
        washer: boolean;
        dryer: boolean;
        parking: boolean;
        elevator: boolean;
        pool: boolean;
      };
      policies: {
        check_in_time: string;
        check_out_time: string;
        minimum_stay: number;
        pets_allowed: boolean;
        smoking_allowed: boolean;
      };
    }> = {};

    // Check for basic information changes
    if (values.name !== initialData.name) {
      propertyData.name = values.name;
    }
    
    if (values.property_type !== initialData.property_type) {
      propertyData.property_type = values.property_type;
    }
    
    if (values.description !== initialData.desc) {
      propertyData.desc = values.description;
    }
    
    // Check for address changes
    const addressChanged = 
      values.street !== initialData.address.street ||
      values.city !== initialData.address.city ||
      values.stateProvince !== initialData.address.state_province ||
      values.postalCode !== initialData.address.postal_code ||
      values.country !== initialData.address.country ||
      values.latitude !== (initialData.address.coordinates?.latitude || 0) ||
      values.longitude !== (initialData.address.coordinates?.longitude || 0);
    
    if (addressChanged) {
      propertyData.address = {
        street: values.street,
        city: values.city,
        state_province: values.stateProvince || "",
        postal_code: values.postalCode || "",
        country: values.country,
        coordinates: {
          latitude: values.latitude || 0,
          longitude: values.longitude || 0
        }
      };
    }
    
    // Check for capacity changes
    if (values.bedrooms !== initialData.bedrooms) {
      propertyData.bedrooms = values.bedrooms;
    }
    
    if (values.bathrooms !== initialData.bathrooms) {
      propertyData.bathrooms = values.bathrooms;
    }
    
    if (values.beds !== initialData.beds) {
      propertyData.beds = values.beds;
    }
    
    if (values.accommodates !== initialData.accommodates) {
      propertyData.accommodates = values.accommodates;
    }
    
    // Check for amenities changes
    const amenitiesChanged = 
      values.wifi !== (initialData.amenities?.wifi || false) ||
      values.kitchen !== (initialData.amenities?.kitchen || false) ||
      values.ac !== (initialData.amenities?.ac || false) ||
      values.heating !== (initialData.amenities?.heating || false) ||
      values.tv !== (initialData.amenities?.tv || false) ||
      values.washer !== (initialData.amenities?.washer || false) ||
      values.dryer !== (initialData.amenities?.dryer || false) ||
      values.parking !== (initialData.amenities?.parking || false) ||
      values.elevator !== (initialData.amenities?.elevator || false) ||
      values.pool !== (initialData.amenities?.pool || false);
    
    if (amenitiesChanged) {
      propertyData.amenities = {
        wifi: values.wifi,
        kitchen: values.kitchen,
        ac: values.ac,
        heating: values.heating,
        tv: values.tv,
        washer: values.washer,
        dryer: values.dryer,
        parking: values.parking,
        elevator: values.elevator,
        pool: values.pool
      };
    }
    
    // Check for policies changes
    const policiesChanged = 
      values.checkInTime !== (initialData.policies?.check_in_time || "15:00") ||
      values.checkOutTime !== (initialData.policies?.check_out_time || "11:00") ||
      values.minimumStay !== (initialData.policies?.minimum_stay || 1) ||
      values.petsAllowed !== (initialData.policies?.pets_allowed || false) ||
      values.smokingAllowed !== (initialData.policies?.smoking_allowed || false);
    
    if (policiesChanged) {
      propertyData.policies = {
        check_in_time: values.checkInTime || "15:00",
        check_out_time: values.checkOutTime || "11:00",
        minimum_stay: values.minimumStay,
        pets_allowed: values.petsAllowed,
        smoking_allowed: values.smokingAllowed
      };
    }
    
    console.log("Submitting update with data:", propertyData);
    console.log(`About to call updateProperty with propertyId=${propertyId}, newImageFiles.length=${newImageFiles.length}, imagesToDelete=${JSON.stringify(imagesToDelete)}`);
    
    const response = await propertyService.updateProperty(propertyId, propertyData, newImageFiles, imagesToDelete);
    console.log("Complete update response:", response);
    
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

