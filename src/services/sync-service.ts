
import api from "@/lib/base-api";

export const syncService = {
  syncAll: async () => {
    try {
      console.log("Syncing all properties");
      const response = await api.post("/sync", {}, {
        timeout: 180000 // 3 minute timeout for sync operations
      });
      console.log("Sync all response:", response.data);
      return response;
    } catch (error) {
      console.error("Error syncing all properties:", error);
      
      // Enhanced error handling for network issues
      if (error.message && (
        error.message.includes("Network Error") || 
        error.message.includes("ERR_NETWORK") || 
        error.message.includes("timeout")
      )) {
        throw new Error("Network connection issue. Please check your internet connection and try again.");
      }
      
      throw error;
    }
  },
  syncProperty: async (propertyId: string) => {
    try {
      console.log(`Syncing property ID: ${propertyId}`);
      const response = await api.post(`/properties/${propertyId}/sync`, {}, {
        timeout: 180000, // 3 minute timeout for sync operations
        // Adding retry mechanism for network issues
        signal: AbortSignal.timeout(180000),
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      console.log("Sync property response:", response.data);
      
      // Handle different response formats
      if (response.data && typeof response.data === 'object') {
        return response;
      } else {
        throw new Error("Invalid response format from sync API");
      }
    } catch (error) {
      console.error(`Error syncing property ${propertyId}:`, error);
      
      // Enhanced error handling for network issues
      if (error.message && (
        error.message.includes("Network Error") || 
        error.message.includes("ERR_NETWORK") || 
        error.message.includes("timeout")
      )) {
        throw new Error("Network connection issue. Please check your internet connection and try again.");
      }
      
      throw error;
    }
  },
  getPropertySyncStatus: async (propertyId: string) => {
    try {
      console.log(`Fetching sync status for property ID: ${propertyId}`);
      
      // Adding retry mechanism for network issues
      const maxRetries = 2;
      let retries = 0;
      let lastError: Error;
      
      while (retries <= maxRetries) {
        try {
          const response = await api.get(`/properties/${propertyId}/sync`, {
            headers: {
              'Cache-Control': 'no-cache',
              'Pragma': 'no-cache'
            }
          });
          console.log("Sync status response:", response.data);
          return response;
        } catch (error) {
          lastError = error;
          
          // Only retry on network errors
          if (error.message && (
            error.message.includes("Network Error") || 
            error.message.includes("ERR_NETWORK")
          )) {
            retries++;
            if (retries <= maxRetries) {
              console.log(`Retrying sync status fetch (${retries}/${maxRetries})...`);
              await new Promise(resolve => setTimeout(resolve, 1000 * retries));
              continue;
            }
          } else {
            // Don't retry on non-network errors
            throw error;
          }
        }
      }
      
      // If we get here, we've exhausted our retries
      throw lastError;
    } catch (error) {
      console.error(`Error fetching sync status for property ${propertyId}:`, error);
      
      // Enhanced error handling for network issues
      if (error.message && (
        error.message.includes("Network Error") || 
        error.message.includes("ERR_NETWORK") || 
        error.message.includes("timeout")
      )) {
        throw new Error("Network connection issue. Please check your internet connection and try again.");
      }
      
      throw error;
    }
  },
  getSyncStatus: () => {
    return api.get('/sync/status');
  }
};

export default syncService;
