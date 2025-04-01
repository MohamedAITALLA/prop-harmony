
import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useNotifications, NotificationSettings as NotificationSettingsType } from '@/hooks/useNotifications';

interface NotificationSettingsForm {
  email_notifications: boolean;
  new_booking_notifications: boolean;
  modified_booking_notifications: boolean;
  cancelled_booking_notifications: boolean;
  conflict_notifications: boolean;
  sync_failure_notifications: boolean;
}

export function NotificationSettings() {
  const { notificationSettings, updateNotificationSettings } = useNotifications();
  
  const form = useForm<NotificationSettingsForm>({
    defaultValues: {
      email_notifications: notificationSettings.email_notifications !== false,
      new_booking_notifications: notificationSettings.new_booking_notifications !== false,
      modified_booking_notifications: notificationSettings.modified_booking_notifications !== false,
      cancelled_booking_notifications: notificationSettings.cancelled_booking_notifications !== false,
      conflict_notifications: notificationSettings.conflict_notifications !== false,
      sync_failure_notifications: notificationSettings.sync_failure_notifications !== false,
    }
  });

  const onSubmit = (data: NotificationSettingsForm) => {
    updateNotificationSettings(data as NotificationSettingsType);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email_notifications"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Email Notifications</FormLabel>
                <FormDescription>
                  Receive notifications via email
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="new_booking_notifications"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>New Bookings</FormLabel>
                <FormDescription>
                  Get notified when new bookings are created
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="modified_booking_notifications"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Modified Bookings</FormLabel>
                <FormDescription>
                  Get notified when existing bookings are modified
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="cancelled_booking_notifications"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Cancelled Bookings</FormLabel>
                <FormDescription>
                  Get notified when bookings are cancelled
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="conflict_notifications"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Booking Conflicts</FormLabel>
                <FormDescription>
                  Get notified when booking conflicts are detected
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="sync_failure_notifications"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Sync Failures</FormLabel>
                <FormDescription>
                  Get notified when calendar synchronization fails
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        
        <div className="flex justify-end">
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Form>
  );
}
