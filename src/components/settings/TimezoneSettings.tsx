
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UserPreferences } from "@/types/api-responses";
import { timezones } from "@/lib/timezones";

interface TimezoneSettingsProps {
  preferences: UserPreferences;
  onChange: (preferences: UserPreferences) => void;
  onSave: () => void;
}

export function TimezoneSettings({ preferences, onChange, onSave }: TimezoneSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Time & Regional Settings</CardTitle>
        <CardDescription>
          Customize how dates, times and currencies are displayed
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Select 
              value={preferences.timezone} 
              onValueChange={(timezone) => onChange({ ...preferences, timezone })}
            >
              <SelectTrigger id="timezone">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                {timezones.map((tz) => (
                  <SelectItem key={tz.value} value={tz.value}>
                    {tz.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Date Format</Label>
            <RadioGroup 
              value={preferences.date_format}
              onValueChange={(value: "MM/DD/YYYY" | "DD/MM/YYYY" | "YYYY-MM-DD") => 
                onChange({ ...preferences, date_format: value })
              }
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="MM/DD/YYYY" id="mm-dd-yyyy" />
                <Label htmlFor="mm-dd-yyyy">MM/DD/YYYY (US)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="DD/MM/YYYY" id="dd-mm-yyyy" />
                <Label htmlFor="dd-mm-yyyy">DD/MM/YYYY (Europe)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="YYYY-MM-DD" id="yyyy-mm-dd" />
                <Label htmlFor="yyyy-mm-dd">YYYY-MM-DD (ISO)</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label>Time Format</Label>
            <RadioGroup 
              value={preferences.time_format}
              onValueChange={(value: "12h" | "24h") => 
                onChange({ ...preferences, time_format: value })
              }
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="12h" id="12h" />
                <Label htmlFor="12h">12-hour (2:30 PM)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="24h" id="24h" />
                <Label htmlFor="24h">24-hour (14:30)</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label>Currency</Label>
            <RadioGroup 
              value={preferences.currency}
              onValueChange={(value: "USD" | "EUR" | "GBP" | "CAD" | "AUD") => 
                onChange({ ...preferences, currency: value })
              }
              className="grid grid-cols-2 gap-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="USD" id="usd" />
                <Label htmlFor="usd">USD ($)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="EUR" id="eur" />
                <Label htmlFor="eur">EUR (€)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="GBP" id="gbp" />
                <Label htmlFor="gbp">GBP (£)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="CAD" id="cad" />
                <Label htmlFor="cad">CAD ($)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="AUD" id="aud" />
                <Label htmlFor="aud">AUD ($)</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onSave} className="ml-auto">Save Settings</Button>
      </CardFooter>
    </Card>
  );
}
