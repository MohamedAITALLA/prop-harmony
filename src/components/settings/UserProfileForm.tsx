
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPreferences } from "@/types/api-responses";

interface ContactInfo {
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
}

interface UserProfileFormProps {
  preferences: UserPreferences;
  contactInfo: ContactInfo;
  onPreferencesChange: (preferences: UserPreferences) => void;
  onContactInfoChange: (contactInfo: ContactInfo) => void;
  onSave: () => void;
}

export function UserProfileForm({
  preferences,
  contactInfo,
  onPreferencesChange,
  onContactInfoChange,
  onSave
}: UserProfileFormProps) {
  const handlePreferenceChange = (field: keyof UserPreferences, value: any) => {
    onPreferencesChange({ ...preferences, [field]: value });
  };
  
  const handleContactInfoChange = (field: keyof Omit<ContactInfo, "emergency_contact">, value: string) => {
    onContactInfoChange({ ...contactInfo, [field]: value });
  };
  
  const handleEmergencyContactChange = (field: keyof ContactInfo["emergency_contact"], value: string) => {
    onContactInfoChange({
      ...contactInfo,
      emergency_contact: {
        ...contactInfo.emergency_contact,
        [field]: value
      }
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>
          Update your personal and contact information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={contactInfo.phone}
                  onChange={(e) => handleContactInfoChange("phone", e.target.value)}
                  placeholder="Enter your phone number"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="language">Preferred Language</Label>
                <Select
                  value={preferences.language}
                  onValueChange={(value) => handlePreferenceChange("language", value)}
                >
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={contactInfo.address}
                onChange={(e) => handleContactInfoChange("address", e.target.value)}
                placeholder="Enter your street address"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={contactInfo.city}
                  onChange={(e) => handleContactInfoChange("city", e.target.value)}
                  placeholder="City"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="state">State/Province</Label>
                <Input
                  id="state"
                  value={contactInfo.state}
                  onChange={(e) => handleContactInfoChange("state", e.target.value)}
                  placeholder="State or province"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="postal-code">Postal Code</Label>
                <Input
                  id="postal-code"
                  value={contactInfo.postalCode}
                  onChange={(e) => handleContactInfoChange("postalCode", e.target.value)}
                  placeholder="Postal code"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={contactInfo.country}
                  onChange={(e) => handleContactInfoChange("country", e.target.value)}
                  placeholder="Country"
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Emergency Contact</h3>
            
            <div className="space-y-2">
              <Label htmlFor="ec-name">Name</Label>
              <Input
                id="ec-name"
                value={contactInfo.emergency_contact.name}
                onChange={(e) => handleEmergencyContactChange("name", e.target.value)}
                placeholder="Emergency contact name"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ec-phone">Phone</Label>
                <Input
                  id="ec-phone"
                  value={contactInfo.emergency_contact.phone}
                  onChange={(e) => handleEmergencyContactChange("phone", e.target.value)}
                  placeholder="Emergency contact phone"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ec-relationship">Relationship</Label>
                <Input
                  id="ec-relationship"
                  value={contactInfo.emergency_contact.relationship}
                  onChange={(e) => handleEmergencyContactChange("relationship", e.target.value)}
                  placeholder="e.g. Spouse, Parent"
                />
              </div>
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
