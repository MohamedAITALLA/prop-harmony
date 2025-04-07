
import api from "@/lib/base-api";
import { ApiResponse } from "@/types/api-responses";

interface PropertyQueryParams {
  page?: number;
  limit?: number;
  property_type?: string;
  city?: string;
  sort?: string;
  status?: string;
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
  getProperty: async (id: string) => {
    try {
      console.log("Fetching property with ID:", id);
      
      // For testing non-ObjectId formats, we can handle special cases
      // In production, you might want to implement a proper ID validation/conversion
      if (id.startsWith('prop-')) {
        // This is a temporary solution to handle non-MongoDB ID formats for demo purposes
        // In a real app, you'd likely have a mapping service or use different API endpoints
        console.log("Using special demo property ID format");
        
        // Simulate a successful response for demo IDs
        return {
          success: true,
          data: {
            property: {
              _id: id,
              name: "Demo Property",
              description: "This is a demo property with a non-ObjectID format",
              property_type: "Apartment",
              address: {
                street: "123 Demo Street",
                city: "Demo City",
                state: "Demo State",
                zip: "12345",
                country: "Demoland"
              },
              amenities: ["WiFi", "Kitchen", "Parking"],
              status: "active",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          }
        };
      }
      
      const response = await api.get(`/properties/${id}`);
      console.log("Property API response:", response.data);
      
      // Check if the response is an error response
      if (response?.data?.success === false && response?.data?.error) {
        console.error("API returned an error response:", response.data);
        throw new Error(response.data.details?.message || response.data.error);
      }
      
      // Check if the response has the expected structure
      if (response?.data?.success && response?.data?.data?.property) {
        console.log("Property data found:", response.data.data.property);
        return response.data;
      } else if (response?.data?.property) {
        // Alternative response structure
        console.log("Property data found in alternative format:", response.data.property);
        return {
          success: true,
          data: {
            property: response.data.property
          }
        };
      } else {
        console.error("Unexpected API response structure:", response.data);
        throw new Error("Property data not found in the API response");
      }
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
        // If no images, just send JSON
        const response = await api.post("/properties", { property: propertyData });
        console.log("Create property response:", response.data);
        return response.data;
      }
    } catch (error) {
      console.error("Error creating property:", error);
      throw error;
    }
  },
  updateProperty: async (id: string, data: any) => {
    try {
      console.log(`Updating property ${id} with data:`, data);
      const response = await api.put(`/properties/${id}`, data);
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
