
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { timezones } from "@/lib/timezones";
import { UserPreferences } from "@/types/api-responses";

interface TimezoneSettingsProps {
  preferences: UserPreferences;
  onChange: (preferences: UserPreferences) => void;
  onSave: () => void;
}

export function TimezoneSettings({ preferences, onChange, onSave }: TimezoneSettingsProps) {
  const handleTimezoneChange = (timezone: string) => {
    onChange({ ...preferences, timezone });
  };
  
  const handleDateFormatChange = (date_format: string) => {
    onChange({ ...preferences, date_format: date_format as "MM/DD/YYYY" | "DD/MM/YYYY" | "YYYY-MM-DD" });
  };
  
  const handleTimeFormatChange = (time_format: string) => {
    onChange({ ...preferences, time_format: time_format as "12h" | "24h" });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Time & Region Settings</CardTitle>
        <CardDescription>
          Configure your timezone, date format, and time format
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="timezone">Timezone</Label>
          <Select
            value={preferences.timezone}
            onValueChange={handleTimezoneChange}
          >
            <SelectTrigger id="timezone" className="w-full">
              <SelectValue placeholder="Select timezone" />
            </SelectTrigger>
            <SelectContent>
              {timezones.map((timezone) => (
                <SelectItem key={timezone.value} value={timezone.value}>
                  {timezone.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Date Format</Label>
          <RadioGroup
            value={preferences.date_format}
            onValueChange={handleDateFormatChange}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="MM/DD/YYYY" id="format-us" />
              <Label htmlFor="format-us">MM/DD/YYYY (US)</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="DD/MM/YYYY" id="format-eu" />
              <Label htmlFor="format-eu">DD/MM/YYYY (Europe)</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="YYYY-MM-DD" id="format-iso" />
              <Label htmlFor="format-iso">YYYY-MM-DD (ISO)</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-2">
          <Label>Time Format</Label>
          <RadioGroup
            value={preferences.time_format}
            onValueChange={handleTimeFormatChange}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="12h" id="time-12h" />
              <Label htmlFor="time-12h">12-hour (AM/PM)</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="24h" id="time-24h" />
              <Label htmlFor="time-24h">24-hour</Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onSave} className="ml-auto">Save Settings</Button>
      </CardFooter>
    </Card>
  );
}
