
import { FormValues } from "./PropertyFormSchema";
import { propertyService } from "@/services/api-service";
import { toast } from "sonner";
import { NavigateFunction } from "react-router-dom";

export const handleEditFormSubmission = async (
  values: FormValues, 
  propertyId: string,
  navigate: NavigateFunction,
  refetchProperty?: () => Promise<void>
) => {
  try {
    toast.info("Updating property...");
    console.log("Submitting property update with values:", values);
    
    // Prepare data for API - include only the specified fields
    const propertyData = {
      name: values.name,
      desc: values.description, // Map description to desc
      property_type: values.property_type,
      address: {
        street: values.street,
        city: values.city,
        state_province: values.stateProvince || "", // Map stateProvince to state_province
        postal_code: values.postalCode || "", // Map postalCode to postal_code
        country: values.country,
        coordinates: {
          latitude: values.latitude || 0,
          longitude: values.longitude || 0,
        }
      },
      bedrooms: Number(values.bedrooms) || 0,
      bathrooms: Number(values.bathrooms) || 0,
      beds: Number(values.beds) || Number(values.bedrooms) || 0,
      accommodates: Number(values.accommodates) || 1,
      amenities: {
        wifi: Boolean(values.wifi),
        kitchen: Boolean(values.kitchen),
        ac: Boolean(values.ac),
        heating: Boolean(values.heating),
        tv: Boolean(values.tv),
        washer: Boolean(values.washer),
        dryer: Boolean(values.dryer),
        parking: Boolean(values.parking),
        elevator: Boolean(values.elevator),
        pool: Boolean(values.pool),
      },
      policies: {
        check_in_time: values.checkInTime,
        check_out_time: values.checkOutTime,
        minimum_stay: Number(values.minimumStay) || 1, 
        pets_allowed: Boolean(values.petsAllowed),
        smoking_allowed: Boolean(values.smokingAllowed),
      },
      images: values.images.map(img => img.value).filter(url => url.trim() !== ""),
    };

    console.log("Submitting update with data:", propertyData);
    const response = await propertyService.updateProperty(propertyId, propertyData);
    console.log("Update response:", response);
    
    // Get updated fields from response if available
    const updatedFields = response?.data?.meta?.updated_fields || [];
    const changesCount = response?.data?.meta?.changes_count || 0;
    
    if (response?.success) {
      // Refetch the property data if the update was successful
      if (refetchProperty) {
        await refetchProperty();
      }
      
      // Show different toast messages based on the number of changes
      if (changesCount === 0) {
        toast.info("No changes were made to the property.");
      } else {
        toast.success(`Property updated successfully! (${changesCount} change${changesCount > 1 ? 's' : ''})`);
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
