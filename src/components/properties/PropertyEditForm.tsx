
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

import { BasicInfoSection } from "./form/BasicInfoSection";
import { AddressSection } from "./form/AddressSection";
import { CapacitySection } from "./form/CapacitySection";
import { AmenitiesSection } from "./form/AmenitiesSection";
import { PoliciesSection } from "./form/PoliciesSection";
import { ImagesSection } from "./form/ImagesSection";
import { PropertyEditActions } from "./form/PropertyEditActions";
import { formSchema, FormValues } from "./form/PropertyFormSchema";
import { handleEditFormSubmission } from "./form/PropertyEditSubmission";
import { useLocationSelector } from "./form/useLocationSelector";
import { usePropertyDetails } from "@/hooks/properties/usePropertyDetails";

interface PropertyEditFormProps {
  propertyId: string;
}

export function PropertyEditForm({ propertyId }: PropertyEditFormProps) {
  const navigate = useNavigate();
  const { property, propertyLoading, propertyError } = usePropertyDetails(propertyId);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      property_type: undefined,
      description: "",
      street: "",
      city: "",
      country: "",
      stateProvince: "",
      postalCode: "",
      latitude: undefined,
      longitude: undefined,
      bedrooms: 0,
      bathrooms: 0,
      beds: 0,
      accommodates: 1,
      images: [{ value: "" }],
      wifi: false,
      kitchen: false,
      ac: false,
      heating: false,
      tv: false,
      washer: false,
      dryer: false,
      parking: false,
      elevator: false,
      pool: false,
      checkInTime: "15:00",
      checkOutTime: "11:00",
      minimumStay: 1,
      petsAllowed: false,
      smokingAllowed: false,
    },
  });

  const { selectedCountry, availableCities, handleCountryChange } = useLocationSelector(form);
  
  // Populate form with property data once loaded
  useEffect(() => {
    if (property) {
      // Map API data to form values
      const formData: Partial<FormValues> = {
        name: property.name,
        property_type: property.property_type,
        description: property.description || "",
        street: property.address?.street || "",
        city: property.address?.city || "",
        country: property.address?.country || "",
        stateProvince: property.address?.stateProvince || "",
        postalCode: property.address?.postalCode || "",
        latitude: property.address?.coordinates?.latitude,
        longitude: property.address?.coordinates?.longitude,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        beds: property.beds || property.bedrooms,
        accommodates: property.accommodates,
        images: property.images?.map(url => ({ value: url })) || [{ value: "" }],
        checkInTime: property.policies?.check_in_time || "15:00",
        checkOutTime: property.policies?.check_out_time || "11:00",
        minimumStay: property.policies?.minimum_stay || 1,
        petsAllowed: property.policies?.pets_allowed || false,
        smokingAllowed: property.policies?.smoking_allowed || false,
      };
      
      // Handle amenities
      if (property.amenities) {
        formData.wifi = property.amenities.wifi || false;
        formData.kitchen = property.amenities.kitchen || false;
        formData.ac = property.amenities.ac || false;
        formData.heating = property.amenities.heating || false;
        formData.tv = property.amenities.tv || false;
        formData.washer = property.amenities.washer || false;
        formData.dryer = property.amenities.dryer || false;
        formData.parking = property.amenities.parking || false;
        formData.elevator = property.amenities.elevator || false;
        formData.pool = property.amenities.pool || false;
      }
      
      // Reset form with new values
      form.reset(formData);
      
      // Set country to trigger city options loading
      if (property.address?.country) {
        handleCountryChange(property.address.country);
      }
    }
  }, [property, form, handleCountryChange]);

  const onSubmit = async (values: FormValues) => {
    if (!propertyId) {
      toast.error("Property ID is missing");
      return;
    }
    
    await handleEditFormSubmission(values, propertyId, navigate);
  };

  if (propertyLoading) {
    return (
      <Card>
        <CardContent className="pt-6 flex justify-center items-center min-h-[400px]">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-muted-foreground">Loading property details...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (propertyError || !property) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <p className="text-red-500">Failed to load property details</p>
            <button 
              onClick={() => navigate("/properties")}
              className="text-blue-500 hover:underline"
            >
              Return to Properties
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" /> Edit Property: {property.name}
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
            <PropertyEditActions propertyId={propertyId} />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
