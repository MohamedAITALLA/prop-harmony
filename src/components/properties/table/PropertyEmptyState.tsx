
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface PropertyEmptyStateProps {
  onClearFilters: () => void;
}

export function PropertyEmptyState({ onClearFilters }: PropertyEmptyStateProps) {
  return (
    <TableRow>
      <TableCell colSpan={6} className="text-center py-8">
        <div className="flex flex-col items-center justify-center space-y-2">
          <Search className="h-8 w-8 text-muted-foreground" />
          <p className="text-muted-foreground">No properties found matching your filters</p>
          <Button 
            variant="link" 
            onClick={onClearFilters}
          >
            Clear filters
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
