
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { NotificationSettings as NotificationSettingsType } from "@/types/api-responses";

interface NotificationSettingsProps {
  settings: {
    email_notifications: boolean;
    new_booking_notifications: boolean;
    modified_booking_notifications: boolean;
    cancelled_booking_notifications: boolean;
    conflict_notifications: boolean;
    sync_failure_notifications: boolean;
  };
  onChange: (settings: NotificationSettingsType) => void;
  onSave: () => void;
}

export function NotificationSettings({ settings, onChange, onSave }: NotificationSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>
          Control when and how you receive notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="email_notifications" className="flex flex-col">
              <span>Email Notifications</span>
              <span className="text-sm text-muted-foreground">Receive important notifications via email</span>
            </Label>
            <Switch
              id="email_notifications"
              checked={settings.email_notifications}
              onCheckedChange={(checked) => onChange({ ...settings, email_notifications: checked })}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="new_booking_notifications" className="flex flex-col">
              <span>New Bookings</span>
              <span className="text-sm text-muted-foreground">Get notified when a new booking is made</span>
            </Label>
            <Switch
              id="new_booking_notifications"
              checked={settings.new_booking_notifications}
              onCheckedChange={(checked) => onChange({ ...settings, new_booking_notifications: checked })}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="modified_booking_notifications" className="flex flex-col">
              <span>Modified Bookings</span>
              <span className="text-sm text-muted-foreground">Get notified when a booking is modified</span>
            </Label>
            <Switch
              id="modified_booking_notifications"
              checked={settings.modified_booking_notifications}
              onCheckedChange={(checked) => onChange({ ...settings, modified_booking_notifications: checked })}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="cancelled_booking_notifications" className="flex flex-col">
              <span>Cancelled Bookings</span>
              <span className="text-sm text-muted-foreground">Get notified when a booking is cancelled</span>
            </Label>
            <Switch
              id="cancelled_booking_notifications"
              checked={settings.cancelled_booking_notifications}
              onCheckedChange={(checked) => onChange({ ...settings, cancelled_booking_notifications: checked })}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="conflict_notifications" className="flex flex-col">
              <span>Calendar Conflicts</span>
              <span className="text-sm text-muted-foreground">Get notified when calendar conflicts are detected</span>
            </Label>
            <Switch
              id="conflict_notifications"
              checked={settings.conflict_notifications}
              onCheckedChange={(checked) => onChange({ ...settings, conflict_notifications: checked })}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="sync_failure_notifications" className="flex flex-col">
              <span>Sync Failures</span>
              <span className="text-sm text-muted-foreground">Get notified when calendar syncing fails</span>
            </Label>
            <Switch
              id="sync_failure_notifications"
              checked={settings.sync_failure_notifications}
              onCheckedChange={(checked) => onChange({ ...settings, sync_failure_notifications: checked })}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onSave} className="ml-auto">Save Preferences</Button>
      </CardFooter>
    </Card>
  );
}
