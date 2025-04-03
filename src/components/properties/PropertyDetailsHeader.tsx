
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Edit, RefreshCw, Trash, Star } from "lucide-react";
import { Property } from "@/types/api-responses";
import { Badge } from "@/components/ui/badge";

interface PropertyDetailsHeaderProps {
  property: Property;
  onSync: () => void;
  onDelete: () => void;
}

export function PropertyDetailsHeader({ property, onSync, onDelete }: PropertyDetailsHeaderProps) {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/properties/${property._id}/edit`);
  };

  return (
    <div className="bg-white dark:bg-card rounded-lg shadow-sm border p-6 mb-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl font-bold tracking-tight">{property.name}</h1>
            <Badge variant="outline" className="font-normal text-muted-foreground">
              {property.property_type}
            </Badge>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-muted-foreground mb-2">
            <span className="flex items-center">
              <Star className="h-4 w-4 mr-1 text-amber-500" fill="currentColor" />
              {property.rating || "New"}
            </span>
            <span>•</span>
            <span>{property.address.city}, {property.address.country}</span>
          </div>
          {property.description && (
            <p className="text-muted-foreground text-sm max-w-2xl line-clamp-2">{property.description}</p>
          )}
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" /> Edit
          </Button>
          <Button variant="outline" size="sm" onClick={onSync}>
            <RefreshCw className="mr-2 h-4 w-4" /> Sync
          </Button>
          <Button variant="destructive" size="sm" onClick={onDelete}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
