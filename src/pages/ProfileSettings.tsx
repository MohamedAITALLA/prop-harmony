import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { profileService } from "@/services/api-service";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPreferences } from "@/types/api-responses";
import { toast } from "sonner";

import { UserProfileForm } from "@/components/settings/UserProfileForm";
import { TimezoneSettings } from "@/components/settings/TimezoneSettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { SecuritySettings } from "@/components/settings/SecuritySettings";
import { ProfileStatus } from "@/components/settings/ProfileStatus";

export default function ProfileSettings() {
  const defaultPreferences: UserPreferences = {
    theme: "system",
    language: "en",
    timezone: "America/New_York",
    date_format: "MM/DD/YYYY",
    time_format: "12h",
    currency: "USD",
    notifications_enabled: true,
  };
  
  const defaultContactInfo = {
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    emergency_contact: {
      name: "",
      phone: "",
      relationship: "",
    },
  };
  
  const defaultNotificationSettings = {
    email_notifications: true,
    new_booking_notifications: true,
    modified_booking_notifications: true,
    cancelled_booking_notifications: true,
    conflict_notifications: true,
    sync_failure_notifications: true,
  };
  
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [contactInfo, setContactInfo] = useState(defaultContactInfo);
  const [notificationSettings, setNotificationSettings] = useState(defaultNotificationSettings);
  const [isLoading, setIsLoading] = useState(false);
  
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const preferencesSet = Object.keys(preferences).length > 0;
  const contactInfoSet = contactInfo.phone !== "" || contactInfo.address !== "";
  
  const { data: profileData, isLoading: profileIsLoading } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      try {
        const response = await profileService.getProfile();
        return response.data;
      } catch (error) {
        console.error("Error fetching profile:", error);
        return null;
      }
    },
  });

  React.useEffect(() => {
    if (profileData) {
      setPreferences({
        ...defaultPreferences,
        ...profileData.data.preferences,
      });
      
      if (profileData.data.contact_info) {
        const contact = profileData.data.contact_info as Record<string, any>;
        const newContactInfo = {
          phone: contact.phone || "",
          address: contact.address || "",
          city: contact.city || "",
          state: contact.state || "",
          country: contact.country || "",
          postalCode: contact.postalCode || "",
          emergency_contact: {
            name: (contact.emergency_contact?.name || ""),
            phone: (contact.emergency_contact?.phone || ""),
            relationship: (contact.emergency_contact?.relationship || ""),
          }
        };
        setContactInfo(newContactInfo);
      }
      
      setOnboardingCompleted(profileData.data.onboarding_completed);
    }
  }, [profileData]);
  
  const handleSaveProfile = async () => {
    setIsLoading(true);
    
    try {
      await profileService.updateProfile({
        preferences: preferences,
        contact_info: contactInfo as any,
        onboarding_completed: true,
      });
      
      setOnboardingCompleted(true);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSaveNotificationSettings = async () => {
    setIsLoading(true);
    
    try {
      await profileService.updateProfile({
        preferences: {
          ...preferences,
          notifications_enabled: notificationSettings.email_notifications,
        },
      });
      
      toast.success("Notification settings updated successfully");
    } catch (error) {
      console.error("Error updating notification settings:", error);
      toast.error("Failed to update notification settings");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleChangePassword = async (currentPassword: string, newPassword: string) => {
    setIsLoading(true);
    
    try {
      await profileService.updateProfile({
        password_update: {
          current: currentPassword,
          new: newPassword,
        },
      });
      
      toast.success("Password updated successfully");
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResetProfile = async () => {
    if (window.confirm("Are you sure you want to reset your profile? This will clear all your preferences and settings.")) {
      setIsLoading(true);
      
      try {
        await profileService.resetProfile();
        
        setPreferences(defaultPreferences);
        setContactInfo(defaultContactInfo);
        setOnboardingCompleted(false);
        
        toast.success("Profile reset successfully");
      } catch (error) {
        console.error("Error resetting profile:", error);
        toast.error("Failed to reset profile");
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  if (profileIsLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-3/4">
          <h1 className="text-3xl font-bold tracking-tight mb-6">Profile Settings</h1>
          
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="timezone">Time & Region</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <UserProfileForm
                preferences={preferences}
                contactInfo={contactInfo}
                onPreferencesChange={setPreferences}
                onContactInfoChange={setContactInfo}
                onSave={handleSaveProfile}
              />
            </TabsContent>
            
            <TabsContent value="timezone">
              <TimezoneSettings
                preferences={preferences}
                onChange={setPreferences}
                onSave={handleSaveProfile}
              />
            </TabsContent>
            
            <TabsContent value="notifications">
              <NotificationSettings
                settings={notificationSettings}
                onChange={setNotificationSettings}
                onSave={handleSaveNotificationSettings}
              />
            </TabsContent>
            
            <TabsContent value="security">
              <SecuritySettings
                onChangePassword={handleChangePassword}
              />
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="w-full md:w-1/4">
          <ProfileStatus
            onboardingCompleted={onboardingCompleted}
            preferencesSet={preferencesSet}
            contactInfoSet={contactInfoSet}
            onReset={handleResetProfile}
          />
        </div>
      </div>
    </div>
  );
}
