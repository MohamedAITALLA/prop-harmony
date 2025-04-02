
import api from "@/lib/base-api";

export const profileService = {
  getProfile: () => {
    return api.get("/user-profile");
  },
  updateProfile: (data: any) => {
    return api.put("/user-profile", data);
  },
  resetProfile: () => {
    return api.post("/user-profile/reset", {});
  }
};

export default profileService;
