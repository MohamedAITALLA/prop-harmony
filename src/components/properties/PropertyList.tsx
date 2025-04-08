import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { Search, Plus, Filter, SlidersHorizontal, Grid3X3, List } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PropertyType } from "@/types/enums";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProperties } from "@/hooks/properties/useProperties";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PropertyCard } from './PropertyCard';
import { AdvancedPagination } from '../ui/advanced-pagination';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '../ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface PropertyListProps {
  properties?: any[];
  isLoading?: boolean;
  error?: any;
}

export function PropertyList({ properties: propProperties, isLoading: propIsLoading }: PropertyListProps) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get('search') || '');
  const [propertyTypeFilter, setPropertyTypeFilter] = useState<string>(searchParams.get('type') || 'all');
  const [cityFilter, setCityFilter] = useState<string>(searchParams.get('city') || '');
  const [currentPage, setCurrentPage] = useState<number>(Number(searchParams.get('page')) || 1);
  const [pageSize, setPageSize] = useState<number>(Number(searchParams.get('limit')) || 12);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { 
    properties: fetchedProperties, 
    isLoading, 
    error,
    totalPages,
    refetch,
    pagination
  } = useProperties({
    page: currentPage,
    limit: pageSize,
    search: searchQuery,
    property_type: propertyTypeFilter === 'all' ? undefined : propertyTypeFilter,
    city: cityFilter || undefined
  });

  const displayProperties = propProperties || fetchedProperties;
  const isLoadingProperties = propIsLoading !== undefined ? propIsLoading : isLoading;

  useEffect(() => {
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
    if (cityFilter) {
      newParams.set('city', cityFilter);
    } else {
      newParams.delete('city');
    }
    newParams.set('page', currentPage.toString());
    newParams.set('limit', pageSize.toString());
    setSearchParams(newParams);
  }, [searchQuery, propertyTypeFilter, cityFilter, currentPage, pageSize, setSearchParams, searchParams]);

  const handlePropertyClick = (id: string) => {
    navigate(`/properties/${id}`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleTypeFilterChange = (value: string) => {
    setPropertyTypeFilter(value);
    setCurrentPage(1);
  };

  const handleCityFilterChange = (value: string) => {
    setCityFilter(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setPropertyTypeFilter('all');
    setCityFilter('');
    setCurrentPage(1);
  };

  const cities = [
    'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix',
    'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Francisco',
    'Miami', 'Seattle', 'Las Vegas', 'Denver', 'Boston'
  ];

  return (
    <div className="bg-white dark:bg-gray-950 rounded-lg p-6 shadow-sm border">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div className="relative w-full md:max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search properties by name, location..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-9 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 focus-visible:ring-primary/20"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={() => navigate('/properties/new')} className="bg-primary hover:bg-primary/90 text-white">
                    <Plus className="w-4 h-4 mr-1" /> Add Property
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add a new property to your collection</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Select value={propertyTypeFilter} onValueChange={handleTypeFilterChange}>
              <SelectTrigger className="w-[150px] bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
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
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                  <SlidersHorizontal className="h-4 w-4 mr-2" /> 
                  Filters
                  {(propertyTypeFilter !== 'all' || cityFilter) && (
                    <Badge variant="secondary" className="ml-2 px-1 py-0 h-5 rounded-full">
                      {((propertyTypeFilter !== 'all' ? 1 : 0) + (cityFilter ? 1 : 0))}
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
                    <Select value={propertyTypeFilter} onValueChange={handleTypeFilterChange}>
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
                    <Select value={cityFilter} onValueChange={handleCityFilterChange}>
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
                    <Select value={pageSize.toString()} onValueChange={(val) => handlePageSizeChange(Number(val))}>
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
                  <Button variant="outline" onClick={handleResetFilters}>Reset Filters</Button>
                </div>
              </PopoverContent>
            </Popover>
            
            <div className="flex flex-wrap gap-2">
              {propertyTypeFilter !== 'all' && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <span>Type: {propertyTypeFilter}</span>
                  <button 
                    onClick={() => setPropertyTypeFilter('all')} 
                    className="ml-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 h-4 w-4 inline-flex items-center justify-center"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {cityFilter && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <span>City: {cityFilter}</span>
                  <button 
                    onClick={() => setCityFilter('')} 
                    className="ml-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 h-4 w-4 inline-flex items-center justify-center"
                  >
                    ×
                  </button>
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'grid' | 'list')} className="w-[180px]">
              <TabsList className="grid w-full grid-cols-2 h-9">
                <TabsTrigger value="grid" className="flex items-center gap-1 px-3">
                  <Grid3X3 className="h-4 w-4" />
                  <span>Grid</span>
                </TabsTrigger>
                <TabsTrigger value="list" className="flex items-center gap-1 px-3">
                  <List className="h-4 w-4" />
                  <span>List</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        {!isLoadingProperties && displayProperties && (
          <div className="flex justify-between items-center text-sm text-muted-foreground border-b pb-3">
            <div>
              Showing {displayProperties.length} properties
              {pagination && ` of ${pagination.total}`}
            </div>
            {pagination && (
              <div>
                Page {pagination.page} of {pagination.pages}
              </div>
            )}
          </div>
        )}
        
        {isLoadingProperties ? (
          <div className={viewMode === 'grid' ? "grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3" : "space-y-4"}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={viewMode === 'grid' ? "" : "flex"}>
                <Skeleton className={viewMode === 'grid' ? "h-[300px] w-full rounded-lg" : "h-[150px] w-[250px] rounded-lg flex-shrink-0"} />
                {viewMode === 'list' && (
                  <div className="ml-4 flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : displayProperties && displayProperties.length > 0 ? (
          <div className={viewMode === 'grid' 
            ? "grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3" 
            : "space-y-4"}>
            {displayProperties.map((property) => (
              <PropertyCard
                key={property.id || property._id}
                property={property}
                viewMode={viewMode}
                onClick={() => handlePropertyClick(property.id || property._id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 dark:bg-gray-900 rounded-lg border border-dashed">
            <div className="flex flex-col items-center space-y-2">
              <div className="rounded-full bg-primary/10 p-3">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium">No properties found</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                We couldn't find any properties that match your search criteria. Try adjusting your filters or add a new property.
              </p>
              <div className="mt-4 flex space-x-2">
                <Button variant="outline" onClick={handleResetFilters}>
                  Reset Filters
                </Button>
                <Button onClick={() => navigate('/properties/new')}>
                  <Plus className="w-4 h-4 mr-2" /> Add Property
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {pagination && pagination.pages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex flex-col items-center gap-2">
              <AdvancedPagination
                currentPage={currentPage}
                totalPages={pagination.pages}
                onPageChange={handlePageChange}
                className="mt-2"
              />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Show</span>
                <Select value={pageSize.toString()} onValueChange={(val) => handlePageSizeChange(Number(val))}>
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue placeholder="12" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">6</SelectItem>
                    <SelectItem value="12">12</SelectItem>
                    <SelectItem value="24">24</SelectItem>
                    <SelectItem value="48">48</SelectItem>
                  </SelectContent>
                </Select>
                <span>per page</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
