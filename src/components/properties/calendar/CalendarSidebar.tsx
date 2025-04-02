
import React from 'react';
import { Search, Check, X, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Platform, EventType } from "@/types/enums";
import { PlatformSelect } from "@/components/sync/PlatformSelect";
import { EventTypeSelect } from "@/components/events/EventTypeSelect";
import { DateRangeSelect } from "@/components/ui/date-range-select";
import { DateRange } from "react-day-picker";

interface CalendarSidebarProps {
  selectedPlatforms: Platform[];
  setSelectedPlatforms: (platforms: Platform[]) => void;
  selectedEventTypes: EventType[];
  setSelectedEventTypes: (eventTypes: EventType[]) => void;
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onClearFilters: () => void;
}

export const CalendarSidebar: React.FC<CalendarSidebarProps> = ({
  selectedPlatforms,
  setSelectedPlatforms,
  selectedEventTypes,
  setSelectedEventTypes,
  dateRange,
  setDateRange,
  searchQuery,
  setSearchQuery,
  onClearFilters
}) => {
  return (
    <div className="w-full lg:w-[260px] space-y-4">
      <Card>
        <CardHeader className="px-4 py-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" /> Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 py-2 space-y-5">
          <div className="relative w-full mb-4">
            <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Platforms</h3>
            <PlatformSelect
              selected={selectedPlatforms}
              onSelectionChange={setSelectedPlatforms}
            />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Event Types</h3>
            <EventTypeSelect
              selected={selectedEventTypes}
              onSelectionChange={setSelectedEventTypes}
            />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Date Range</h3>
            <DateRangeSelect
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />
          </div>
          
          <div className="flex flex-col gap-2 mt-4">
            {(selectedPlatforms.length > 0 || selectedEventTypes.length > 0 || dateRange?.from || searchQuery) && (
              <Button 
                variant="outline" 
                className="w-full"
                onClick={onClearFilters}
              >
                <X className="mr-2 h-4 w-4" /> Clear Filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
