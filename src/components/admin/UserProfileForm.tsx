
import React from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { adminProfileService } from '@/services/api-service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { UserProfile } from '@/types/api-responses';
import { getMongoId } from '@/lib/mongo-helpers';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserProfileFormProps {
  profile: UserProfile;
  onSuccess?: () => void;
}

const profileSchema = z.object({
  language: z.enum(["en", "es", "fr", "de"]),
  timezone: z.string(),
  theme: z.enum(["light", "dark", "system"]),
  date_format: z.enum(["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"]),
  time_format: z.enum(["12h", "24h"]),
  currency: z.enum(["USD", "EUR", "GBP", "CAD", "AUD"]),
  notifications_enabled: z.boolean(),
  onboarding_completed: z.boolean(),
});

const UserProfileForm = ({ profile, onSuccess }: UserProfileFormProps) => {
  const queryClient = useQueryClient();
  
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      language: profile.preferences.language || "en",
      timezone: profile.preferences.timezone || "UTC",
      theme: profile.preferences.theme || "system",
      date_format: profile.preferences.date_format || "MM/DD/YYYY",
      time_format: profile.preferences.time_format || "12h",
      currency: profile.preferences.currency || "USD",
      notifications_enabled: profile.preferences.notifications_enabled !== false,
      onboarding_completed: profile.onboarding_completed,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof profileSchema>) => {
      const { onboarding_completed, ...preferences } = data;
      return adminProfileService.updateUserProfile(profile.user_id, {
        preferences,
        onboarding_completed,
      });
    },
    onSuccess: (data) => {
      const successMessage = data.message || 'User profile updated successfully';
      toast.success(successMessage);
      
      // Updated fields will be available in response data if supported by the API
      if (data.data?.updated_fields && data.data.updated_fields.length > 0) {
        console.log('Updated profile fields:', data.data.updated_fields.join(', '));
      }
      
      queryClient.invalidateQueries({ queryKey: ['userProfiles'] });
      if (onSuccess) onSuccess();
    },
  });

  const onSubmit = (data: z.infer<typeof profileSchema>) => {
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Language</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="timezone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Timezone</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="theme"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Theme</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="date_format"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date Format</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
          control={form.control}
          name="time_format"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time Format</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
          control={form.control}
          name="currency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Currency</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                  <SelectItem value="CAD">CAD ($)</SelectItem>
                  <SelectItem value="AUD">AUD ($)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="notifications_enabled"
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
              </div>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="onboarding_completed"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Onboarding Completed</FormLabel>
              </div>
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Saving..." : "Update Profile"}
        </Button>
      </form>
    </Form>
  );
};

export default UserProfileForm;
