
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Link2, Clock, AlertCircle } from "lucide-react";
import { ICalConnection } from "@/types/api-responses";

interface ConnectionFormFieldsProps {
  connection: ICalConnection;
  onConnectionChange: (connection: ICalConnection) => void;
  errors: {ical_url?: string};
}

export function ConnectionFormFields({ 
  connection, 
  onConnectionChange, 
  errors 
}: ConnectionFormFieldsProps) {
  return (
    <div className="grid gap-4 py-2">
      <div className="grid gap-2">
        <Label htmlFor="edit-platform">
          <div className="flex items-center gap-1.5 mb-1">
            <Calendar className="h-3.5 w-3.5" />
            Platform Name
          </div>
        </Label>
        <Input
          id="edit-platform"
          value={connection.platform}
          onChange={(e) => onConnectionChange({ 
            ...connection, 
            platform: e.target.value
          })}
          placeholder="e.g. Airbnb, Booking.com"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Name of the platform or service providing this calendar
        </p>
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="edit-ical_url">
          <div className="flex items-center gap-1.5 mb-1">
            <Link2 className="h-3.5 w-3.5" />
            iCal URL
          </div>
        </Label>
        <Input
          id="edit-ical_url"
          value={connection.ical_url}
          onChange={(e) => onConnectionChange({ ...connection, ical_url: e.target.value })}
          placeholder="https://example.com/ical/calendar.ics"
          className={errors.ical_url ? "border-red-500" : ""}
        />
        {errors.ical_url && (
          <div className="text-red-500 text-xs flex items-center gap-1 mt-1">
            <AlertCircle className="h-3 w-3" /> {errors.ical_url}
          </div>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          Enter the full URL to your external calendar's iCal feed
        </p>
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="edit-sync_frequency">
          <div className="flex items-center gap-1.5 mb-1">
            <Clock className="h-3.5 w-3.5" />
            Sync Frequency
          </div>
        </Label>
        <Select
          value={String(connection.sync_frequency)}
          onValueChange={(value) => onConnectionChange({ ...connection, sync_frequency: parseInt(value) })}
        >
          <SelectTrigger id="edit-sync_frequency">
            <SelectValue placeholder="Select Frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="15">Every 15 hours</SelectItem>
            <SelectItem value="30">Every 30 hours</SelectItem>
            <SelectItem value="45">Every 45 hours</SelectItem>
            <SelectItem value="60">Every 60 hours</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground mt-1">
          How often should we check for updates from this calendar
        </p>
      </div>
    </div>
  );
}
