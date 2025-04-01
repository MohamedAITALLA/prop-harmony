
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileService } from "@/services/api-service";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { UserProfileForm } from "@/components/settings/UserProfileForm";
import { TimezoneSettings } from "@/components/settings/TimezoneSettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { SecuritySettings } from "@/components/settings/SecuritySettings";
import { ProfileStatus } from "@/components/settings/ProfileStatus";
import { UserPreferences } from "@/types/api-responses";
import { Loader2, AlertTriangle } from "lucide-react";

export default function ProfileSettings() {
  const [activeTab, setActiveTab] = useState("general");
  
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: "system",
    language: "en",
    timezone: "UTC",
    date_format: "MM/DD/YYYY",
    time_format: "12h",
    currency: "USD",
    notifications_enabled: true
  });
  
  const [contactInfo, setContactInfo] = useState({
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    emergency_contact: {
      name: "",
      phone: "",
      relationship: ""
    }
  });
  
  const queryClient = useQueryClient();

  // Fetch user profile
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const response = await profileService.getProfile();
      return response.data;
    },
  });

  // Update preferences when profile loads
  useEffect(() => {
    if (profile) {
      if (profile.preferences) {
        setPreferences({
          theme: profile.preferences.theme || "system",
          language: profile.preferences.language || "en",
          timezone: profile.preferences.timezone || "UTC",
          date_format: profile.preferences.date_format || "MM/DD/YYYY",
          time_format: profile.preferences.time_format || "12h",
          currency: profile.preferences.currency || "USD",
          notifications_enabled: profile.preferences.notifications_enabled !== undefined ? profile.preferences.notifications_enabled : true,
        });
      }
      
      if (profile.contact_info) {
        setContactInfo(profile.contact_info);
      }
    }
  }, [profile]);

  // Update profile mutation
  const { mutate: updateProfile, isPending: isUpdating } = useMutation({
    mutationFn: async (data: any) => {
      return await profileService.updateProfile(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      toast.success("Profile updated successfully");
    },
  });

  // Reset profile mutation
  const { mutate: resetProfile, isPending: isResetting } = useMutation({
    mutationFn: async () => {
      return await profileService.resetProfile();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      
      // Update local state after reset
      if (data.data.preferences) {
        setPreferences({
          theme: data.data.preferences.theme || "system",
          language: data.data.preferences.language || "en",
          timezone: data.data.preferences.timezone || "UTC",
          date_format: data.data.preferences.date_format || "MM/DD/YYYY",
          time_format: data.data.preferences.time_format || "12h",
          currency: data.data.preferences.currency || "USD",
          notifications_enabled: data.data.preferences.notifications_enabled !== undefined ? data.data.preferences.notifications_enabled : true,
        });
      } else {
        setPreferences({
          theme: "system",
          language: "en",
          timezone: "UTC",
          date_format: "MM/DD/YYYY",
          time_format: "12h",
          currency: "USD",
          notifications_enabled: true
        });
      }
      
      if (data.data.contact_info) {
        setContactInfo(data.data.contact_info);
      } else {
        setContactInfo({
          phone: "",
          address: "",
          city: "",
          state: "",
          country: "",
          postalCode: "",
          emergency_contact: {
            name: "",
            phone: "",
            relationship: ""
          }
        });
      }
      
      toast.success("Profile has been reset to default settings");
    },
  });

  // Handle preference changes
  const handlePreferenceChange = (key: string, value: string | boolean) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Handle contact info changes
  const handleContactInfoChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setContactInfo(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev] as Record<string, any>,
          [child]: value
        }
      }));
    } else {
      setContactInfo(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    updateProfile({
      preferences,
      contact_info: contactInfo,
      onboarding_completed: true
    });
  };

  // Handle profile reset
  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset your profile? This will clear all your preferences and contact information.")) {
      resetProfile();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="my-8">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load your profile settings. Please try again later.
        </AlertDescription>
        <Button variant="outline" onClick={() => queryClient.invalidateQueries({ queryKey: ["user-profile"] })} className="mt-4">
          Retry
        </Button>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your profile settings and preferences
        </p>
      </div>
      
      {profile && (
        <ProfileStatus 
          onboardingCompleted={profile.onboarding_completed || false} 
          preferencesSet={Object.keys(profile.preferences || {}).length > 0}
          contactInfoSet={Object.keys(profile.contact_info || {}).length > 0}
        />
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="timezone">Time & Language</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal information and contact details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UserProfileForm 
                contactInfo={contactInfo}
                onInputChange={handleContactInfoChange}
                onboardingCompleted={profile?.onboarding_completed || false}
                onSubmit={handleSubmit}
                isSubmitting={isUpdating}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="timezone">
          <Card>
            <CardHeader>
              <CardTitle>Time & Language Settings</CardTitle>
              <CardDescription>
                Configure your timezone, date format, and language preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TimezoneSettings 
                preferences={preferences}
                onChange={handlePreferenceChange}
                onSubmit={handleSubmit}
                isSubmitting={isUpdating}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Manage your notification settings and email preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <NotificationSettings 
                preferences={preferences}
                onChange={handlePreferenceChange}
                onSubmit={handleSubmit}
                isSubmitting={isUpdating}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your password and security preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SecuritySettings 
                onReset={handleReset}
                isResetting={isResetting}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
