
import { FormValues } from "./PropertyFormSchema";
import { propertyService } from "@/services/api-service";
import { toast } from "sonner";
import { NavigateFunction } from "react-router-dom";

export const handleEditFormSubmission = async (
  values: FormValues, 
  propertyId: string,
  navigate: NavigateFunction
) => {
  try {
    toast.info("Updating property...");
    
    // Prepare data for API
    const propertyData = {
      name: values.name,
      property_type: values.property_type,
      description: values.description,
      address: {
        street: values.street,
        city: values.city,
        state_province: values.stateProvince,
        postal_code: values.postalCode,
        country: values.country,
        coordinates: {
          latitude: values.latitude || 0,
          longitude: values.longitude || 0,
        }
      },
      bedrooms: values.bedrooms,
      bathrooms: values.bathrooms,
      beds: values.beds || values.bedrooms,
      accommodates: values.accommodates,
      amenities: {
        wifi: values.wifi,
        kitchen: values.kitchen,
        ac: values.ac,
        heating: values.heating,
        tv: values.tv,
        washer: values.washer,
        dryer: values.dryer,
        parking: values.parking,
        elevator: values.elevator,
        pool: values.pool,
      },
      policies: {
        check_in_time: values.checkInTime,
        check_out_time: values.checkOutTime,
        minimum_stay: values.minimumStay,
        pets_allowed: values.petsAllowed,
        smoking_allowed: values.smokingAllowed,
      },
      images: values.images.map(img => img.value),
    };

    console.log("Submitting update with data:", propertyData);
    const response = await propertyService.updateProperty(propertyId, propertyData);
    console.log("Update response:", response);
    
    // Get updated fields from response if available
    const updatedFields = response?.data?.meta?.updated_fields || [];
    const changesCount = response?.data?.meta?.changes_count || 0;
    
    // Show different toast messages based on the number of changes
    if (changesCount === 0) {
      toast.info("No changes were made to the property.");
    } else {
      toast.success(`Property updated successfully! (${changesCount} change${changesCount > 1 ? 's' : ''})`);
    }
    
    // Navigate to the property details page
    navigate(`/properties/${propertyId}`);
  } catch (error) {
    console.error("Error updating property:", error);
    toast.error("Failed to update property. Please try again.");
  }
};
