
import React from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { PropertyType } from "@/types/enums";

interface PropertyFiltersPopoverProps {
  propertyType: string;
  onPropertyTypeChange: (value: string) => void;
  cityFilter: string;
  onCityChange: (value: string) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  onResetFilters: () => void;
  activeFiltersCount: number;
}

export function PropertyFiltersPopover({
  propertyType,
  onPropertyTypeChange,
  cityFilter,
  onCityChange,
  pageSize,
  onPageSizeChange,
  onResetFilters,
  activeFiltersCount
}: PropertyFiltersPopoverProps) {
  const cities = [
    'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix',
    'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Francisco',
    'Miami', 'Seattle', 'Las Vegas', 'Denver', 'Boston'
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <SlidersHorizontal className="h-4 w-4 mr-2" /> 
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2 px-1 py-0 h-5 rounded-full">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Filters</h4>
            <p className="text-sm text-muted-foreground">
              Filter properties by different criteria
            </p>
          </div>
          <Separator />
          <div className="grid gap-2">
            <Label htmlFor="property-type">Property Type</Label>
            <Select value={propertyType} onValueChange={onPropertyTypeChange}>
              <SelectTrigger id="property-type">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value={PropertyType.APARTMENT}>Apartment</SelectItem>
                <SelectItem value={PropertyType.HOUSE}>House</SelectItem>
                <SelectItem value={PropertyType.VILLA}>Villa</SelectItem>
                <SelectItem value={PropertyType.CONDO}>Condo</SelectItem>
                <SelectItem value={PropertyType.CABIN}>Cabin</SelectItem>
                <SelectItem value={PropertyType.ROOM}>Room</SelectItem>
                <SelectItem value={PropertyType.HOTEL}>Hotel</SelectItem>
                <SelectItem value={PropertyType.OTHER}>Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="city">City</Label>
            <Select value={cityFilter} onValueChange={onCityChange}>
              <SelectTrigger id="city">
                <SelectValue placeholder="All Cities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_cities">All Cities</SelectItem>
                {cities.map(city => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="limit">Results per page</Label>
            <Select value={pageSize.toString()} onValueChange={(val) => onPageSizeChange(Number(val))}>
              <SelectTrigger id="limit">
                <SelectValue placeholder="12" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6">6</SelectItem>
                <SelectItem value="12">12</SelectItem>
                <SelectItem value="24">24</SelectItem>
                <SelectItem value="48">48</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" onClick={onResetFilters}>Reset Filters</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
