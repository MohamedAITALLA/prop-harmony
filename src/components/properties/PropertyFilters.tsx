
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PropertyType } from "@/types/enums";
import { X, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PropertyFiltersProps {
  propertyType: string;
  setPropertyType: (value: string) => void;
  city: string;
  setCity: (value: string) => void;
  sortOption: string;
  setSortOption: (value: string) => void;
  onReset: () => void;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export function PropertyFilters({
  propertyType,
  setPropertyType,
  city,
  setCity,
  sortOption,
  setSortOption,
  onReset,
  isOpen,
  setIsOpen,
}: PropertyFiltersProps) {
  const activeFiltersCount = [
    propertyType !== "all_types" ? 1 : 0, 
    city ? 1 : 0, 
    sortOption !== "default" ? 1 : 0
  ].reduce((a, b) => a + b, 0);

  return (
    <>
      <Button 
        variant={isOpen ? "secondary" : "outline"}
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2"
      >
        <Filter className="h-4 w-4" /> 
        Filter
        {activeFiltersCount > 0 && (
          <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
            {activeFiltersCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <Card className="mb-4">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label htmlFor="property-type" className="text-sm font-medium block mb-2">Property Type</label>
                <Select 
                  value={propertyType} 
                  onValueChange={setPropertyType}
                >
                  <SelectTrigger id="property-type">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_types">All Types</SelectItem>
                    {Object.values(PropertyType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label htmlFor="city" className="text-sm font-medium block mb-2">City</label>
                <Input
                  id="city"
                  placeholder="Filter by city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="sort" className="text-sm font-medium block mb-2">Sort By</label>
                <Select 
                  value={sortOption} 
                  onValueChange={setSortOption}
                >
                  <SelectTrigger id="sort">
                    <SelectValue placeholder="Default" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="name_asc">Name (A-Z)</SelectItem>
                    <SelectItem value="name_desc">Name (Z-A)</SelectItem>
                    <SelectItem value="created_desc">Newest First</SelectItem>
                    <SelectItem value="created_asc">Oldest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={onReset}
                  className="gap-2"
                >
                  <X className="h-4 w-4" /> Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
