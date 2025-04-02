
import React from 'react';
import { Search, Check, X, Filter, Download, BedDouble, Home, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Platform, EventType } from "@/types/enums";
import { PlatformSelect } from "@/components/sync/PlatformSelect";
import { EventTypeSelect } from "@/components/events/EventTypeSelect";
import { DateRangeSelect } from "@/components/ui/date-range-select";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";

interface CalendarSidebarProps {
  selectedPlatforms: Platform[];
  setSelectedPlatforms: (platforms: Platform[]) => void;
  selectedEventTypes: EventType[];
  setSelectedEventTypes: (eventTypes: EventType[]) => void;
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
  onExport: (format: string) => void;
  copyICalFeedUrl: () => void;
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
  onApplyFilters,
  onClearFilters,
  onExport,
  copyICalFeedUrl
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
            <Button 
              onClick={onApplyFilters}
              className="w-full"
            >
              <Check className="mr-2 h-4 w-4" />
              Apply Filters
            </Button>
            
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
      
      <Card>
        <CardHeader className="px-4 py-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Download className="h-5 w-5" /> Export
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 py-2 space-y-2">
          <Button variant="outline" className="w-full" onClick={() => onExport('iCal')}>
            Export as iCal
          </Button>
          <Button variant="outline" className="w-full" onClick={() => onExport('PDF')}>
            Export as PDF
          </Button>
          <Button variant="outline" className="w-full" onClick={copyICalFeedUrl}>
            Copy iCal Feed URL
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="px-4 py-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5" /> Legend
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 py-2 space-y-2">
          <div className="flex items-center gap-2">
            <Badge className="bg-[#ff5a5f]">
              <BedDouble className="h-3 w-3 mr-1" /> Airbnb
            </Badge>
            <span className="text-xs text-muted-foreground">Airbnb bookings</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className="bg-[#003580]">
              <BedDouble className="h-3 w-3 mr-1" /> Booking
            </Badge>
            <span className="text-xs text-muted-foreground">Booking.com</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className="bg-[#ef4444]">
              <Home className="h-3 w-3 mr-1" /> Blocked
            </Badge>
            <span className="text-xs text-muted-foreground">Property unavailable</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className="bg-[#f97316]">
              <AlertCircle className="h-3 w-3 mr-1" /> Maintenance
            </Badge>
            <span className="text-xs text-muted-foreground">Repairs, cleaning</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
