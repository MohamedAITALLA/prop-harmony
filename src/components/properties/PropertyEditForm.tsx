
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { House } from "lucide-react";
import { Separator } from "@/components/ui/separator";

import { BasicInfoSection } from "./form/BasicInfoSection";
import { AddressSection } from "./form/AddressSection";
import { CapacitySection } from "./form/CapacitySection";
import { AmenitiesSection } from "./form/AmenitiesSection";
import { PoliciesSection } from "./form/PoliciesSection";
import { ImagesSection } from "./form/ImagesSection";
import { PropertyFormActions } from "./form/PropertyFormActions";
import { formSchema, FormValues } from "./form/PropertyFormSchema";
import { useLocationSelector } from "./form/useLocationSelector";
import { PropertyFormError } from "./form/PropertyFormError";
import { Property } from "@/types/api-responses";
import { handleEditFormSubmission } from "./form/PropertyEditSubmission";
import { toast } from "sonner";

interface PropertyEditFormProps {
  propertyId: string;
  initialData: Property;
}

export function PropertyEditForm({ propertyId, initialData }: PropertyEditFormProps) {
  const navigate = useNavigate();
  
  // Transform API data to form data structure
  const transformedInitialData: FormValues = {
    name: initialData.name,
    property_type: initialData.property_type,
    description: initialData.description || "",
    street: initialData.address.street || "",
    city: initialData.address.city || "",
    stateProvince: initialData.address.stateProvince || "",
    postalCode: initialData.address.postalCode || "",
    country: initialData.address.country || "",
    latitude: initialData.address.coordinates?.latitude || 0,
    longitude: initialData.address.coordinates?.longitude || 0,
    bedrooms: initialData.bedrooms || 0,
    bathrooms: initialData.bathrooms || 0,
    beds: initialData.beds || 0,
    accommodates: initialData.accommodates || 1,
    images: (initialData.images || []).map(url => ({ value: url })),
    wifi: initialData.amenities?.wifi || false,
    kitchen: initialData.amenities?.kitchen || false,
    ac: initialData.amenities?.ac || false,
    heating: initialData.amenities?.heating || false,
    tv: initialData.amenities?.tv || false,
    washer: initialData.amenities?.washer || false,
    dryer: initialData.amenities?.dryer || false,
    parking: initialData.amenities?.parking || false,
    elevator: initialData.amenities?.elevator || false,
    pool: initialData.amenities?.pool || false,
    checkInTime: initialData.policies?.check_in_time || "15:00",
    checkOutTime: initialData.policies?.check_out_time || "11:00",
    minimumStay: initialData.policies?.minimum_stay || 1,
    petsAllowed: initialData.policies?.pets_allowed || false,
    smokingAllowed: initialData.policies?.smoking_allowed || false,
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: transformedInitialData,
    mode: "onChange",
  });

  const { selectedCountry, availableCities, handleCountryChange } = useLocationSelector(form);

  const onSubmit = async (values: FormValues) => {
    try {
      await handleEditFormSubmission(values, propertyId, navigate);
    } catch (error) {
      console.error("Error updating property:", error);
      toast.error("Failed to update property. Please try again.");
    }
  };

  const handleCancel = () => {
    navigate(`/properties/${propertyId}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <House className="h-5 w-5" /> Edit Property
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

            {/* Form Actions */}
            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                className="px-4 py-2 border rounded-md hover:bg-gray-100"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Update Property
              </button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
