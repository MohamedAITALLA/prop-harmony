
import { useState, useEffect } from "react";
import { getCitiesForCountry } from "@/utils/locations";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./PropertyFormSchema";

export function useLocationSelector(form: UseFormReturn<FormValues>) {
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  
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

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value);
    form.setValue("country", value);
  };

  return {
    selectedCountry,
    availableCities,
    handleCountryChange
  };
}
