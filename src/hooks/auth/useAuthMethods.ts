
import { useState } from "react";
import { toast } from "sonner";
import { authService } from "@/services/auth-service";
import { ensureMongoId } from "@/lib/mongo-helpers";
import { User } from "@/types/api-responses";
import { RegisterData } from "./AuthContext";
import { useTokenManagement } from "./useTokenManagement";

/**
 * Hook for authentication methods (login, register, logout)
 */
export function useAuthMethods(
  setUser: (user: User | null) => void,
  navigate: (path: string) => void
) {
  const { setToken, removeToken } = useTokenManagement();
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authService.login(email, password);
      
      if (response.success && response.data) {
        const { access_token, user } = response.data;
        
        setToken(access_token);
        
        if (user) {
          // Convert id to _id if needed
          const processedUser = ensureMongoId(user);
          // Store user data in local storage for persistence
          localStorage.setItem("user_data", JSON.stringify(processedUser));
          setUser(processedUser);
          
          // Navigate to dashboard
          navigate("/dashboard");
          toast.success(response.message || "Login successful!");
        } else {
          console.warn("No user data in login response");
          toast.error("Login was incomplete. Please try again.");
        }
      } else {
        console.error("Invalid login response structure:", response);
        toast.error("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Unable to log in. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    try {
      const response = await authService.register({
        email: userData.email,
        password: userData.password,
        first_name: userData.firstName,
        last_name: userData.lastName,
      });
      
      if (response.success && response.data) {
        const { access_token, user } = response.data;
        
        if (access_token) {
          setToken(access_token);
        }
        
        if (user) {
          const processedUser = ensureMongoId(user);
          // Store user data in local storage for persistence
          localStorage.setItem("user_data", JSON.stringify(processedUser));
          setUser(processedUser);
          
          navigate("/dashboard");
          toast.success(response.message || "Registration successful!");
        } else {
          toast.success(response.message || "Registration successful! Please log in.");
          navigate("/login");
        }
      } else {
        console.error("Invalid registration response:", response);
        toast.error("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Unable to register. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Clear all auth-related data
    removeToken();
    localStorage.removeItem("user_data");
    setUser(null);
    
    // Navigate to login page
    navigate("/login");
    toast.success("You have been logged out.");
  };

  return {
    login,
    register,
    logout,
    isLoading
  };
}
