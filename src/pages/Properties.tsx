
import React from "react";
import { usePropertiesPage } from "@/hooks/properties/usePropertiesPage";
import { PropertyView } from "@/components/properties/PropertyView";
import { PropertyError } from "@/components/properties/PropertyError";

export default function Properties() {
  const {
    properties,
    pagination,
    summary,
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
      <PropertyView 
        properties={properties}
        isLoading={isLoading}
        pagination={pagination}
        summary={summary}
        onPageChange={handlePageChange}
        onPropertyDeleted={handlePropertyDeleted}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />
    </div>
  );
}
