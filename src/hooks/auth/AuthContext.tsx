
import { createContext, useContext, ReactNode } from "react";
import { User } from "@/types/api-responses";

export interface ExtendedUser extends User {
  profile_image?: string;
  name?: string;
}

export interface ProfileUpdateData {
  profile_image?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  [key: string]: any;
}

export interface AuthContextType {
  user: ExtendedUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile?: (data: ProfileUpdateData) => Promise<void>;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
