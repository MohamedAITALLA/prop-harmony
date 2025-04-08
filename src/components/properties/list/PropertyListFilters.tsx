
import React from 'react';
import { TypeFilter } from './TypeFilter';
import { PropertyFiltersPopover } from './PropertyFiltersPopover';
import { FilterBadges } from './FilterBadges';
import { ViewModeSwitcher } from './ViewModeSwitcher';

interface PropertyListFiltersProps {
  propertyTypeFilter: string;
  cityFilter: string;
  viewMode: 'grid' | 'list';
  pageSize: number;
  activeFiltersCount: number;
  onPropertyTypeChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onPageSizeChange: (size: number) => void;
  onResetFilters: () => void;
  onClearPropertyType: () => void;
  onClearCity: () => void;
}

export function PropertyListFilters({
  propertyTypeFilter,
  cityFilter,
  viewMode,
  pageSize,
  activeFiltersCount,
  onPropertyTypeChange,
  onCityChange,
  onViewModeChange,
  onPageSizeChange,
  onResetFilters,
  onClearPropertyType,
  onClearCity
}: PropertyListFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <TypeFilter 
          propertyType={propertyTypeFilter} 
          onPropertyTypeChange={onPropertyTypeChange} 
        />
        
        <PropertyFiltersPopover
          propertyType={propertyTypeFilter}
          onPropertyTypeChange={onPropertyTypeChange}
          cityFilter={cityFilter}
          onCityChange={onCityChange}
          pageSize={pageSize}
          onPageSizeChange={onPageSizeChange}
          onResetFilters={onResetFilters}
          activeFiltersCount={activeFiltersCount}
        />
        
        <FilterBadges
          propertyType={propertyTypeFilter}
          cityFilter={cityFilter}
          onClearPropertyType={onClearPropertyType}
          onClearCity={onClearCity}
        />
      </div>
      
      <ViewModeSwitcher 
        viewMode={viewMode} 
        onViewModeChange={onViewModeChange} 
      />
    </div>
  );
}
