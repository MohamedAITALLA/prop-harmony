
import { useState, useEffect } from "react";
import { getCitiesForCountry } from "@/utils/locations";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./PropertyFormSchema";

export function useLocationSelector(
  form: UseFormReturn<FormValues>, 
  initialCountry?: string, 
  initialCity?: string
) {
  const [selectedCountry, setSelectedCountry] = useState<string>(initialCountry || "");
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  
  // Initialize with initial country value
  useEffect(() => {
    if (initialCountry && selectedCountry === "") {
      setSelectedCountry(initialCountry);
      
      // Set country in form if not already set
      if (!form.getValues("country")) {
        form.setValue("country", initialCountry);
      }
    }
  }, [initialCountry, form, selectedCountry]);

  // Update cities when country changes
  useEffect(() => {
    if (selectedCountry) {
      console.log("Updating cities for country:", selectedCountry);
      const cities = getCitiesForCountry(selectedCountry);
      setAvailableCities(cities);
      
      // If initial city is provided, select it if it exists in the list
      if (initialCity && cities.includes(initialCity) && !form.getValues("city")) {
        form.setValue("city", initialCity);
        console.log("Set initial city:", initialCity);
      }
      // Clear city selection if the currently selected city is not in the new list
      else {
        const currentCity = form.getValues("city");
        if (currentCity && !cities.includes(currentCity)) {
          form.setValue("city", "");
        }
      }
    } else {
      setAvailableCities([]);
    }
  }, [selectedCountry, form, initialCity]);

  const handleCountryChange = (value: string) => {
    console.log("Country changed to:", value);
    setSelectedCountry(value);
    form.setValue("country", value);
  };

  return {
    selectedCountry,
    availableCities,
    handleCountryChange
  };
}
