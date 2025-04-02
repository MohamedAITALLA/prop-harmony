
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { User } from "@/types/api-responses";
import { authService, profileService } from "@/services/api-service";
import { ensureMongoId } from "@/lib/mongo-helpers";

// Enable development mode to bypass authentication
const DEV_MODE = true; // Set to false to use the actual API

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      // In development mode, create a mock user
      if (DEV_MODE) {
        const mockUser: User = {
          _id: "dev-user-id",
          email: "dev@example.com",
          first_name: "Developer",
          last_name: "User",
          full_name: "Developer User",
          is_admin: true,
          is_active: true,
          role: "admin",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        setUser(mockUser);
        setIsLoading(false);
        return;
      }
      
      const token = localStorage.getItem("token");
      
      if (!token) {
        setIsLoading(false);
        return;
      }
      
      try {
        const response = await profileService.getProfile();
        if (response && response.data) {
          // Check if the response.data has a user property that contains the actual User data
          if (response.data.user) {
            setUser(ensureMongoId(response.data.user));
          } else {
            // If response.data is the user object directly
            setUser(ensureMongoId(response.data));
          }
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

  const login = async (email: string, password: string) => {
    try {
      // In development mode, create a mock user and bypass authentication
      if (DEV_MODE) {
        const mockUser: User = {
          _id: "dev-user-id",
          email: email || "dev@example.com",
          first_name: "Developer",
          last_name: "User",
          full_name: "Developer User",
          is_admin: true,
          is_active: true,
          role: "admin",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        setUser(mockUser);
        navigate("/dashboard");
        toast.success("Development mode: Authentication bypassed");
        return;
      }

      // Log the request to help with debugging
      console.log("Sending login request with:", { email, password: "***" });
      
      try {
        const response = await authService.login(email, password);
        console.log("Login API response:", response);
        
        // Handle different API response formats for tokens
        if (response && response.data) {
          let token = null;
          
          // Extract token based on different possible response formats
          if (response.data.access_token) {
            token = response.data.access_token;
          } else if (response.data.token) {
            token = response.data.token;
          } else if (typeof response.data === 'string') {
            // Some APIs might return the token directly as a string
            token = response.data;
          } else if (response.data.data && (response.data.data.token || response.data.data.access_token)) {
            // Some APIs nest data inside a data property
            token = response.data.data.token || response.data.data.access_token;
          }
          
          if (token) {
            localStorage.setItem("token", token);
            
            try {
              // Get user data from the response or fetch profile
              if (response.data.user) {
                setUser(ensureMongoId(response.data.user));
              } else {
                // If login doesn't return user data, fetch it separately
                const userResponse = await profileService.getProfile();
                if (userResponse?.data) {
                  const userData = userResponse.data.user || userResponse.data;
                  setUser(ensureMongoId(userData));
                }
              }
              
              navigate("/dashboard");
              toast.success("Login successful!");
            } catch (profileError) {
              console.error("Error fetching user profile:", profileError);
              // If we can't get the profile, but have a token, still proceed
              navigate("/dashboard");
              toast.success("Login successful!");
            }
          } else {
            console.error("Login response structure:", response.data);
            toast.error("Invalid response format from server. Token not found.");
            throw new Error("No token received from server");
          }
        } else {
          toast.error("Empty response received from server");
          throw new Error("Empty response from server");
        }
      } catch (apiError) {
        console.error("API error during login:", apiError);
        toast.error("Login failed. Please check your credentials and try again.");
        throw apiError;
      }
    } catch (error) {
      console.error("Login error:", error);
      // The error toast is already handled by the API interceptor
      throw error;
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      // In development mode, create a mock user and bypass registration
      if (DEV_MODE) {
        const mockUser: User = {
          _id: "dev-user-id",
          email: userData.email,
          first_name: userData.firstName,
          last_name: userData.lastName,
          full_name: `${userData.firstName} ${userData.lastName}`,
          is_admin: false,
          is_active: true,
          role: "user",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        setUser(mockUser);
        navigate("/dashboard");
        toast.success("Development mode: Registration bypassed");
        return;
      }

      const response = await authService.register({
        email: userData.email,
        password: userData.password,
        first_name: userData.firstName,
        last_name: userData.lastName,
      });
      
      // Store the JWT token
      if (response.data.access_token) {
        localStorage.setItem("token", response.data.access_token);
      } else if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      
      // Set user from the response
      if (response.data.user) {
        setUser(ensureMongoId(response.data.user));
      } else {
        // If registration doesn't return user data, fetch it separately
        const userResponse = await profileService.getProfile();
        if (userResponse && userResponse.data) {
          const userData = userResponse.data.user || userResponse.data;
          setUser(ensureMongoId(userData));
        }
      }
      
      navigate("/dashboard");
      const successMessage = response.data?.message || "Registration successful!";
      toast.success(successMessage);
    } catch (error) {
      console.error("Registration error:", error);
      // The error toast is already handled by the API interceptor
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
    toast.success("You have been logged out.");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
