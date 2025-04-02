
import { useQuery } from "@tanstack/react-query";
import { propertyService } from "@/services/api-service";
import { convertToMongoIdFormat } from "@/lib/id-conversion";
import { Property } from "@/types/api-responses";

export function usePropertiesData() {
  const { data: properties = [], isLoading } = useQuery({
    queryKey: ["properties"],
    queryFn: async () => {
      try {
        const response = await propertyService.getAllProperties();
        return response.data.properties;
      } catch (error) {
        console.error("Error fetching properties:", error);
        return convertToMongoIdFormat(getMockProperties()) as Property[];
      }
    },
  });

  return {
    properties,
    isLoading
  };
}

function getMockProperties() {
  return [
    { _id: "1", name: "Oceanfront Villa" },
    { _id: "2", name: "Downtown Loft" },
    { _id: "3", name: "Mountain Cabin" },
    { _id: "4", name: "Beachside Condo" },
    { _id: "5", name: "Suburban House" },
  ];
}
