
import { FormValues } from "./PropertyFormSchema";
import { PropertyType } from "@/types/enums";

export const defaultFormValues: FormValues = {
  name: "",
  property_type: PropertyType.HOUSE,
  description: "",
  street: "",
  city: "",
  country: "",
  stateProvince: "",
  postalCode: "",
  latitude: 0,
  longitude: 0,
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
};
