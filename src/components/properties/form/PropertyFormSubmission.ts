
import { FormValues } from "./PropertyFormSchema";
import { propertyService } from "@/services/property-service";
import { toast } from "sonner";
import { NavigateFunction } from "react-router-dom";

export const handleFormSubmission = async (
  values: FormValues, 
  navigate: NavigateFunction,
  uploadedImages: { [key: number]: File | null } = {}
) => {
  try {
    // First, upload any images that are files and collect their paths
    const imagePaths = await uploadPropertyImages(uploadedImages);
    
    // Get image URLs from the form values
    const imageUrls = values.images.map(img => img.value)
      // Filter out blob URLs which are only for preview
      .filter(url => !url.startsWith('blob:') && url.trim() !== "");
    
    // Combine uploaded image paths and image URLs
    const finalImages = [...imagePaths, ...imageUrls];
    
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
      },
      // Use the combined list of images
      images: finalImages.length > 0 ? finalImages : ["https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=800&auto=format&fit=crop"],
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

// Helper function to upload images to the server
const uploadPropertyImages = async (uploadedImages: { [key: number]: File | null }): Promise<string[]> => {
  try {
    const imagePaths: string[] = [];
    const imageIndices = Object.keys(uploadedImages);
    
    if (imageIndices.length === 0) {
      return imagePaths;
    }
    
    // Create a FormData object to upload files
    for (const indexStr of imageIndices) {
      const index = parseInt(indexStr);
      const file = uploadedImages[index];
      
      if (file) {
        const formData = new FormData();
        formData.append('image', file);
        
        // Upload the image using the uploadImage service
        const response = await propertyService.uploadImage(formData);
        
        if (response?.data?.imagePath) {
          imagePaths.push(response.data.imagePath);
        }
      }
    }
    
    return imagePaths;
  } catch (error) {
    console.error("Error uploading images:", error);
    toast.error("Failed to upload one or more images.");
    return [];
  }
};
