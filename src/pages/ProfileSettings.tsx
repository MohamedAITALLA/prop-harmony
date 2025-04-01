
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileService } from "@/services/api-service";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { normalizeMongoObject } from "@/lib/mongo-helpers";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, User } from "lucide-react";

export default function ProfileSettings() {
  const queryClient = useQueryClient();
  const [preferences, setPreferences] = useState({
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
    address2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
    emergency_contact: "",
    emergency_phone: ""
  });
  
  const { data: profileData, isLoading, error } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      try {
        const response = await profileService.getProfile();
        return response;
      } catch (error) {
        console.error("Error fetching profile:", error);
        throw error;
      }
    }
  });
  
  // Populate state when profile data is available
  React.useEffect(() => {
    if (profileData?.data) {
      // Normalize the data to ensure consistent ID fields
      const normalizedData = normalizeMongoObject(profileData.data);
      setPreferences(normalizedData.preferences || preferences);
      setContactInfo(normalizedData.contact_info || contactInfo);
    }
  }, [profileData]);
  
  const updateProfileMutation = useMutation({
    mutationFn: async (formData: {
      preferences: typeof preferences;
      contact_info: typeof contactInfo;
    }) => {
      return await profileService.updateProfile(formData);
    },
    onSuccess: (data) => {
      toast.success("Profile updated successfully");
      
      // Update cache with new data
      queryClient.setQueryData(["userProfile"], (oldData: any) => {
        return { ...oldData, data: data.data };
      });
    },
    onError: (error) => {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  });
  
  const resetProfileMutation = useMutation({
    mutationFn: async () => {
      return await profileService.resetProfile();
    },
    onSuccess: (data) => {
      toast.success("Profile reset successfully");
      
      // Update local state with the reset values
      if (data.data) {
        setPreferences(data.data.preferences || preferences);
        setContactInfo(data.data.contact_info || contactInfo);
      }
    },
    onError: (error) => {
      console.error("Error resetting profile:", error);
      toast.error("Failed to reset profile settings");
    }
  });
  
  const handlePreferenceChange = (field: string, value: any) => {
    setPreferences((prev) => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleContactInfoChange = (field: string, value: string) => {
    setContactInfo((prev) => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSaveProfile = () => {
    updateProfileMutation.mutate({
      preferences,
      contact_info: contactInfo
    });
  };
  
  const handleResetProfile = () => {
    if (window.confirm("Are you sure you want to reset your profile to default settings? This action cannot be undone.")) {
      resetProfileMutation.mutate();
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your profile settings...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <Alert variant="destructive" className="my-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load profile settings. Please try again later.
        </AlertDescription>
        <Button variant="outline" className="mt-4" onClick={() => queryClient.invalidateQueries({ queryKey: ["userProfile"] })}>
          Retry
        </Button>
      </Alert>
    );
  }
  
  // Safely determine profile status
  const profileStatus = {
    is_new: profileData?.profile_status?.is_new || false,
    onboarding_completed: profileData?.profile_status?.onboarding_completed || 
                        (profileData?.data?.onboarding_completed || false),
    preferences_set: profileData?.profile_status?.preferences_set || 
                   (Object.keys(profileData?.data?.preferences || {}).length > 0),
    contact_info_set: profileData?.profile_status?.contact_info_set ||
                    (Object.keys(profileData?.data?.contact_info || {}).length > 0)
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your profile preferences and contact information
        </p>
      </div>
      
      {profileStatus.is_new && (
        <Alert className="my-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>New Profile</AlertTitle>
          <AlertDescription>
            Welcome! Please take a moment to set up your profile preferences.
          </AlertDescription>
        </Alert>
      )}
      
      <Tabs defaultValue="preferences" className="space-y-4">
        <TabsList>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="contact">Contact Information</TabsTrigger>
        </TabsList>
        
        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>
                Customize your application experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select
                    value={preferences.theme}
                    onValueChange={(value) => handlePreferenceChange("theme", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={preferences.language}
                    onValueChange={(value) => handlePreferenceChange("language", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input 
                    id="timezone"
                    value={preferences.timezone}
                    onChange={(e) => handlePreferenceChange("timezone", e.target.value)} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="date_format">Date Format</Label>
                  <Select
                    value={preferences.date_format}
                    onValueChange={(value) => handlePreferenceChange("date_format", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select date format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="time_format">Time Format</Label>
                  <Select
                    value={preferences.time_format}
                    onValueChange={(value) => handlePreferenceChange("time_format", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select time format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                      <SelectItem value="24h">24-hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={preferences.currency}
                    onValueChange={(value) => handlePreferenceChange("currency", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="CAD">CAD ($)</SelectItem>
                      <SelectItem value="AUD">AUD ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="notifications"
                  checked={preferences.notifications_enabled}
                  onCheckedChange={(checked) => 
                    handlePreferenceChange("notifications_enabled", checked)
                  }
                />
                <Label htmlFor="notifications">Enable Notifications</Label>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleResetProfile}>
                Reset
              </Button>
              <Button onClick={handleSaveProfile}>Save</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                Manage your contact details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone"
                    value={contactInfo.phone || ""}
                    onChange={(e) => handleContactInfoChange("phone", e.target.value)} 
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input 
                    id="address"
                    value={contactInfo.address || ""}
                    onChange={(e) => handleContactInfoChange("address", e.target.value)} 
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address2">Address Line 2</Label>
                  <Input 
                    id="address2"
                    value={contactInfo.address2 || ""}
                    onChange={(e) => handleContactInfoChange("address2", e.target.value)} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input 
                    id="city"
                    value={contactInfo.city || ""}
                    onChange={(e) => handleContactInfoChange("city", e.target.value)} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="state">State/Province</Label>
                  <Input 
                    id="state"
                    value={contactInfo.state || ""}
                    onChange={(e) => handleContactInfoChange("state", e.target.value)} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="postal_code">Postal Code</Label>
                  <Input 
                    id="postal_code"
                    value={contactInfo.postal_code || ""}
                    onChange={(e) => handleContactInfoChange("postal_code", e.target.value)} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input 
                    id="country"
                    value={contactInfo.country || ""}
                    onChange={(e) => handleContactInfoChange("country", e.target.value)} 
                  />
                </div>
                
                <Separator className="md:col-span-2 my-2" />
                
                <div className="space-y-2">
                  <Label htmlFor="emergency_contact">Emergency Contact Name</Label>
                  <Input 
                    id="emergency_contact"
                    value={contactInfo.emergency_contact || ""}
                    onChange={(e) => handleContactInfoChange("emergency_contact", e.target.value)} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="emergency_phone">Emergency Contact Phone</Label>
                  <Input 
                    id="emergency_phone"
                    value={contactInfo.emergency_phone || ""}
                    onChange={(e) => handleContactInfoChange("emergency_phone", e.target.value)} 
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleResetProfile}>
                Reset
              </Button>
              <Button onClick={handleSaveProfile}>Save</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
