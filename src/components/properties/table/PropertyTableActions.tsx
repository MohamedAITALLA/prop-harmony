
import React from "react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Eye, Edit, RefreshCw, Trash2, MoreVertical } from "lucide-react";
import { Property } from "@/types/api-responses";

interface PropertyTableActionsProps {
  property: Property;
  onAction: (action: string, property: Property) => void;
}

export function PropertyTableActions({ property, onAction }: PropertyTableActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onAction("View", property)}>
          <Eye className="h-4 w-4 mr-2" /> View
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAction("Edit", property)}>
          <Edit className="h-4 w-4 mr-2" /> Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAction("Sync Now", property)}>
          <RefreshCw className="h-4 w-4 mr-2" /> Sync Now
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onAction("Delete", property)}
          className="text-destructive"
        >
          <Trash2 className="h-4 w-4 mr-2" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
