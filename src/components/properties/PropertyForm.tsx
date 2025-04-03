
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { PropertyType } from "@/types/enums";
import { propertyService } from "@/services/api-service";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  House, 
  Utensils, 
  AirVent, 
  Flame, 
  Tv, 
  BedDouble, 
  ParkingSquare, 
  Building,
  Waves
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { countryData, getCitiesForCountry } from "@/utils/locations";
import { BasicInfoSection } from "./form/BasicInfoSection";
import { AddressSection } from "./form/AddressSection";
import { CapacitySection } from "./form/CapacitySection";
import { AmenitiesSection } from "./form/AmenitiesSection";
import { PoliciesSection } from "./form/PoliciesSection";
import { ImagesSection } from "./form/ImagesSection";
import { FormValues, formSchema } from "./form/PropertyFormSchema";

export function PropertyForm() {
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      property_type: PropertyType.HOUSE,
      description: "",
      street: "",
      city: "",
      country: "",
      stateProvince: "",
      postalCode: "",
      latitude: undefined,
      longitude: undefined,
      bedrooms: 1,
      bathrooms: 1,
      beds: 1,
      accommodates: 2,
      images: [{ value: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=800&auto=format&fit=crop" }],
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

  // Update cities when country changes
  useEffect(() => {
    if (selectedCountry) {
      const cities = getCitiesForCountry(selectedCountry);
      setAvailableCities(cities);
      
      // Clear city selection if the currently selected city is not in the new list
      const currentCity = form.getValues("city");
      if (currentCity && !cities.includes(currentCity)) {
        form.setValue("city", "");
      }
    } else {
      setAvailableCities([]);
    }
  }, [selectedCountry, form]);

  const onSubmit = async (values: FormValues) => {
    try {
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
        bedrooms: values.bedrooms,
        bathrooms: values.bathrooms,
        beds: values.beds || values.bedrooms,
        accommodates: values.accommodates,
        amenities: {
          wifi: values.wifi,
          kitchen: values.kitchen,
          ac: values.ac,
          heating: values.heating,
          tv: values.tv,
          washer: values.washer,
          dryer: values.dryer,
          parking: values.parking,
          elevator: values.elevator,
          pool: values.pool,
        },
        policies: {
          check_in_time: values.checkInTime,
          check_out_time: values.checkOutTime,
          minimum_stay: values.minimumStay,
          pets_allowed: values.petsAllowed,
          smoking_allowed: values.smokingAllowed,
        },
        images: values.images.map(img => img.value),
      };

      const response = await propertyService.createProperty(propertyData);
      
      toast.success("Property created successfully!");
      
      // Navigate to the property details page
      if (response?.data?.property?._id) {
        navigate(`/properties/${response.data.property._id}`);
      } else {
        navigate("/properties");
      }
    } catch (error) {
      console.error("Error creating property:", error);
      toast.error("Failed to create property. Please try again.");
    }
  };

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value);
    form.setValue("country", value);
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

            <div className="flex justify-end gap-4 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate("/properties")}
              >
                Cancel
              </Button>
              <Button type="submit">Create Property</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
