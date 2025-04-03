
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building } from "lucide-react";
import { toast } from "sonner";

import { formSchema, FormValues } from "../form/PropertyFormSchema";
import { handleEditFormSubmission } from "../form/PropertyEditSubmission";
import { useLocationSelector } from "../form/useLocationSelector";
import { usePropertyDetails } from "@/hooks/properties/usePropertyDetails";
import { PropertyEditFormContent } from "./PropertyEditFormContent";
import { PropertyEditActions } from "../form/PropertyEditActions";
import { PropertyFormLoading } from "../form/PropertyFormLoading";
import { PropertyFormError } from "../form/PropertyFormError";

interface PropertyEditFormProps {
  propertyId: string;
}

export function PropertyEditForm({ propertyId }: PropertyEditFormProps) {
  const navigate = useNavigate();
  const { 
    property, 
    propertyLoading, 
    propertyError, 
    refetchProperty,
    isError,
    manualRetry
  } = usePropertyDetails(propertyId);
  
  // Initialize form with empty values
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
    mode: "onChange",
  });

  const { selectedCountry, availableCities, handleCountryChange } = useLocationSelector(form);
  
  // Populate form with property data once loaded
  useEffect(() => {
    if (property && Object.keys(property).length > 0) {
      console.log("Setting form with property data:", property);
      
      // Map API data to form values
      const formData: Partial<FormValues> = {
        name: property.name || "",
        property_type: property.property_type || undefined,
        description: property.description || "",
        street: property.address?.street || "",
        city: property.address?.city || "",
        country: property.address?.country || "",
        stateProvince: property.address?.state_province || "",
        postalCode: property.address?.postal_code || "",
        latitude: property.address?.coordinates?.latitude,
        longitude: property.address?.coordinates?.longitude,
        bedrooms: property.bedrooms || 0,
        bathrooms: property.bathrooms || 0,
        beds: property.beds || property.bedrooms || 0,
        accommodates: property.accommodates || 1,
        images: property.images?.length > 0 
          ? property.images.map(url => ({ value: url })) 
          : [{ value: "" }],
        checkInTime: property.policies?.check_in_time || "15:00",
        checkOutTime: property.policies?.check_out_time || "11:00",
        minimumStay: property.policies?.minimum_stay || 1,
        petsAllowed: property.policies?.pets_allowed || false,
        smokingAllowed: property.policies?.smoking_allowed || false,
      };
      
      // Handle amenities
      if (property.amenities) {
        formData.wifi = !!property.amenities.wifi;
        formData.kitchen = !!property.amenities.kitchen;
        formData.ac = !!property.amenities.ac;
        formData.heating = !!property.amenities.heating;
        formData.tv = !!property.amenities.tv;
        formData.washer = !!property.amenities.washer;
        formData.dryer = !!property.amenities.dryer;
        formData.parking = !!property.amenities.parking;
        formData.elevator = !!property.amenities.elevator;
        formData.pool = !!property.amenities.pool;
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
    console.log("Form submitted with values:", values);
    if (!propertyId) {
      toast.error("Property ID is missing");
      return;
    }
    
    await handleEditFormSubmission(values, propertyId, navigate);
  };

  const handleBackToProperties = () => {
    navigate("/properties");
  };

  // Loading state
  if (propertyLoading) {
    return <PropertyFormLoading />;
  }

  // Error state
  if (isError || !property) {
    const errorMessage = propertyError instanceof Error ? propertyError.message : "Failed to load property details";
    return (
      <PropertyFormError 
        onRetry={manualRetry} 
        onBack={handleBackToProperties}
        errorMessage={errorMessage}
      />
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
            <PropertyEditFormContent 
              form={form}
              selectedCountry={selectedCountry}
              availableCities={availableCities}
              handleCountryChange={handleCountryChange}
            />

            {/* Form Actions */}
            <PropertyEditActions propertyId={propertyId} />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
