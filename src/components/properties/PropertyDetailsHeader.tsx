
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Edit, RefreshCw, Trash } from "lucide-react";
import { Property } from "@/types/api-responses";

interface PropertyDetailsHeaderProps {
  property: Property;
  onSync: () => void;
  onDelete: () => void;
}

export function PropertyDetailsHeader({ property, onSync, onDelete }: PropertyDetailsHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{property.name}</h1>
        <p className="text-muted-foreground">
          {property.address.city}, {property.address.country}
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={() => navigate(`/properties/${property._id}/edit`)}>
          <Edit className="mr-2 h-4 w-4" /> Edit Property
        </Button>
        <Button variant="outline" onClick={onSync}>
          <RefreshCw className="mr-2 h-4 w-4" /> Sync Now
        </Button>
        <Button variant="destructive" onClick={onDelete}>
          <Trash className="mr-2 h-4 w-4" /> Delete
        </Button>
      </div>
    </div>
  );
}
