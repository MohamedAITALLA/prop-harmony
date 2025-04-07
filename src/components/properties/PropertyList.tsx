import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { PropertyCard } from "@/components/properties/PropertyCard";
import { PropertyType } from "@/types/enums";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useProperties } from "@/hooks/properties/useProperties";
import { AdvancedPagination } from "@/components/ui/advanced-pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Plus, Filter } from 'lucide-react';

interface PropertyListProps {
  properties?: any[];
  isLoading?: boolean;
  error?: any;
}

export function PropertyList({ properties, isLoading, error }: PropertyListProps) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get('search') || '');
  const [propertyTypeFilter, setPropertyTypeFilter] = useState<string>(searchParams.get('type') || 'all');
  const [currentPage, setCurrentPage] = useState<number>(Number(searchParams.get('page')) || 1);
  const [pageSize] = useState<number>(12);

  const { 
    properties: fetchedProperties, 
    isLoading: isPropertiesLoading, 
    error: propertiesError,
    totalPages,
    onPageChange
  } = useProperties({
    page: currentPage,
    limit: pageSize,
    search: searchQuery,
    property_type: propertyTypeFilter === 'all' ? undefined : propertyTypeFilter,
  });

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
    newParams.set('page', currentPage.toString());
    setSearchParams(newParams);
  }, [searchQuery, propertyTypeFilter, currentPage, setSearchParams, searchParams]);

  const handlePropertyClick = (id: string) => {
    navigate(`/properties/${id}`);
  };

  const filteredProperties = useMemo(() => {
    return fetchedProperties;
  }, [fetchedProperties]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleTypeFilterChange = (value: string) => {
    setPropertyTypeFilter(value);
    setCurrentPage(1);
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
    onPageChange(page);
  };

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search properties..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-8"
          />
        </div>

        <div className="flex items-center gap-2">
          <Select value={propertyTypeFilter} onValueChange={handleTypeFilterChange}>
            <SelectTrigger className="w-[180px]">
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
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button onClick={() => navigate('/properties/new')}><Plus className="w-4 h-4 mr-2" /> Add Property</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isPropertiesLoading ? (
          <>
            <Skeleton className="h-[200px] w-full rounded-md" />
            <Skeleton className="h-[200px] w-full rounded-md" />
            <Skeleton className="h-[200px] w-full rounded-md" />
          </>
        ) : filteredProperties && filteredProperties.length > 0 ? (
          filteredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onClick={() => handlePropertyClick(property.id)}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">No properties found.</p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <AdvancedPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageClick}
          />
        </div>
      )}
    </div>
  );
}
