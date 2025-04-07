
import api from "@/lib/base-api";
import { ApiResponse } from "@/types/api-responses";

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
  updateProperty: async (id: string, data: any, newImages?: File[], deleteImages?: string[]) => {
    try {
      console.log(`Updating property ${id} with data:`, data);
      
      // Always use multipart/form-data for consistency with API specs
      const formData = new FormData();
      
      // Add property data as JSON string
      formData.append('property', JSON.stringify(data));
      
      // Add new images if any
      if (newImages && newImages.length > 0) {
        newImages.forEach((image) => {
          if (image) {
            formData.append('images', image);
          }
        });
      }
      
      // Add image URLs to delete if any
      if (deleteImages && deleteImages.length > 0) {
        formData.append('deleteImages', JSON.stringify(deleteImages));
      }
      
      const response = await api.put(`/properties/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log("Update property response:", response.data);
      return response.data;
    } catch (error) {
      console.error(`Error updating property ${id}:`, error);
      throw error;
    }
  },
  deleteProperty: async (id: string) => {
    try {
      console.log(`Deleting property ${id}`);
      // Always set preserve_history to true by default
      const response = await api.delete(`/properties/${id}`, {
        params: { preserve_history: true }
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
