
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { RefreshCw, Save, User, Phone, MapPin, Settings, Lock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { profileService } from "@/services/api-service";
import { toast } from "sonner";
import { timezones } from "@/lib/timezones";

// Schema for contact information form
const contactSchema = z.object({
  contact_info: z.object({
    phone: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    postal_code: z.string().optional(),
  }),
});

// Schema for preferences form
const preferencesSchema = z.object({
  preferences: z.object({
    theme: z.enum(["light", "dark", "system"]),
    language: z.enum(["en", "es", "fr", "de"]),
    timezone: z.string(),
    date_format: z.enum(["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"]),
    time_format: z.enum(["12h", "24h"]),
    currency: z.enum(["USD", "EUR", "GBP", "CAD", "AUD"]),
    notifications_enabled: z.boolean(),
  }),
});

// Schema for security form
const securitySchema = z.object({
  current_password: z.string().min(8, "Password must be at least 8 characters"),
  new_password: z.string().min(8, "Password must be at least 8 characters"),
  confirm_password: z.string(),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Passwords do not match",
  path: ["confirm_password"],
});

const ProfileSettings = () => {
  const { user } = useAuth();
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  // Fetch user profile data
  const { data: profileData, isLoading: isProfileLoading } = useQuery({
    queryKey: ["user-profile"],
    queryFn: () => profileService.getProfile(),
  });

  // Contact form setup
  const contactForm = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      contact_info: {
        phone: "",
        address: "",
        city: "",
        state: "",
        country: "",
        postal_code: "",
      },
    },
  });

  // Preferences form setup
  const preferencesForm = useForm({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      preferences: {
        theme: "system",
        language: "en",
        timezone: "America/New_York",
        date_format: "MM/DD/YYYY",
        time_format: "12h",
        currency: "USD",
        notifications_enabled: true,
      },
    },
  });

  // Security form setup
  const securityForm = useForm({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  // Update profile mutations
  const contactMutation = useMutation({
    mutationFn: (data: any) => profileService.updateProfile(data),
    onSuccess: () => {
      toast.success("Contact information updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update contact information");
    },
  });

  const preferencesMutation = useMutation({
    mutationFn: (data: any) => profileService.updateProfile(data),
    onSuccess: () => {
      toast.success("Preferences updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update preferences");
    },
  });

  const securityMutation = useMutation({
    mutationFn: (data: any) => profileService.updateProfile({
      password: {
        current: data.current_password,
        new: data.new_password,
      },
    }),
    onSuccess: () => {
      toast.success("Password updated successfully");
      securityForm.reset();
    },
    onError: (error) => {
      toast.error("Failed to update password");
    },
  });

  const resetProfileMutation = useMutation({
    mutationFn: () => profileService.updateProfile({ reset_preferences: true }),
    onSuccess: () => {
      toast.success("Profile reset to default settings");
      // Refetch profile data
      window.location.reload();
    },
    onError: (error) => {
      toast.error("Failed to reset profile");
    },
  });

  // Update form values when profile data loads
  React.useEffect(() => {
    if (profileData?.data) {
      const { contact_info = {}, preferences = {} } = profileData.data;
      
      contactForm.reset({
        contact_info: {
          phone: contact_info.phone || "",
          address: contact_info.address || "",
          city: contact_info.city || "",
          state: contact_info.state || "",
          country: contact_info.country || "",
          postal_code: contact_info.postal_code || "",
        },
      });
      
      preferencesForm.reset({
        preferences: {
          theme: preferences.theme || "system",
          language: preferences.language || "en",
          timezone: preferences.timezone || "America/New_York",
          date_format: preferences.date_format || "MM/DD/YYYY",
          time_format: preferences.time_format || "12h",
          currency: preferences.currency || "USD",
          notifications_enabled: preferences.notifications_enabled !== false,
        },
      });
    }
  }, [profileData, contactForm, preferencesForm]);

  // Form submission handlers
  const onSubmitContact = (data: any) => {
    contactMutation.mutate(data);
  };

  const onSubmitPreferences = (data: any) => {
    preferencesMutation.mutate(data);
  };

  const onSubmitSecurity = (data: any) => {
    securityMutation.mutate(data);
  };

  const handleReset = () => {
    resetProfileMutation.mutate();
    setResetDialogOpen(false);
  };

  return (
    <div className="container max-w-4xl py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account settings and preferences</p>
        </div>
        <Button
          variant="outline"
          onClick={() => setResetDialogOpen(true)}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Reset to Defaults
        </Button>
      </div>

      {/* Personal Information Section */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center gap-2">
          <User className="h-5 w-5 text-muted-foreground" />
          <div>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Your basic account information</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="grid gap-3">
              <Label>First Name</Label>
              <Input value={user?.first_name || ""} disabled />
            </div>
            <div className="grid gap-3">
              <Label>Last Name</Label>
              <Input value={user?.last_name || ""} disabled />
            </div>
            <div className="grid gap-3 sm:col-span-2">
              <Label>Email Address</Label>
              <Input value={user?.email || ""} disabled />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information Section */}
      <Form {...contactForm}>
        <form onSubmit={contactForm.handleSubmit(onSubmitContact)}>
          <Card className="mb-6">
            <CardHeader className="flex flex-row items-center gap-2">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <div>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Your contact details</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <FormField
                    control={contactForm.control}
                    name="contact_info.phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+1 (555) 123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={contactForm.control}
                    name="contact_info.postal_code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal Code</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={contactForm.control}
                  name="contact_info.address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid gap-6 sm:grid-cols-3">
                  <FormField
                    control={contactForm.control}
                    name="contact_info.city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={contactForm.control}
                    name="contact_info.state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State/Province</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={contactForm.control}
                    name="contact_info.country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit" disabled={contactMutation.isPending || !contactForm.formState.isDirty}>
                {contactMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>

      {/* Preferences Section */}
      <Form {...preferencesForm}>
        <form onSubmit={preferencesForm.handleSubmit(onSubmitPreferences)}>
          <Card className="mb-6">
            <CardHeader className="flex flex-row items-center gap-2">
              <Settings className="h-5 w-5 text-muted-foreground" />
              <div>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>Customize your experience</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2">
                <FormField
                  control={preferencesForm.control}
                  name="preferences.theme"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Theme</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a theme" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="system">System Default</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={preferencesForm.control}
                  name="preferences.language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Language</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="fr">Français</SelectItem>
                          <SelectItem value="de">Deutsch</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={preferencesForm.control}
                  name="preferences.timezone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Timezone</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a timezone" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {timezones.map(tz => (
                            <SelectItem key={tz.value} value={tz.value}>{tz.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={preferencesForm.control}
                  name="preferences.date_format"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date Format</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select date format" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                          <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                          <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={preferencesForm.control}
                  name="preferences.time_format"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time Format</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select time format" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                          <SelectItem value="24h">24-hour</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={preferencesForm.control}
                  name="preferences.currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="USD">US Dollar ($)</SelectItem>
                          <SelectItem value="EUR">Euro (€)</SelectItem>
                          <SelectItem value="GBP">British Pound (£)</SelectItem>
                          <SelectItem value="CAD">Canadian Dollar (C$)</SelectItem>
                          <SelectItem value="AUD">Australian Dollar (A$)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={preferencesForm.control}
                  name="preferences.notifications_enabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Enable Notifications</FormLabel>
                        <FormDescription>
                          Show in-app notifications
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit" disabled={preferencesMutation.isPending || !preferencesForm.formState.isDirty}>
                {preferencesMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>

      {/* Security Section */}
      <Form {...securityForm}>
        <form onSubmit={securityForm.handleSubmit(onSubmitSecurity)}>
          <Card className="mb-6">
            <CardHeader className="flex flex-row items-center gap-2">
              <Lock className="h-5 w-5 text-muted-foreground" />
              <div>
                <CardTitle>Security</CardTitle>
                <CardDescription>Update your password</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <FormField
                  control={securityForm.control}
                  name="current_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid gap-6 sm:grid-cols-2">
                  <FormField
                    control={securityForm.control}
                    name="new_password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={securityForm.control}
                    name="confirm_password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit" disabled={securityMutation.isPending || !securityForm.formState.isDirty}>
                {securityMutation.isPending ? "Updating..." : "Update Password"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>

      {/* Reset Dialog */}
      <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset to Defaults</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reset all settings to default values? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReset}>Reset</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

// Simple label component for disabled inputs
const Label = ({ children }: { children: React.ReactNode }) => (
  <div className="text-sm font-medium">{children}</div>
);

export default ProfileSettings;
