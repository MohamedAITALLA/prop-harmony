import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileService } from "@/services/api-service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { UserPreferences } from "@/types/api-responses";
import { Loader2, Check, AlertCircle } from "lucide-react";

interface ProfileSettingsProps {
  // Define any props here
}

export default function ProfileSettings() {
  const queryClient = useQueryClient();
  
  // State for form fields
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: "light",
    language: "en",
    timezone: "UTC",
    date_format: "MM/DD/YYYY",
    time_format: "12h",
    currency: "USD",
    notifications_enabled: true
  });
  
  const [contactInfo, setContactInfo] = useState<Record<string, string>>({
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postal_code: ""
  });
  
  const [passwordUpdate, setPasswordUpdate] = useState({
    current: "",
    new: "",
    confirm: ""
  });
  
  // Fetch profile data
  const { data: profileData, isLoading, isError } = useQuery({
    queryKey: ['userProfile'],
    queryFn: profileService.getProfile,
  });
  
  // Populate state when profile data is available
  React.useEffect(() => {
    if (profileData) {
      setPreferences(profileData.data.preferences);
      setContactInfo(profileData.data.contact_info);
    }
  }, [profileData]);
  
  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: profileService.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      toast.success("Profile updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update profile");
      console.error("Profile update error:", error);
    }
  });
  
  // Reset profile mutation
  const resetProfileMutation = useMutation({
    mutationFn: profileService.resetProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      toast.success("Profile preferences reset to default values");
    },
    onError: (error) => {
      toast.error("Failed to reset profile preferences");
      console.error("Profile reset error:", error);
    }
  });
  
  // Handle form submissions
  const handlePreferencesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate({ preferences });
  };
  
  const handleContactInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate({ contact_info: contactInfo });
  };
  
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordUpdate.new !== passwordUpdate.confirm) {
      toast.error("New passwords do not match");
      return;
    }
    
    updateProfileMutation.mutate({ 
      password_update: { 
        current: passwordUpdate.current, 
        new: passwordUpdate.new 
      } 
    });
    
    // Clear password fields after submission
    setPasswordUpdate({ current: "", new: "", confirm: "" });
  };
  
  const handleResetProfile = () => {
    if (window.confirm("Are you sure you want to reset your profile preferences to default values? This cannot be undone.")) {
      resetProfileMutation.mutate();
    }
  };
  
  // Handle onboarding completion update
  const handleCompleteOnboarding = () => {
    updateProfileMutation.mutate({ onboarding_completed: true });
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading profile settings...
      </div>
    );
  }
  
  if (isError || !profileData) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load profile settings. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>
            Manage your profile settings and preferences.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="preferences" className="space-y-4">
            <TabsList>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="contact">Contact Info</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>
            
            <TabsContent value="preferences">
              <form onSubmit={handlePreferencesSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="theme">Theme</Label>
                    <Select 
                      value={preferences.theme} 
                      onValueChange={(value) => setPreferences({ ...preferences, theme: value as "light" | "dark" | "system" })}
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
                  
                  <div>
                    <Label htmlFor="language">Language</Label>
                    <Select 
                      value={preferences.language} 
                      onValueChange={(value) => setPreferences({ ...preferences, language: value as "en" | "es" | "fr" | "de" })}
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
                  
                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <Input 
                      type="text" 
                      id="timezone" 
                      value={preferences.timezone} 
                      onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })} 
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="date_format">Date Format</Label>
                    <Select 
                      value={preferences.date_format} 
                      onValueChange={(value) => setPreferences({ ...preferences, date_format: value as "MM/DD/YYYY" | "DD/MM/YYYY" | "YYYY-MM-DD" })}
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
                  
                  <div>
                    <Label htmlFor="time_format">Time Format</Label>
                    <Select 
                      value={preferences.time_format} 
                      onValueChange={(value) => setPreferences({ ...preferences, time_format: value as "12h" | "24h" })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select time format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12h">12h</SelectItem>
                        <SelectItem value="24h">24h</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <Select 
                      value={preferences.currency} 
                      onValueChange={(value) => setPreferences({ ...preferences, currency: value as "USD" | "EUR" | "GBP" | "CAD" | "AUD" })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                        <SelectItem value="CAD">CAD</SelectItem>
                        <SelectItem value="AUD">AUD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Label htmlFor="notifications_enabled">Notifications Enabled</Label>
                  <Switch 
                    id="notifications_enabled" 
                    checked={preferences.notifications_enabled} 
                    onCheckedChange={(checked) => setPreferences({ ...preferences, notifications_enabled: checked })} 
                  />
                </div>
                
                <CardFooter>
                  <Button type="submit" disabled={updateProfileMutation.isPending}>
                    {updateProfileMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Update Preferences
                  </Button>
                  <Button 
                    type="button" 
                    variant="secondary" 
                    onClick={handleResetProfile}
                    disabled={resetProfileMutation.isPending}
                    className="ml-2"
                  >
                    {resetProfileMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Reset to Default
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="contact">
              <form onSubmit={handleContactInfoSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input 
                      type="text" 
                      id="phone" 
                      value={contactInfo.phone || ""} 
                      onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })} 
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input 
                      type="text" 
                      id="address" 
                      value={contactInfo.address || ""} 
                      onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })} 
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input 
                      type="text" 
                      id="city" 
                      value={contactInfo.city || ""} 
                      onChange={(e) => setContactInfo({ ...contactInfo, city: e.target.value })} 
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input 
                      type="text" 
                      id="state" 
                      value={contactInfo.state || ""} 
                      onChange={(e) => setContactInfo({ ...contactInfo, state: e.target.value })} 
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input 
                      type="text" 
                      id="country" 
                      value={contactInfo.country || ""} 
                      onChange={(e) => setContactInfo({ ...contactInfo, country: e.target.value })} 
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="postal_code">Postal Code</Label>
                    <Input 
                      type="text" 
                      id="postal_code" 
                      value={contactInfo.postal_code || ""} 
                      onChange={(e) => setContactInfo({ ...contactInfo, postal_code: e.target.value })} 
                    />
                  </div>
                </div>
                
                <CardFooter>
                  <Button type="submit" disabled={updateProfileMutation.isPending}>
                    {updateProfileMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Update Contact Info
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="password">
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="current_password">Current Password</Label>
                  <Input 
                    type="password" 
                    id="current_password" 
                    value={passwordUpdate.current} 
                    onChange={(e) => setPasswordUpdate({ ...passwordUpdate, current: e.target.value })} 
                  />
                </div>
                
                <div>
                  <Label htmlFor="new_password">New Password</Label>
                  <Input 
                    type="password" 
                    id="new_password" 
                    value={passwordUpdate.new} 
                    onChange={(e) => setPasswordUpdate({ ...passwordUpdate, new: e.target.value })} 
                  />
                </div>
                
                <div>
                  <Label htmlFor="confirm_password">Confirm New Password</Label>
                  <Input 
                    type="password" 
                    id="confirm_password" 
                    value={passwordUpdate.confirm} 
                    onChange={(e) => setPasswordUpdate({ ...passwordUpdate, confirm: e.target.value })} 
                  />
                </div>
                
                <CardFooter>
                  <Button type="submit" disabled={updateProfileMutation.isPending}>
                    {updateProfileMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Update Password
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Onboarding Completion */}
      {!profileData.data.onboarding_completed && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Complete Onboarding</CardTitle>
            <CardDescription>
              Finish setting up your profile to unlock all features.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Click the button below to mark your onboarding as complete.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={handleCompleteOnboarding} disabled={updateProfileMutation.isPending}>
              {updateProfileMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Complete Onboarding
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
