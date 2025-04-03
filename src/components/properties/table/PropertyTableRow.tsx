
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { SyncStatusBadge } from "@/components/ui/sync-status-badge";
import { Property } from "@/types/api-responses";
import { Eye } from "lucide-react";
import { PropertyTableActions } from "./PropertyTableActions";

interface PropertyTableRowProps {
  property: Property;
  onAction: (action: string, property: Property) => void;
}

export function PropertyTableRow({ property, onAction }: PropertyTableRowProps) {
  return (
    <TableRow key={property._id} className="hover:bg-muted/50">
      <TableCell className="font-medium">
        <div className="flex items-center">
          {property.images && property.images.length > 0 ? (
            <div className="h-8 w-8 rounded overflow-hidden mr-2 bg-muted">
              <img 
                src={property.images[0]} 
                alt={property.name} 
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="h-8 w-8 rounded overflow-hidden mr-2 bg-muted flex items-center justify-center">
              <Eye className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
          {property.name}
        </div>
      </TableCell>
      <TableCell className="capitalize">{property.property_type}</TableCell>
      <TableCell>{property.address.city}, {property.address.state_province}</TableCell>
      <TableCell>{property.bookings_count || 0}</TableCell>
      <TableCell>
        <SyncStatusBadge 
          status={property.sync_status || "Not synced"} 
          lastSync={property.updated_at}
        />
      </TableCell>
      <TableCell className="text-right">
        <PropertyTableActions 
          property={property} 
          onAction={onAction} 
        />
      </TableCell>
    </TableRow>
  );
}
