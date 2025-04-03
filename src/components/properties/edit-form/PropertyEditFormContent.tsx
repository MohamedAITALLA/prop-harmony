
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Separator } from "@/components/ui/separator";

import { BasicInfoSection } from "../form/BasicInfoSection";
import { AddressSection } from "../form/AddressSection";
import { CapacitySection } from "../form/CapacitySection";
import { AmenitiesSection } from "../form/AmenitiesSection";
import { PoliciesSection } from "../form/PoliciesSection";
import { ImagesSection } from "../form/ImagesSection";
import { FormValues } from "../form/PropertyFormSchema";

interface PropertyEditFormContentProps {
  form: UseFormReturn<FormValues>;
  selectedCountry: string;
  availableCities: string[];
  handleCountryChange: (value: string) => void;
}

export function PropertyEditFormContent({ 
  form, 
  selectedCountry, 
  availableCities, 
  handleCountryChange 
}: PropertyEditFormContentProps) {
  return (
    <div className="space-y-6">
      {/* Basic Information Section */}
      <BasicInfoSection form={form} />

      <Separator />

      {/* Address Information Section */}
      <AddressSection 
        form={form} 
        selectedCountry={selectedCountry} 
        availableCities={availableCities}
        handleCountryChange={handleCountryChange}
      />

      <Separator />

      {/* Capacity Information */}
      <CapacitySection form={form} />

      <Separator />

      {/* Amenities Section */}
      <AmenitiesSection form={form} />

      <Separator />

      {/* Policies Section */}
      <PoliciesSection form={form} />

      <Separator />

      {/* Images Section */}
      <ImagesSection form={form} />
    </div>
  );
}
