
import { z } from "zod";
import { PropertyType } from "@/types/enums";

// Create a schema for the form
export const formSchema = z.object({
  name: z.string().min(3, "Property name must be at least 3 characters"),
  property_type: z.nativeEnum(PropertyType),
  description: z.string().min(10, "Description must be at least 10 characters"),
  
  // Address fields
  street: z.string().min(3, "Street address is required"),
  city: z.string().min(2, "City is required"),
  stateProvince: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().min(2, "Country is required"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  
  // Capacity fields
  bedrooms: z.coerce.number().min(0, "Bedrooms must be a positive number"),
  bathrooms: z.coerce.number().min(0, "Bathrooms must be a positive number"),
  beds: z.coerce.number().min(0, "Beds must be a positive number"),
  accommodates: z.coerce.number().min(1, "Must accommodate at least 1 person"),
  
  // Amenities
  wifi: z.boolean().default(false),
  kitchen: z.boolean().default(false),
  ac: z.boolean().default(false),
  heating: z.boolean().default(false),
  tv: z.boolean().default(false),
  washer: z.boolean().default(false),
  dryer: z.boolean().default(false),
  parking: z.boolean().default(false),
  elevator: z.boolean().default(false),
  pool: z.boolean().default(false),
  
  // Policies
  checkInTime: z.string().optional(),
  checkOutTime: z.string().optional(),
  minimumStay: z.coerce.number().min(1, "Minimum stay must be at least 1 night"),
  petsAllowed: z.boolean().default(false),
  smokingAllowed: z.boolean().default(false),
  
  // Images - accept any string value for the form validation
  // The actual file objects are handled separately
  images: z.array(
    z.object({
      value: z.string()
    })
  ).min(1, "At least one image is required"),
});

// Export the type for form values
export type FormValues = z.infer<typeof formSchema>;
