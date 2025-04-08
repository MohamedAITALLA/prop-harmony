
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProperties } from "@/hooks/properties/useProperties";
import { usePropertyListState } from './hooks/usePropertyListState';
import { PropertyListHeader } from './list/PropertyListHeader';
import { PropertyListFilters } from './list/PropertyListFilters';
import { PropertyListResults } from './list/PropertyListResults';
import { PropertyListPagination } from './list/PropertyListPagination';
import { Property } from '@/types/api-responses';

interface PropertyListProps {
  properties?: any[];
  isLoading?: boolean;
  error?: any;
  viewMode?: 'grid' | 'list' | 'table';
  pagination?: {
    total: number;
    page: number;
    pages: number;
    limit?: number;
  };
  summary?: {
    total_properties: number;
    by_property_type: Record<string, number>;
    by_city: Record<string, number>;
    applied_filters: Record<string, any>;
  };
  onPageChange?: (page: number) => void;
  onPropertyDeleted?: (propertyId: string) => void;
}

export function PropertyList({ 
  properties: propProperties, 
  isLoading: propIsLoading,
  viewMode: propViewMode = 'grid',
  pagination: propPagination,
  summary,
  onPageChange: propOnPageChange,
  onPropertyDeleted
}: PropertyListProps) {
  const navigate = useNavigate();
  
  const {
    searchQuery,
    propertyTypeFilter,
    cityFilter,
    currentPage,
    pageSize,
    viewMode,
    activeFiltersCount,
    handleSearchChange,
    handleTypeFilterChange,
    handleCityFilterChange,
    handleViewModeChange,
    handlePageChange,
    handlePageSizeChange,
    handleResetFilters
  } = usePropertyListState();

  const { 
    properties: fetchedProperties, 
    isLoading, 
    pagination
  } = useProperties({
    page: currentPage,
    limit: pageSize,
    search: searchQuery,
    property_type: propertyTypeFilter === 'all' ? undefined : propertyTypeFilter,
    city: cityFilter === 'all_cities' ? undefined : cityFilter
  });

  const displayProperties = propProperties || fetchedProperties;
  const isLoadingProperties = propIsLoading !== undefined ? propIsLoading : isLoading;
  const displayPagination = propPagination || pagination;

  const handlePropertyClick = useCallback((property: Property) => {
    navigate(`/properties/${property._id || property.id}`);
  }, [navigate]);

  const handlePageChangeWrapper = useCallback((page: number) => {
    handlePageChange(page);
    if (propOnPageChange) {
      propOnPageChange(page);
    }
  }, [handlePageChange, propOnPageChange]);

  const handleAddPropertyClick = useCallback(() => {
    navigate('/properties/new');
  }, [navigate]);

  return (
    <div className="bg-white dark:bg-gray-950 rounded-lg p-6 shadow-sm border">
      <div className="flex flex-col gap-6">
        <PropertyListHeader
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onAddPropertyClick={handleAddPropertyClick}
        />
        
        <PropertyListFilters
          propertyTypeFilter={propertyTypeFilter}
          cityFilter={cityFilter}
          viewMode={viewMode}
          pageSize={pageSize}
          activeFiltersCount={activeFiltersCount}
          onPropertyTypeChange={handleTypeFilterChange}
          onCityChange={handleCityFilterChange}
          onViewModeChange={handleViewModeChange}
          onPageSizeChange={handlePageSizeChange}
          onResetFilters={handleResetFilters}
          onClearPropertyType={() => handleTypeFilterChange('all')}
          onClearCity={() => handleCityFilterChange('all_cities')}
        />
        
        <PropertyListResults
          properties={displayProperties}
          isLoading={isLoadingProperties}
          viewMode={viewMode}
          pagination={displayPagination}
          onResetFilters={handleResetFilters}
          onPropertyClick={handlePropertyClick}
        />
        
        {displayPagination && displayPagination.pages > 1 && (
          <PropertyListPagination
            currentPage={displayPagination.page}
            totalPages={displayPagination.pages}
            pageSize={pageSize}
            onPageChange={handlePageChangeWrapper}
            onPageSizeChange={handlePageSizeChange}
          />
        )}
      </div>
    </div>
  );
}
