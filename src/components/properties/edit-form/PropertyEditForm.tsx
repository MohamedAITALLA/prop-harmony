
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { formSchema, FormValues } from "../form/PropertyFormSchema";
import { usePropertyDetails } from "@/hooks/properties/usePropertyDetails";
import { propertyService } from "@/services/property-service";
import { useLocationSelector } from "../form/useLocationSelector";
import { PropertyFormLoading } from "../form/PropertyFormLoading";
import { PropertyFormError } from "../form/PropertyFormError";
import { Separator } from "@/components/ui/separator";

import { BasicInfoSection } from "../form/BasicInfoSection";
import { AddressSection } from "../form/AddressSection";
import { CapacitySection } from "../form/CapacitySection";
import { AmenitiesSection } from "../form/AmenitiesSection";
import { PoliciesSection } from "../form/PoliciesSection";
import { ImagesSection } from "../form/ImagesSection";

interface PropertyEditFormProps {
  propertyId: string;
}

export function PropertyEditForm({ propertyId }: PropertyEditFormProps) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { 
    property, 
    propertyLoading, 
    propertyError,
    isError,
    manualRetry
  } = usePropertyDetails(propertyId);
  
  // Initialize form with default values
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
    mode: "onTouched",
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
      
      // Explicitly reset the form with new values to ensure the fields update
      form.reset(formData);
      
      // Set country to trigger city options loading
      if (property.address?.country) {
        handleCountryChange(property.address.country);
      }
    }
  }, [property, form, handleCountryChange]);

  const handleSubmit = async (values: FormValues) => {
    if (!propertyId) {
      toast.error("Property ID is missing");
      return;
    }
    
    try {
      setIsSubmitting(true);
      toast.info("Updating property...");
      console.log("Submitting property update with values:", values);
      
      // Prepare data for API
      const propertyData = {
        name: values.name,
        property_type: values.property_type,
        description: values.description,
        address: {
          street: values.street,
          city: values.city,
          state_province: values.stateProvince,
          postal_code: values.postalCode,
          country: values.country,
          coordinates: {
            latitude: values.latitude || 0,
            longitude: values.longitude || 0,
          }
        },
        bedrooms: Number(values.bedrooms) || 0,
        bathrooms: Number(values.bathrooms) || 0,
        beds: Number(values.beds) || Number(values.bedrooms) || 0,
        accommodates: Number(values.accommodates) || 1,
        amenities: {
          wifi: Boolean(values.wifi),
          kitchen: Boolean(values.kitchen),
          ac: Boolean(values.ac),
          heating: Boolean(values.heating),
          tv: Boolean(values.tv),
          washer: Boolean(values.washer),
          dryer: Boolean(values.dryer),
          parking: Boolean(values.parking),
          elevator: Boolean(values.elevator),
          pool: Boolean(values.pool),
        },
        policies: {
          check_in_time: values.checkInTime,
          check_out_time: values.checkOutTime,
          minimum_stay: Number(values.minimumStay) || 1,
          pets_allowed: Boolean(values.petsAllowed),
          smoking_allowed: Boolean(values.smokingAllowed),
        },
        images: values.images.map(img => img.value).filter(url => url.trim() !== ""),
      };

      console.log("Submitting update with data:", propertyData);
      const response = await propertyService.updateProperty(propertyId, propertyData);
      console.log("Update response:", response);
      
      // Get updated fields from response if available
      const updatedFields = response?.data?.meta?.updated_fields || [];
      const changesCount = response?.data?.meta?.changes_count || 0;
      
      // Show different toast messages based on the number of changes
      if (changesCount === 0) {
        toast.info("No changes were made to the property.");
      } else {
        toast.success(`Property updated successfully! (${changesCount} change${changesCount > 1 ? 's' : ''})`);
      }
      
      // Navigate to the property details page
      navigate(`/properties/${propertyId}`);
    } catch (error) {
      console.error("Error updating property:", error);
      toast.error("Failed to update property. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (form.formState.isDirty) {
      if (window.confirm("You have unsaved changes. Are you sure you want to cancel?")) {
        navigate(`/properties/${propertyId}`);
      }
    } else {
      navigate(`/properties/${propertyId}`);
    }
  };

  // Loading state
  if (propertyLoading) {
    return <PropertyFormLoading />;
  }

  // Error state
  if (isError || !property) {
    const errorMessage = propertyError instanceof Error 
      ? propertyError.message 
      : "Failed to load property details";
    
    return (
      <PropertyFormError 
        onRetry={manualRetry} 
        onBack={() => navigate("/properties")}
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
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                <X className="mr-2 h-4 w-4" /> Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-green-600 hover:bg-green-700"
                disabled={isSubmitting}
              >
                <Save className="mr-2 h-4 w-4" />
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
