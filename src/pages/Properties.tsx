
import React from "react";
import { usePropertiesPage } from "@/hooks/properties/usePropertiesPage";
import { PropertyPageHeader } from "@/components/properties/PropertyPageHeader";
import { PropertyView } from "@/components/properties/PropertyView";
import { PropertyError } from "@/components/properties/PropertyError";

export default function Properties() {
  const {
    properties,
    pagination,
    isLoading,
    error,
    viewMode,
    setViewMode,
    propertyType,
    setPropertyType,
    city,
    setCity,
    sortOption,
    setSortOption,
    isFilterOpen,
    setIsFilterOpen,
    handlePageChange,
    handleFilterReset,
    handleRefresh,
    handlePropertyDeleted,
  } = usePropertiesPage();

  if (error) {
    return <PropertyError onRetry={handleRefresh} />;
  }

  return (
    <div className="space-y-6">
      <PropertyPageHeader 
        propertyType={propertyType}
        setPropertyType={setPropertyType}
        city={city}
        setCity={setCity}
        sortOption={sortOption}
        setSortOption={setSortOption}
        onReset={handleFilterReset}
        onRefresh={handleRefresh}
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
      />
      
      <PropertyView 
        properties={properties}
        isLoading={isLoading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onPropertyDeleted={handlePropertyDeleted}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />
    </div>
  );
}
