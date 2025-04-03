
import * as z from "zod";
import { PropertyType } from "@/types/enums";

// Define the form schema with Zod
export const formSchema = z.object({
  name: z.string().min(3, { message: "Property name must be at least 3 characters" }),
  property_type: z.nativeEnum(PropertyType),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  street: z.string().min(1, { message: "Street address is required" }),
  city: z.string().min(1, { message: "City is required" }),
  country: z.string().min(1, { message: "Country is required" }),
  stateProvince: z.string().min(1, { message: "State/Province is required" }),
  postalCode: z.string().min(1, { message: "Postal code is required" }),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  bedrooms: z.coerce.number().int().min(0),
  bathrooms: z.coerce.number().min(0),
  beds: z.coerce.number().int().min(0),
  accommodates: z.coerce.number().int().min(1),
  images: z.array(
    z.object({
      value: z.string()
    })
  ).min(1, { message: "At least one image is required" }),
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
  checkInTime: z.string().default("15:00"),
  checkOutTime: z.string().default("11:00"),
  minimumStay: z.coerce.number().int().min(1).default(1),
  petsAllowed: z.boolean().default(false),
  smokingAllowed: z.boolean().default(false),
});

export type FormValues = z.infer<typeof formSchema>;
