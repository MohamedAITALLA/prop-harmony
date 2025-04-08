
import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export function usePropertyListState() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get('search') || '');
  const [propertyTypeFilter, setPropertyTypeFilter] = useState<string>(searchParams.get('type') || 'all');
  const [cityFilter, setCityFilter] = useState<string>(searchParams.get('city') || 'all_cities');
  const [currentPage, setCurrentPage] = useState<number>(Number(searchParams.get('page')) || 1);
  const [pageSize, setPageSize] = useState<number>(Number(searchParams.get('limit')) || 12);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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
  }, [searchQuery, propertyTypeFilter, cityFilter, currentPage, pageSize, searchParams, setSearchParams]);

  useEffect(() => {
    updateSearchParams();
  }, [updateSearchParams]);

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
  }, []);

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

  return {
    searchQuery,
    propertyTypeFilter,
    cityFilter,
    currentPage,
    pageSize,
    viewMode,
    activeFiltersCount,
    setViewMode,
    handleSearchChange,
    handleTypeFilterChange,
    handleCityFilterChange,
    handleViewModeChange,
    handlePageChange,
    handlePageSizeChange,
    handleResetFilters
  };
}
