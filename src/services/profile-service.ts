
import api from "@/lib/base-api";
import { ProfileResponse, ProfileUpdateResponse, ProfileResetResponse } from "@/types/api-responses";

export const profileService = {
  getProfile: () => {
    return api.get<ProfileResponse>("/user-profile");
  },
  
  updateProfile: (data: any) => {
    return api.put<ProfileUpdateResponse>("/user-profile", data);
  },
  
  resetProfile: () => {
    return api.post<ProfileResetResponse>("/user-profile/reset", {});
  },
  
  uploadProfileImage: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    
    return api.post<{
      success: boolean;
      data: { profile_image: string; user_id: string };
      message: string;
      timestamp: string;
    }>("/user-profile/upload-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  
  deleteProfileImage: () => {
    return api.post<{
      success: boolean;
      message: string;
      timestamp: string;
    }>("/user-profile/delete-image");
  }
};

export default profileService;
