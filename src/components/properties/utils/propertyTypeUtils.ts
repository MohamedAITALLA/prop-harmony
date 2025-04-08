
import { PropertyType } from "@/types/enums";

export const getPropertyTypeColor = (propertyType?: string): string => {
  const propertyTypeUpper = propertyType?.toUpperCase();
  
  switch (propertyTypeUpper) {
    case PropertyType.APARTMENT.toUpperCase():
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case PropertyType.HOUSE.toUpperCase():
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case PropertyType.VILLA.toUpperCase():
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
    case PropertyType.CABIN.toUpperCase():
      return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
    case PropertyType.HOTEL.toUpperCase():
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    case PropertyType.CONDO.toUpperCase():
      return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300";
    case PropertyType.ROOM.toUpperCase():
      return "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  }
};
