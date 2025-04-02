
import React from "react";
import { useEventManagement } from "./EventManagementContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarRange } from "@/components/ui/calendar-range";
import { Search, Filter, X } from "lucide-react";
import { Property } from "@/types/api-responses";

export const EventFilters: React.FC = () => {
  const { 
    searchQuery, 
    setSearchQuery, 
    showFilters, 
    setShowFilters, 
    selectedProperties,
    setSelectedProperties,
    selectedPlatforms,
    setSelectedPlatforms,
    selectedEventTypes,
    setSelectedEventTypes,
    dateRange,
    setDateRange,
    properties
  } = useEventManagement();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            className="pl-8 w-full sm:w-[300px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="mr-2 h-4 w-4" />
            Filters
            {(selectedProperties.length > 0 || selectedPlatforms.length > 0 || selectedEventTypes.length > 0) && (
              <span className="ml-1 rounded-full bg-primary w-5 h-5 text-xs flex items-center justify-center text-primary-foreground">
                {selectedProperties.length + selectedPlatforms.length + selectedEventTypes.length}
              </span>
            )}
          </Button>
        </div>
      </div>
      
      {showFilters && (
        <Card className="border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Filters</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription>Filter events by property, platform, type, and date</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="properties">Properties</Label>
              <Select
                value={selectedProperties.length > 0 ? selectedProperties[0] : ""}
                onValueChange={(value) => setSelectedProperties(value ? [value] : [])}
              >
                <SelectTrigger id="properties">
                  <SelectValue placeholder="All properties" />
                </SelectTrigger>
                <SelectContent>
                  {properties.map((property: Property) => (
                    <SelectItem key={property._id} value={property._id}>
                      {property.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="platforms">Platforms</Label>
              <Select
                value={selectedPlatforms.length > 0 ? selectedPlatforms[0] : ""}
                onValueChange={(value) => setSelectedPlatforms(value === "all_platforms" ? [] : value ? [value] : [])}
              >
                <SelectTrigger id="platforms">
                  <SelectValue placeholder="All platforms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_platforms">All platforms</SelectItem>
                  <SelectItem value="Airbnb">Airbnb</SelectItem>
                  <SelectItem value="Booking">Booking.com</SelectItem>
                  <SelectItem value="Expedia">Expedia</SelectItem>
                  <SelectItem value="TripAdvisor">TripAdvisor</SelectItem>
                  <SelectItem value="Vrbo">Vrbo</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="event-types">Event Types</Label>
              <Select
                value={selectedEventTypes.length > 0 ? selectedEventTypes[0] : ""}
                onValueChange={(value) => setSelectedEventTypes(value === "all_types" ? [] : value ? [value] : [])}
              >
                <SelectTrigger id="event-types">
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_types">All types</SelectItem>
                  <SelectItem value="booking">Booking</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Date Range</Label>
              <CalendarRange 
                value={dateRange} 
                onChange={(value) => setDateRange(value)}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
