import api from "@/lib/base-api";

interface PropertyQueryParams {
  page?: number;
  limit?: number;
  property_type?: string;
  city?: string;
  sort?: string;
  status?: string;
  include?: string;
}

export const propertyService = {
  getProperties: (params?: PropertyQueryParams) => {
    return api.get("/properties", { params });
  },
  getAllProperties: async (params?: PropertyQueryParams) => {
    try {
      console.log("Fetching properties with params:", params);
      const response = await api.get("/properties", { params });
      console.log("Properties API response:", response.data);
      return response.data; // Return the data portion directly
    } catch (error) {
      console.error("Error fetching properties:", error);
      throw error;
    }
  },
  getProperty: async (id: string, include?: string) => {
    try {
      console.log("Fetching property with ID:", id);
      
      const params: PropertyQueryParams = {};
      if (include) {
        params.include = include;
      }
      
      const response = await api.get(`/properties/${id}`, { params });
      console.log("Property API response:", response.data);
      
      // Check if the response is an error response
      if (response?.data?.success === false && response?.data?.error) {
        console.error("API returned an error response:", response.data);
        throw new Error(response.data.details?.message || response.data.error);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching property ${id}:`, error);
      throw error;
    }
  },
  createProperty: async (propertyData: any, images?: File[]) => {
    try {
      console.log("Creating property with data:", propertyData);
      
      // If we have images, use multipart/form-data
      if (images && images.length > 0) {
        const formData = new FormData();
        
        // Add property data as JSON string
        formData.append('property', JSON.stringify(propertyData));
        
        // Add each image to the form data
        images.forEach((image, index) => {
          formData.append(`images`, image);
        });
        
        const response = await api.post("/properties", formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        console.log("Create property response:", response.data);
        return response.data;
      } else {
        // If no images, still use multipart/form-data with property as JSON string
        const formData = new FormData();
        formData.append('property', JSON.stringify(propertyData));
        
        const response = await api.post("/properties", formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        console.log("Create property response:", response.data);
        return response.data;
      }
    } catch (error) {
      console.error("Error creating property:", error);
      throw error;
    }
  },
  updateProperty: async (id: string, data: any = {}, newImages?: File[], deleteImages?: string[]) => {
    try {
      // Normalize delete images array by removing leading slash
      const normalizedDeleteImages = deleteImages?.map(url => 
        url.startsWith('/https://') ? url.substring(1) : url
      ) || [];

      console.log("Normalized images to delete:", normalizedDeleteImages);

      const formData = new FormData();
      formData.append('property', JSON.stringify(data || {}));

      if (newImages && newImages.length > 0) {
        newImages.forEach((image) => {
          if (image) {
            formData.append('images', image);
          }
        });
      }

      // Use normalized delete images
      if (normalizedDeleteImages.length > 0) {
        const deleteImagesJson = JSON.stringify(normalizedDeleteImages);
        formData.append('deleteImages', JSON.stringify(deleteImagesJson));
      }

      console.log("About to send request to update property...");
      
      const response = await api.put(`/properties/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log("Update property response:", response.data);
      console.log("Full response data:", JSON.stringify(response.data, null, 2));
      
      // Log specific parts of the response for easier debugging
      if (response.data?.data?.property) {
        console.log("Updated property images:", response.data.data.property.images);
        console.log("Images count after update:", response.data.data.property.images.length);
      }
      
      if (response.data?.data?.meta) {
        console.log("Response metadata:", response.data.data.meta);
        console.log("Images deleted count:", response.data.data.meta.images_deleted || 0);
        console.log("Images added count:", response.data.data.meta.images_added || 0);
        console.log("Changes count:", response.data.data.meta.changes_count || 0);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error updating property ${id}:`, error);
      throw error;
    }
  },
  deleteProperty: async (id: string, preserveHistory: boolean = true) => {
    try {
      console.log(`Deleting property ${id}, preserve history: ${preserveHistory}`);
      
      const response = await api.delete(`/properties/${id}`, {
        params: { preserve_history: preserveHistory }
      });
      
      console.log("Delete property response:", response.data);
      return response.data;
    } catch (error) {
      console.error(`Error deleting property ${id}:`, error);
      throw error;
    }
  },
  uploadImage: async (formData: FormData) => {
    try {
      console.log("Uploading image...");
      // Update the endpoint to the correct one
      const response = await api.post("/upload/image", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log("Upload image response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  }
};

export default propertyService;
