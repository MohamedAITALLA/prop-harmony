import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useProperties } from "@/hooks/properties/useProperties";
import { SearchBar } from './list/SearchBar';
import { ViewModeSwitcher } from './list/ViewModeSwitcher';
import { PropertyFiltersPopover } from './list/PropertyFiltersPopover';
import { TypeFilter } from './list/TypeFilter';
import { FilterBadges } from './list/FilterBadges';
import { PropertyListResults } from './list/PropertyListResults';
import { PropertyListPagination } from './list/PropertyListPagination';
import { AddPropertyButton } from './list/AddPropertyButton';

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
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get('search') || '');
  const [propertyTypeFilter, setPropertyTypeFilter] = useState<string>(searchParams.get('type') || 'all');
  const [cityFilter, setCityFilter] = useState<string>(searchParams.get('city') || 'all_cities');
  const [currentPage, setCurrentPage] = useState<number>(Number(searchParams.get('page')) || 1);
  const [pageSize, setPageSize] = useState<number>(Number(searchParams.get('limit')) || 12);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(
    propViewMode === 'table' ? 'grid' : propViewMode as 'grid' | 'list'
  );

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

  const updateSearchParams = useCallback(() => {
    const newParams = new URLSearchParams(searchParams);
    if (searchQuery) {
      newParams.set('search', searchQuery);
    } else {
      newParams.delete('search');
    }
    if (propertyTypeFilter !== 'all') {
      newParams.set('type', propertyTypeFilter);
    } else {
      newParams.delete('type');
    }
    if (cityFilter !== 'all_cities') {
      newParams.set('city', cityFilter);
    } else {
      newParams.delete('city');
    }
    newParams.set('page', currentPage.toString());
    newParams.set('limit', pageSize.toString());
    setSearchParams(newParams);
  }, [searchQuery, propertyTypeFilter, cityFilter, currentPage, pageSize, setSearchParams]);

  useEffect(() => {
    updateSearchParams();
  }, [updateSearchParams]);

  const handlePropertyClick = useCallback((id: string) => {
    navigate(`/properties/${id}`);
  }, [navigate]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleTypeFilterChange = useCallback((value: string) => {
    setPropertyTypeFilter(value);
    setCurrentPage(1);
  }, []);

  const handleCityFilterChange = useCallback((value: string) => {
    setCityFilter(value);
    setCurrentPage(1);
  }, []);

  const handleViewModeChange = useCallback((mode: 'grid' | 'list') => {
    setViewMode(mode);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    if (propOnPageChange) {
      propOnPageChange(page);
    }
  }, [propOnPageChange]);

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  }, []);

  const handleResetFilters = useCallback(() => {
    setSearchQuery('');
    setPropertyTypeFilter('all');
    setCityFilter('all_cities');
    setCurrentPage(1);
  }, []);

  const activeFiltersCount = 
    (propertyTypeFilter !== 'all' ? 1 : 0) + 
    (cityFilter !== 'all_cities' ? 1 : 0);

  return (
    <div className="bg-white dark:bg-gray-950 rounded-lg p-6 shadow-sm border">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <SearchBar 
            searchQuery={searchQuery} 
            onSearchChange={handleSearchChange} 
          />
          
          <AddPropertyButton onClick={() => navigate('/properties/new')} />
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <TypeFilter 
              propertyType={propertyTypeFilter} 
              onPropertyTypeChange={handleTypeFilterChange} 
            />
            
            <PropertyFiltersPopover
              propertyType={propertyTypeFilter}
              onPropertyTypeChange={handleTypeFilterChange}
              cityFilter={cityFilter}
              onCityChange={handleCityFilterChange}
              pageSize={pageSize}
              onPageSizeChange={handlePageSizeChange}
              onResetFilters={handleResetFilters}
              activeFiltersCount={activeFiltersCount}
            />
            
            <FilterBadges
              propertyType={propertyTypeFilter}
              cityFilter={cityFilter}
              onClearPropertyType={() => setPropertyTypeFilter('all')}
              onClearCity={() => setCityFilter('all_cities')}
            />
          </div>
          
          <ViewModeSwitcher 
            viewMode={viewMode} 
            onViewModeChange={handleViewModeChange} 
          />
        </div>
        
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
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        )}
      </div>
    </div>
  );
}
