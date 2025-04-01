
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface NotificationSettingsProps {
  settings: {
    email_notifications: boolean;
    new_booking_notifications: boolean;
    modified_booking_notifications: boolean;
    cancelled_booking_notifications: boolean;
    conflict_notifications: boolean;
    sync_failure_notifications: boolean;
  };
  onChange: (settings: any) => void;
  onSave: () => void;
}

export function NotificationSettings({
  settings,
  onChange,
  onSave
}: NotificationSettingsProps) {
  const handleToggle = (key: string, value: boolean) => {
    onChange({ ...settings, [key]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>
          Choose what notifications you receive
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="email-notifications">Email Notifications</Label>
            <p className="text-xs text-muted-foreground">
              Receive notifications via email
            </p>
          </div>
          <Switch
            id="email-notifications"
            checked={settings.email_notifications}
            onCheckedChange={(checked) => handleToggle('email_notifications', checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="new-booking">New Booking Alerts</Label>
            <p className="text-xs text-muted-foreground">
              Be notified when new bookings are created
            </p>
          </div>
          <Switch
            id="new-booking"
            checked={settings.new_booking_notifications}
            onCheckedChange={(checked) => handleToggle('new_booking_notifications', checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="modified-booking">Modified Booking Alerts</Label>
            <p className="text-xs text-muted-foreground">
              Be notified when bookings are modified
            </p>
          </div>
          <Switch
            id="modified-booking"
            checked={settings.modified_booking_notifications}
            onCheckedChange={(checked) => handleToggle('modified_booking_notifications', checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="cancelled-booking">Cancelled Booking Alerts</Label>
            <p className="text-xs text-muted-foreground">
              Be notified when bookings are cancelled
            </p>
          </div>
          <Switch
            id="cancelled-booking"
            checked={settings.cancelled_booking_notifications}
            onCheckedChange={(checked) => handleToggle('cancelled_booking_notifications', checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="calendar-conflicts">Calendar Conflict Alerts</Label>
            <p className="text-xs text-muted-foreground">
              Be notified about calendar conflicts
            </p>
          </div>
          <Switch
            id="calendar-conflicts"
            checked={settings.conflict_notifications}
            onCheckedChange={(checked) => handleToggle('conflict_notifications', checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="sync-failures">Sync Failure Alerts</Label>
            <p className="text-xs text-muted-foreground">
              Be notified when calendar syncs fail
            </p>
          </div>
          <Switch
            id="sync-failures"
            checked={settings.sync_failure_notifications}
            onCheckedChange={(checked) => handleToggle('sync_failure_notifications', checked)}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onSave} className="ml-auto">
          Save Notification Settings
        </Button>
      </CardFooter>
    </Card>
  );
}
