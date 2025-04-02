
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminProfileService, adminUserService } from "@/services/api-service";
import { toast } from "sonner";

export function useAdminProfiles() {
  const queryClient = useQueryClient();

  const getProfiles = (page = 1, limit = 10) => {
    return useQuery({
      queryKey: ["admin-profiles", page, limit],
      queryFn: async () => {
        try {
          const response = await adminProfileService.getUserProfiles({
            page,
            limit
          });
          return response?.data || { profiles: [], pagination: { total: 0, page: 1, limit: 10, pages: 0 } };
        } catch (error) {
          console.error("Failed to fetch profiles:", error);
          return { profiles: [], pagination: { total: 0, page: 1, limit: 10, pages: 0 } };
        }
      }
    });
  };

  const getProfile = (userId: string) => {
    return useQuery({
      queryKey: ["admin-profile", userId],
      queryFn: async () => {
        if (!userId) return null;
        try {
          const response = await adminProfileService.getUserProfile(userId);
          return response?.data || null;
        } catch (error) {
          console.error(`Failed to fetch profile for user ${userId}:`, error);
          return null;
        }
      },
      enabled: !!userId
    });
  };

  const updateProfileMutation = useMutation({
    mutationFn: async ({ userId, data }: { userId: string; data: any }) => {
      return adminProfileService.updateUserProfile(userId, data);
    },
    onSuccess: (response, variables) => {
      const message = response?.message || "Profile updated successfully";
      toast.success(message);
      queryClient.invalidateQueries({ queryKey: ["admin-profile", variables.userId] });
      queryClient.invalidateQueries({ queryKey: ["admin-profiles"] });
    },
    onError: (error) => {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  });

  const resetProfileMutation = useMutation({
    mutationFn: async (userId: string) => {
      return adminProfileService.resetUserProfile(userId);
    },
    onSuccess: (response, userId) => {
      const message = response?.message || "Profile reset successfully";
      toast.success(message);
      queryClient.invalidateQueries({ queryKey: ["admin-profile", userId] });
      queryClient.invalidateQueries({ queryKey: ["admin-profiles"] });
    },
    onError: (error) => {
      console.error("Error resetting profile:", error);
      toast.error("Failed to reset profile");
    }
  });

  // User management related functions
  const getUsersMutation = useMutation({
    mutationFn: async ({ page = 1, limit = 10 }: { page: number; limit: number }) => {
      try {
        const response = await adminUserService.getUsers({ page, limit });
        return response;
      } catch (error) {
        console.error("Failed to fetch users:", error);
        throw error;
      }
    }
  });

  const getUserDetails = (userId: string) => {
    return useQuery({
      queryKey: ["admin-user", userId],
      queryFn: async () => {
        if (!userId) return null;
        try {
          const response = await adminUserService.getUser(userId);
          return response?.data || null;
        } catch (error) {
          console.error(`Failed to fetch user details for ${userId}:`, error);
          return null;
        }
      },
      enabled: !!userId
    });
  };

  return {
    getProfiles,
    getProfile,
    updateProfile: (userId: string, data: any) => updateProfileMutation.mutate({ userId, data }),
    resetProfile: (userId: string) => resetProfileMutation.mutate(userId),
    isUpdating: updateProfileMutation.isPending,
    isResetting: resetProfileMutation.isPending,
    getUsers: ({ page = 1, limit = 10 }: { page: number; limit: number }) => getUsersMutation.mutate({ page, limit }),
    getUserDetails,
  };
}
