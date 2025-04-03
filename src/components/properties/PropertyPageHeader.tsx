
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PropertyFilters } from "./PropertyFilters";

interface PropertyPageHeaderProps {
  propertyType: string;
  setPropertyType: (value: string) => void;
  city: string;
  setCity: (value: string) => void;
  sortOption: string;
  setSortOption: (value: string) => void;
  onReset: () => void;
  onRefresh: () => void;
  isFilterOpen: boolean;
  setIsFilterOpen: (value: boolean) => void;
}

export function PropertyPageHeader({
  propertyType,
  setPropertyType, 
  city,
  setCity,
  sortOption,
  setSortOption,
  onReset,
  onRefresh,
  isFilterOpen,
  setIsFilterOpen
}: PropertyPageHeaderProps) {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Properties</h1>
          <p className="text-muted-foreground">
            Manage your property portfolio
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={onRefresh}
            title="Refresh properties"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          
          <PropertyFilters 
            propertyType={propertyType}
            setPropertyType={setPropertyType}
            city={city}
            setCity={setCity}
            sortOption={sortOption}
            setSortOption={setSortOption}
            onReset={onReset}
            isOpen={isFilterOpen}
            setIsOpen={setIsFilterOpen}
          />
          
          <Button 
            onClick={() => navigate("/properties/new")}
          >
            <Plus className="mr-2 h-4 w-4" /> New Property
          </Button>
        </div>
      </div>
    </>
  );
}
