import { useState, useEffect } from "react";
import { User, UserProfile } from "@/types/api-responses";
import { profileService } from "@/services/api-service";
import { ensureMongoId } from "@/lib/mongo-helpers";
import { useTokenManagement } from "./useTokenManagement";
import { toast } from "sonner";

/**
 * Hook for managing authentication state
 */
export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { hasToken, getToken } = useTokenManagement();
  
  // Function to fetch user profile
  const fetchUserProfile = async () => {
    if (!hasToken()) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await profileService.getProfile();
      const profile = response.data;
      
      const userData: User = {
        email: "",
        first_name: "",
        last_name: "",
        full_name: "",
        is_admin: false,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Type guard to check if the profile has user property
      const hasUser = (obj: any): obj is { user: User } => {
        return obj && typeof obj === "object" && "user" in obj;
      };
      
      // Type guard to check if the profile has user_details property
      const hasUserDetails = (obj: any): obj is { user_details: { email: string; first_name: string; last_name: string; full_name: string; } } => {
        return obj && typeof obj === "object" && "user_details" in obj;
      };
      
      if (hasUser(profile)) {
        Object.assign(userData, profile.user);
      } else if (hasUserDetails(profile)) {
        Object.assign(userData, profile.user_details, {
          is_admin: false,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }
      
      if (userData) {
        // Ensure the user data has consistent ID format
        const processedUser = ensureMongoId(userData);
        setUser(processedUser);
        
        // Cache the user data for better persistence
        localStorage.setItem("user_data", JSON.stringify(processedUser));
      } else {
        // Clear user data if response doesn't contain user
        setUser(null);
        localStorage.removeItem("user_data");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      // Only remove token on authentication errors (401, 403)
      if (error && typeof error === 'object' && 'status' in error && 
          ([401, 403].includes(Number((error as any).status)))) {
        localStorage.removeItem("token");
        localStorage.removeItem("user_data");
        setUser(null);
        toast.error("Your session has expired. Please log in again.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Set up initial auth state and listeners
  useEffect(() => {
    // First try to load from cache for immediate UI display
    const cachedUser = localStorage.getItem("user_data");
    if (cachedUser) {
      try {
        setUser(JSON.parse(cachedUser));
      } catch (e) {
        console.error("Error parsing cached user data:", e);
        localStorage.removeItem("user_data");
      }
    }
    
    // Then fetch the latest data from the API
    fetchUserProfile();
    
    // Set up event listener for storage events (for multi-tab support)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "token" && !e.newValue) {
        setUser(null);
      } else if (e.key === "user_data" && e.newValue) {
        try {
          setUser(JSON.parse(e.newValue));
        } catch (e) {
          console.error("Error parsing user data from storage event:", e);
        }
      }
    };
    
    window.addEventListener("storage", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Custom setter that also updates local storage
  const setUserWithPersistence = (newUser: User | null) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem("user_data", JSON.stringify(newUser));
    } else {
      localStorage.removeItem("user_data");
    }
  };

  return {
    user,
    setUser: setUserWithPersistence,
    isLoading,
    setIsLoading,
    refreshUser: fetchUserProfile
  };
}
