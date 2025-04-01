
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { UserPreferences } from "@/types/api-responses";

type ContactInfo = {
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  emergency_contact: {
    name: string;
    phone: string;
    relationship: string;
  };
};

interface UserProfileFormProps {
  preferences: UserPreferences;
  contactInfo: ContactInfo;
  onPreferencesChange: (prefs: UserPreferences) => void;
  onContactInfoChange: (info: ContactInfo) => void;
  onSave: () => void;
}

export function UserProfileForm({
  preferences,
  contactInfo,
  onPreferencesChange,
  onContactInfoChange,
  onSave
}: UserProfileFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Profile</CardTitle>
        <CardDescription>
          Update your personal information and preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Contact Information</h3>
          <Separator className="mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={contactInfo.phone}
                onChange={(e) => onContactInfoChange({
                  ...contactInfo,
                  phone: e.target.value
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={contactInfo.address}
                onChange={(e) => onContactInfoChange({
                  ...contactInfo,
                  address: e.target.value
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={contactInfo.city}
                onChange={(e) => onContactInfoChange({
                  ...contactInfo,
                  city: e.target.value
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State/Province</Label>
              <Input
                id="state"
                value={contactInfo.state}
                onChange={(e) => onContactInfoChange({
                  ...contactInfo,
                  state: e.target.value
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={contactInfo.country}
                onChange={(e) => onContactInfoChange({
                  ...contactInfo,
                  country: e.target.value
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                value={contactInfo.postalCode}
                onChange={(e) => onContactInfoChange({
                  ...contactInfo,
                  postalCode: e.target.value
                })}
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Emergency Contact</h3>
          <Separator className="mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="emergency_name">Name</Label>
              <Input
                id="emergency_name"
                value={contactInfo.emergency_contact.name}
                onChange={(e) => onContactInfoChange({
                  ...contactInfo,
                  emergency_contact: {
                    ...contactInfo.emergency_contact,
                    name: e.target.value
                  }
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergency_phone">Phone</Label>
              <Input
                id="emergency_phone"
                value={contactInfo.emergency_contact.phone}
                onChange={(e) => onContactInfoChange({
                  ...contactInfo,
                  emergency_contact: {
                    ...contactInfo.emergency_contact,
                    phone: e.target.value
                  }
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergency_relationship">Relationship</Label>
              <Input
                id="emergency_relationship"
                value={contactInfo.emergency_contact.relationship}
                onChange={(e) => onContactInfoChange({
                  ...contactInfo,
                  emergency_contact: {
                    ...contactInfo.emergency_contact,
                    relationship: e.target.value
                  }
                })}
              />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onSave} className="ml-auto">Save Profile</Button>
      </CardFooter>
    </Card>
  );
}
