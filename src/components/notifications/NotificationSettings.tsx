
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { NotificationSettings as NotificationSettingsType } from "@/types/api-responses";

export function NotificationSettings() {
  const { settings, updateSettings } = useNotifications();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localSettings, setLocalSettings] = useState<NotificationSettingsType>({
    email_notifications: settings.email_notifications || false,
    new_booking_notifications: settings.new_booking_notifications || false,
    modified_booking_notifications: settings.modified_booking_notifications || false,
    cancelled_booking_notifications: settings.cancelled_booking_notifications || false,
    conflict_notifications: settings.conflict_notifications || false,
    sync_failure_notifications: settings.sync_failure_notifications || false
  });

  const handleToggle = (setting: keyof NotificationSettingsType) => {
    setLocalSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await updateSettings(localSettings);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 py-4">
      <div className="space-y-4">
        {/* Email Notifications Master Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="email-notifications" className="font-medium">Email Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive notifications via email
            </p>
          </div>
          <Switch
            id="email-notifications"
            checked={localSettings.email_notifications}
            onCheckedChange={() => handleToggle("email_notifications")}
          />
        </div>

        <div className="border-t pt-4 space-y-4">
          <p className="text-sm font-medium">Notification Types</p>
          
          {/* New Booking Notifications */}
          <div className="flex items-center justify-between">
            <Label htmlFor="new-booking" className="text-sm">
              New Bookings
            </Label>
            <Switch 
              id="new-booking"
              checked={localSettings.new_booking_notifications}
              onCheckedChange={() => handleToggle("new_booking_notifications")}
              disabled={!localSettings.email_notifications}
            />
          </div>
          
          {/* Modified Booking Notifications */}
          <div className="flex items-center justify-between">
            <Label htmlFor="modified-booking" className="text-sm">
              Modified Bookings
            </Label>
            <Switch 
              id="modified-booking"
              checked={localSettings.modified_booking_notifications}
              onCheckedChange={() => handleToggle("modified_booking_notifications")}
              disabled={!localSettings.email_notifications}
            />
          </div>
          
          {/* Cancelled Booking Notifications */}
          <div className="flex items-center justify-between">
            <Label htmlFor="cancelled-booking" className="text-sm">
              Cancelled Bookings
            </Label>
            <Switch 
              id="cancelled-booking"
              checked={localSettings.cancelled_booking_notifications}
              onCheckedChange={() => handleToggle("cancelled_booking_notifications")}
              disabled={!localSettings.email_notifications}
            />
          </div>
          
          {/* Conflict Notifications */}
          <div className="flex items-center justify-between">
            <Label htmlFor="conflict" className="text-sm">
              Booking Conflicts
            </Label>
            <Switch 
              id="conflict"
              checked={localSettings.conflict_notifications}
              onCheckedChange={() => handleToggle("conflict_notifications")}
              disabled={!localSettings.email_notifications}
            />
          </div>
          
          {/* Sync Failure Notifications */}
          <div className="flex items-center justify-between">
            <Label htmlFor="sync-failure" className="text-sm">
              Sync Failures
            </Label>
            <Switch 
              id="sync-failure"
              checked={localSettings.sync_failure_notifications}
              onCheckedChange={() => handleToggle("sync_failure_notifications")}
              disabled={!localSettings.email_notifications}
            />
          </div>
        </div>
      </div>

      <Button 
        onClick={handleSubmit} 
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          "Save Settings"
        )}
      </Button>
    </div>
  );
}
