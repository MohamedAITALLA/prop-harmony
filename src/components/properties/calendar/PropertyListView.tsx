
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListSorter } from './list-view/ListSorter';
import { EventCard } from './list-view/EventCard';
import { SearchNotice } from './list-view/SearchNotice';
import { EmptyEventsList } from './list-view/EmptyEventsList';
import { LoadingSkeleton } from './list-view/LoadingSkeleton';
import { useListSorting } from './list-view/useListSorting';
import { AdvancedPagination } from '@/components/ui/advanced-pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PropertyListViewProps {
  events: any[];
  isLoading: boolean;
  propertyId: string;
  onEventClick?: (eventInfo: any) => void;
  searchQuery?: string;
}

export const PropertyListView: React.FC<PropertyListViewProps> = ({
  events,
  isLoading,
  propertyId,
  onEventClick,
  searchQuery = ""
}) => {
  const { sortField, sortDirection, handleSort, sortedEvents } = useListSorting(events);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const handleEventClick = (event: any) => {
    if (onEventClick) {
      onEventClick({ event: { id: event.id } });
    }
  };

  // Calculate pagination
  const indexOfLastEvent = currentPage * itemsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - itemsPerPage;
  const currentEvents = sortedEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(sortedEvents.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Events List</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <LoadingSkeleton />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Events List</span>
          <ListSorter 
            sortField={sortField}
            sortDirection={sortDirection}
            handleSort={handleSort}
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 relative">
        <SearchNotice searchQuery={searchQuery} />
        
        {sortedEvents.length === 0 ? (
          <EmptyEventsList searchQuery={searchQuery} />
        ) : (
          <>
            {/* Pagination controls moved above the scrollable area */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Show</span>
                <Select
                  value={String(itemsPerPage)}
                  onValueChange={handleItemsPerPageChange}
                >
                  <SelectTrigger className="w-[80px] h-9 text-center">
                    <SelectValue placeholder={itemsPerPage} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground">per page</span>
              </div>
              
              <AdvancedPagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
            
            {/* Scrollable events area with fixed height */}
            <ScrollArea className="h-[400px] rounded-md border">
              <div className="space-y-4 p-4">
                {currentEvents.map((event) => (
                  <EventCard 
                    key={event.id} 
                    event={event} 
                    onClick={() => handleEventClick(event)}
                  />
                ))}
              </div>
            </ScrollArea>
          </>
        )}
      </CardContent>
    </Card>
  );
};
