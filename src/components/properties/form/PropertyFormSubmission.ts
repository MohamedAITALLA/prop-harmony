
import { FormValues } from "./PropertyFormSchema";
import { propertyService } from "@/services/api-service";
import { toast } from "sonner";
import { NavigateFunction } from "react-router-dom";

export const handleFormSubmission = async (
  values: FormValues, 
  navigate: NavigateFunction,
  uploadedImages: { [key: number]: File | null } = {}
) => {
  try {
    // Show toast indicating that data is being submitted
    toast.info("Creating your property...");
    
    // Prepare data for API
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
      }
    };

    // Extract image files from the uploadedImages object
    const imageFiles: File[] = [];
    Object.values(uploadedImages).forEach(file => {
      if (file) {
        imageFiles.push(file);
      }
    });

    // If no images were uploaded successfully, show an error
    if (imageFiles.length === 0) {
      toast.error("Please upload at least one image for your property.");
      return;
    }

    // Create property with images
    const response = await propertyService.createProperty(propertyData, imageFiles);
    
    toast.success("Property created successfully!");
    
    // Navigate to the property details page
    if (response?.data?.property?._id || response?.data?.property?.id) {
      const propertyId = response.data.property._id || response.data.property.id;
      navigate(`/properties/${propertyId}`);
    } else {
      navigate("/properties");
    }
  } catch (error) {
    console.error("Error creating property:", error);
    toast.error("Failed to create property. Please try again.");
  }
};
