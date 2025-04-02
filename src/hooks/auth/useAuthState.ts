
import { useState, useEffect } from "react";
import { User } from "@/types/api-responses";
import { profileService } from "@/services/api-service";
import { ensureMongoId } from "@/lib/mongo-helpers";
import { useTokenManagement } from "./useTokenManagement";

/**
 * Hook for managing authentication state
 */
export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { hasToken, getToken } = useTokenManagement();
  
  useEffect(() => {
    const checkAuth = async () => {
      if (!hasToken()) {
        setIsLoading(false);
        return;
      }
      
      try {
        const response = await profileService.getProfile();
        const userData = response.data?.user || response.data;
        
        if (userData) {
          setUser(ensureMongoId(userData));
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        localStorage.removeItem("token");
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  return {
    user,
    setUser,
    isLoading,
    setIsLoading
  };
}
