
import { FormValues } from "./PropertyFormSchema";
import { propertyService } from "@/services/api-service";
import { toast } from "sonner";
import { NavigateFunction } from "react-router-dom";

export const handleFormSubmission = async (
  values: FormValues, 
  navigate: NavigateFunction
) => {
  try {
    // Prepare data for API
    const propertyData = {
      name: values.name,
      property_type: values.property_type,
      description: values.description,
      address: {
        street: values.street,
        city: values.city,
        state_province: values.stateProvince || "", // Always ensure it's a string, default to empty string
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

    const response = await propertyService.createProperty(propertyData);
    
    toast.success("Property created successfully!");
    
    // Navigate to the property details page
    if (response?.data?.property?._id) {
      navigate(`/properties/${response.data.property._id}`);
    } else {
      navigate("/properties");
    }
  } catch (error) {
    console.error("Error creating property:", error);
    toast.error("Failed to create property. Please try again.");
  }
};
