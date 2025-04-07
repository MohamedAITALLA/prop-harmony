
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";

import { BasicInfoSection } from "./form/BasicInfoSection";
import { AddressSection } from "./form/AddressSection";
import { CapacitySection } from "./form/CapacitySection";
import { AmenitiesSection } from "./form/AmenitiesSection";
import { PoliciesSection } from "./form/PoliciesSection";
import { ImagesSection } from "./form/ImagesSection";
import { editFormSchema, FormValues } from "./form/PropertyFormSchema";
import { useLocationSelector } from "./form/useLocationSelector";
import { Property } from "@/types/api-responses";
import { handleEditFormSubmission } from "./form/submission";
import { toast } from "sonner";
import { FormContainer } from "./form/edit/FormContainer";
import { EditFormActions } from "./form/edit/EditFormActions";
import { transformPropertyToFormData } from "./form/edit/PropertyFormTransformer";

interface PropertyEditFormProps {
  propertyId: string;
  initialData: Property;
  refetchProperty: () => Promise<void>;
}

export function PropertyEditForm({ propertyId, initialData, refetchProperty }: PropertyEditFormProps) {
  const navigate = useNavigate();
  
  console.log("Initial property data:", initialData);
  
  // Transform API data to form data structure using the utility function
  const transformedInitialData = transformPropertyToFormData(initialData);

  const form = useForm<FormValues>({
    resolver: zodResolver(editFormSchema), // Use edit form schema
    defaultValues: transformedInitialData,
    mode: "onChange",
  });

  const { selectedCountry, availableCities, handleCountryChange } = useLocationSelector(form, initialData.address.country, initialData.address.city);

  useEffect(() => {
    // Reset form with the transformed data to ensure all fields are properly initialized
    form.reset(transformedInitialData);
    // Log the initialized form values for debugging
    console.log("Form initialized with values:", transformedInitialData);
  }, [initialData, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      // @ts-ignore - accessing custom properties
      const uploadedImages = form.uploadedImages || {};
      // @ts-ignore - accessing custom properties
      const imagesToDelete = form.imagesToDelete || [];

      await handleEditFormSubmission(
        values, 
        propertyId, 
        navigate, 
        initialData,
        refetchProperty, 
        uploadedImages,
        imagesToDelete
      );
    } catch (error) {
      console.error("Error updating property:", error);
      toast.error("Failed to update property. Please try again.");
    }
  };

  return (
    <FormContainer>
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
            <ImagesSection form={form} isEditMode={true} />
          </div>

          {/* Form Actions */}
          <EditFormActions propertyId={propertyId} />
        </form>
      </Form>
    </FormContainer>
  );
}
