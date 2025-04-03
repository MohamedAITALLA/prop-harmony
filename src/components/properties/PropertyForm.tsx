
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
import { defaultFormValues } from "./form/PropertyFormDefaults";
import { handleFormSubmission } from "./form/PropertyFormSubmission";
import { useLocationSelector } from "./form/useLocationSelector";
import { PropertyFormError } from "./form/PropertyFormError";

export function PropertyForm() {
  const navigate = useNavigate();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultFormValues,
  });

  const { selectedCountry, availableCities, handleCountryChange } = useLocationSelector(form);

  const onSubmit = async (values: FormValues) => {
    // @ts-ignore - accessing the custom property we added
    const uploadedImages = form.uploadedImages || {};
    await handleFormSubmission(values, navigate, uploadedImages);
  };

  const handleBackToProperties = () => {
    navigate("/properties");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <House className="h-5 w-5" /> Add New Property
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
            <PropertyFormActions onSubmit={() => {}} />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
