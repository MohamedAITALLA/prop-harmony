
import React from "react";
import { formatDistance } from "date-fns";
import { cn } from "@/lib/utils";
import { Property } from "@/types/api-responses";
import { PropertyGridCard } from "./cards/PropertyGridCard";
import { PropertyListCard } from "./cards/PropertyListCard";
import { getPropertyImageUrl } from "./utils/imageUtils";

export interface PropertyCardProps {
  property: Property;
  viewMode?: "grid" | "list";
  className?: string;
  onClick?: () => void;
}

export function PropertyCard({ property, viewMode = "grid", className, onClick, ...props }: PropertyCardProps & React.HTMLAttributes<HTMLDivElement>) {
  // Get a clean image URL
  const defaultImage = "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=800&auto=format&fit=crop";
  const imageUrl = getPropertyImageUrl(property.images, defaultImage);
  
  // Format the creation date
  const createdDate = property.created_at ? new Date(property.created_at) : null;
  const timeAgo = createdDate ? formatDistance(createdDate, new Date(), { addSuffix: true }) : "Unknown date";
  
  // Handle different view modes (grid or list)
  if (viewMode === "list") {
    return (
      <PropertyListCard
        property={property}
        className={className}
        onClick={onClick}
        imageUrl={imageUrl}
        timeAgo={timeAgo}
        {...props}
      />
    );
  }

  // Default grid view
  return (
    <PropertyGridCard
      property={property}
      className={className}
      onClick={onClick}
      imageUrl={imageUrl}
      createdDate={createdDate}
      {...props}
    />
  );
}
