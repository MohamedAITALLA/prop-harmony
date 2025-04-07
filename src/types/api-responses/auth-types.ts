
// Authentication related types
import { User } from "./user-types";

export interface AuthResponse {
  success: boolean;
  data: {
    access_token: string;
    token_type: string;
    expires_at: string;
    user: User;
  };
  message: string;
  timestamp: string;
  error?: {
    code: string;
    details: string;
  };
}

export interface RegisterResponse {
  success: boolean;
  data: {
    user: User;
    access_token?: string;
    token_type?: string;
    expires_at?: string;
  };
  message: string;
  timestamp: string;
  error?: {
    code: string;
    details: string;
  };
}

export interface EmailConfirmationResponse {
  success: boolean;
  message: string;
  timestamp: string;
  error?: {
    code: string;
    details: string;
  };
}

export interface ResendConfirmationResponse {
  success: boolean;
  message: string;
  timestamp: string;
  error?: {
    code: string;
    details: string;
  };
}
