
import React from "react";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PropertyEmptyStateProps {
  onResetFilters: () => void;
}

export function PropertyEmptyState({ onResetFilters }: PropertyEmptyStateProps) {
  return (
    <div className="text-center py-16 bg-gray-50 dark:bg-gray-900 rounded-lg border border-dashed">
      <div className="flex flex-col items-center space-y-2">
        <div className="rounded-full bg-primary/10 p-3">
          <Search className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-medium">No properties found</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          We couldn't find any properties that match your search criteria. Try adjusting your filters or add a new property.
        </p>
        <div className="mt-4 flex space-x-2">
          <Button variant="outline" onClick={onResetFilters}>
            Reset Filters
          </Button>
          <Button onClick={() => window.location.href = '/properties/new'}>
            <Plus className="w-4 h-4 mr-2" /> Add Property
          </Button>
        </div>
      </div>
    </div>
  );
}
