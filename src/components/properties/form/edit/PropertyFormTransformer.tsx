
import { Property } from "@/types/api-responses";
import { FormValues } from "../PropertyFormSchema";
import { PropertyType } from "@/types/enums";

export function transformPropertyToFormData(initialData: Property): FormValues {
  // Transform API data to form data structure, ensuring proper field mapping
  return {
    name: initialData.name,
    property_type: initialData.property_type as PropertyType,
    description: initialData.desc || "", // Map from desc field instead of description
    street: initialData.address.street || "",
    city: initialData.address.city || "",
    stateProvince: initialData.address.state_province || "", // Map from state_province field
    postalCode: initialData.address.postal_code || "", // Map from postal_code field
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
}
