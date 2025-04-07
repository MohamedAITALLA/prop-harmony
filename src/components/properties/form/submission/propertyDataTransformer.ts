
import { FormValues } from "../PropertyFormSchema";
import { Property } from "@/types/api-responses";

/**
 * Compares form values with initial property data and returns only changed fields
 */
export const extractChangedPropertyData = (
  values: FormValues,
  initialData: Property
): Partial<{
  name: string;
  property_type: string;
  desc: string;
  address: {
    street: string;
    city: string;
    state_province: string;
    postal_code: string;
    country: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  bedrooms: number;
  bathrooms: number;
  beds: number;
  accommodates: number;
  amenities: {
    wifi: boolean;
    kitchen: boolean;
    ac: boolean;
    heating: boolean;
    tv: boolean;
    washer: boolean;
    dryer: boolean;
    parking: boolean;
    elevator: boolean;
    pool: boolean;
  };
  policies: {
    check_in_time: string;
    check_out_time: string;
    minimum_stay: number;
    pets_allowed: boolean;
    smoking_allowed: boolean;
  };
}> => {
  const propertyData: ReturnType<typeof extractChangedPropertyData> = {};

  // Check for basic information changes
  if (values.name !== initialData.name) {
    propertyData.name = values.name;
  }
  
  if (values.property_type !== initialData.property_type) {
    propertyData.property_type = values.property_type;
  }
  
  if (values.description !== initialData.desc) {
    propertyData.desc = values.description;
  }
  
  // Check for address changes
  const addressChanged = 
    values.street !== initialData.address.street ||
    values.city !== initialData.address.city ||
    values.stateProvince !== initialData.address.state_province ||
    values.postalCode !== initialData.address.postal_code ||
    values.country !== initialData.address.country ||
    values.latitude !== (initialData.address.coordinates?.latitude || 0) ||
    values.longitude !== (initialData.address.coordinates?.longitude || 0);
  
  if (addressChanged) {
    propertyData.address = {
      street: values.street,
      city: values.city,
      state_province: values.stateProvince || "",
      postal_code: values.postalCode || "",
      country: values.country,
      coordinates: {
        latitude: values.latitude || 0,
        longitude: values.longitude || 0
      }
    };
  }
  
  // Check for capacity changes
  if (values.bedrooms !== initialData.bedrooms) {
    propertyData.bedrooms = values.bedrooms;
  }
  
  if (values.bathrooms !== initialData.bathrooms) {
    propertyData.bathrooms = values.bathrooms;
  }
  
  if (values.beds !== initialData.beds) {
    propertyData.beds = values.beds;
  }
  
  if (values.accommodates !== initialData.accommodates) {
    propertyData.accommodates = values.accommodates;
  }
  
  // Check for amenities changes
  const amenitiesChanged = 
    values.wifi !== (initialData.amenities?.wifi || false) ||
    values.kitchen !== (initialData.amenities?.kitchen || false) ||
    values.ac !== (initialData.amenities?.ac || false) ||
    values.heating !== (initialData.amenities?.heating || false) ||
    values.tv !== (initialData.amenities?.tv || false) ||
    values.washer !== (initialData.amenities?.washer || false) ||
    values.dryer !== (initialData.amenities?.dryer || false) ||
    values.parking !== (initialData.amenities?.parking || false) ||
    values.elevator !== (initialData.amenities?.elevator || false) ||
    values.pool !== (initialData.amenities?.pool || false);
  
  if (amenitiesChanged) {
    propertyData.amenities = {
      wifi: values.wifi,
      kitchen: values.kitchen,
      ac: values.ac,
      heating: values.heating,
      tv: values.tv,
      washer: values.washer,
      dryer: values.dryer,
      parking: values.parking,
      elevator: values.elevator,
      pool: values.pool
    };
  }
  
  // Check for policies changes
  const policiesChanged = 
    values.checkInTime !== (initialData.policies?.check_in_time || "15:00") ||
    values.checkOutTime !== (initialData.policies?.check_out_time || "11:00") ||
    values.minimumStay !== (initialData.policies?.minimum_stay || 1) ||
    values.petsAllowed !== (initialData.policies?.pets_allowed || false) ||
    values.smokingAllowed !== (initialData.policies?.smoking_allowed || false);
  
  if (policiesChanged) {
    propertyData.policies = {
      check_in_time: values.checkInTime || "15:00",
      check_out_time: values.checkOutTime || "11:00",
      minimum_stay: values.minimumStay,
      pets_allowed: values.petsAllowed,
      smoking_allowed: values.smokingAllowed
    };
  }

  return propertyData;
};
