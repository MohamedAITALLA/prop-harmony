
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { propertyService } from '@/services/api-service';

interface UsePropertiesParams {
  page: number;
  limit: number;
  search?: string;
  property_type?: string;
}

export function useProperties({ page, limit, search, property_type }: UsePropertiesParams) {
  const [totalPages, setTotalPages] = useState<number>(1);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['properties', page, limit, search, property_type],
    queryFn: async () => {
      const params: any = {
        page,
        limit,
      };

      if (search) {
        params.search = search;
      }

      if (property_type) {
        params.property_type = property_type;
      }

      return propertyService.getAllProperties(params);
    },
  });

  useEffect(() => {
    if (data?.data?.pagination) {
      setTotalPages(data.data.pagination.pages || 1);
    }
  }, [data]);

  const onPageChange = (newPage: number) => {
    // This is handled by the parent component setting the page state
    // which will trigger a refetch through the queryKey change
  };

  return {
    properties: data?.data?.properties || [],
    isLoading,
    error,
    totalPages,
    onPageChange,
    refetch,
  };
}
