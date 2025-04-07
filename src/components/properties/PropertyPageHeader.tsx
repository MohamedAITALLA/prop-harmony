
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Filter, Plus, RefreshCw, Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PropertyType } from "@/types/enums";

interface PropertyPageHeaderProps {
  propertyType: string;
  setPropertyType: (value: string) => void;
  city: string;
  setCity: (value: string) => void;
  sortOption: string;
  setSortOption: (value: string) => void;
  isFilterOpen: boolean;
  setIsFilterOpen: (value: boolean) => void;
  onReset: () => void;
  onRefresh: () => void;
  summary?: {
    total_properties: number;
    by_property_type: Record<string, number>;
    by_city: Record<string, number>;
    applied_filters: Record<string, any>;
  };
}

export function PropertyPageHeader({
  propertyType,
  setPropertyType,
  city,
  setCity,
  sortOption,
  setSortOption,
  isFilterOpen,
  setIsFilterOpen,
  onReset,
  onRefresh,
  summary
}: PropertyPageHeaderProps) {
  const navigate = useNavigate();
  
  const hasActiveFilters = propertyType !== "all" || city !== "";
  
  const propertyTypeOptions = [
    { value: "all", label: "All Types" },
    { value: PropertyType.APARTMENT, label: "Apartment" },
    { value: PropertyType.HOUSE, label: "House" },
    { value: PropertyType.VILLA, label: "Villa" },
    { value: PropertyType.CABIN, label: "Cabin" },
    { value: PropertyType.HOTEL, label: "Hotel" },
    { value: PropertyType.ROOM, label: "Room" },
    { value: PropertyType.OTHER, label: "Other" },
  ];
  
  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "name_asc", label: "Name (A-Z)" },
    { value: "name_desc", label: "Name (Z-A)" },
    { value: "most_bookings", label: "Most Bookings" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Properties</h1>
          <p className="text-muted-foreground">
            {summary ? `Manage your ${summary.total_properties} properties` : 'Manage your properties'}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-1 rounded-full h-5 w-5 p-0 flex items-center justify-center">
                    !
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Filter Properties</SheetTitle>
              </SheetHeader>
              <div className="py-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="property-type">Property Type</Label>
                  <Select value={propertyType} onValueChange={setPropertyType}>
                    <SelectTrigger id="property-type">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      {propertyTypeOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                          {summary?.by_property_type && summary.by_property_type[option.value] && option.value !== "all" && (
                            <span className="ml-1 text-muted-foreground">
                              ({summary.by_property_type[option.value]})
                            </span>
                          )}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input 
                    id="city"
                    placeholder="Filter by city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                  {summary?.by_city && Object.keys(summary.by_city).length > 0 && (
                    <div className="pt-2">
                      <p className="text-sm text-muted-foreground mb-2">Popular cities:</p>
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(summary.by_city)
                          .sort(([, countA], [, countB]) => (countB as number) - (countA as number))
                          .slice(0, 5)
                          .map(([cityName, count]) => (
                            <Badge 
                              key={cityName} 
                              variant="outline" 
                              className="cursor-pointer"
                              onClick={() => setCity(cityName)}
                            >
                              {cityName} ({count})
                            </Badge>
                          ))
                        }
                      </div>
                    </div>
                  )}
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="sort-options">Sort By</Label>
                  <Select value={sortOption} onValueChange={setSortOption}>
                    <SelectTrigger id="sort-options">
                      <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="pt-4 space-y-2">
                  <Button 
                    onClick={onReset} 
                    variant="outline" 
                    className="w-full"
                    disabled={!hasActiveFilters}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Reset Filters
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          
          <Button variant="outline" size="icon" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          
          <Button onClick={() => navigate("/properties/new")}>
            <Plus className="mr-2 h-4 w-4" /> New Property
          </Button>
        </div>
      </div>
      
      {hasActiveFilters && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {propertyType !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {propertyTypeOptions.find(opt => opt.value === propertyType)?.label || propertyType}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 p-0 ml-1" 
                onClick={() => setPropertyType("all")}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {city && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {city}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 p-0 ml-1" 
                onClick={() => setCity("")}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-2 text-xs" 
            onClick={onReset}
          >
            Clear all
          </Button>
        </div>
      )}

      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-sm font-medium text-muted-foreground">Total Properties</div>
              <div className="text-2xl font-bold">{summary.total_properties}</div>
            </CardContent>
          </Card>
          
          {propertyType !== "all" && (
            <Card>
              <CardContent className="p-4">
                <div className="text-sm font-medium text-muted-foreground">
                  {propertyTypeOptions.find(opt => opt.value === propertyType)?.label || propertyType}
                </div>
                <div className="text-2xl font-bold">
                  {summary.by_property_type[propertyType] || 0}
                </div>
              </CardContent>
            </Card>
          )}
          
          {city && (
            <Card>
              <CardContent className="p-4">
                <div className="text-sm font-medium text-muted-foreground">Properties in {city}</div>
                <div className="text-2xl font-bold">
                  {summary.by_city[city] || 0}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
