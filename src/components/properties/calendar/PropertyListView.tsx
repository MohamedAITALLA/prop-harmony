
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
import { CalendarRange } from "lucide-react";

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
      <Card className="shadow-md border-border/40">
        <CardHeader className="bg-muted/30">
          <CardTitle>Events List</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <LoadingSkeleton />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md border-border/40">
      <CardHeader className="bg-muted/30 pb-4">
        <CardTitle className="flex justify-between items-center text-xl">
          <div className="flex items-center gap-2">
            <CalendarRange className="h-5 w-5 text-primary" />
            <span>Events List</span>
          </div>
          <ListSorter 
            sortField={sortField}
            sortDirection={sortDirection}
            handleSort={handleSort}
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 relative pt-6">
        <SearchNotice searchQuery={searchQuery} />
        
        {sortedEvents.length === 0 ? (
          <EmptyEventsList searchQuery={searchQuery} />
        ) : (
          <>
            {/* Pagination controls above the scrollable area */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4 bg-muted/20 p-3 rounded-md">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">Display</span>
                <Select
                  value={String(itemsPerPage)}
                  onValueChange={handleItemsPerPageChange}
                >
                  <SelectTrigger className="w-[70px] h-8 text-center bg-background border-input/80">
                    <SelectValue placeholder={itemsPerPage} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm font-medium text-muted-foreground">events per page</span>
              </div>
              
              <AdvancedPagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                className="mt-0"
              />
            </div>
            
            {/* Scrollable events area with fixed height */}
            <ScrollArea className="h-[400px] rounded-lg border border-border/50 bg-card">
              <div className="space-y-3 p-4">
                {currentEvents.map((event) => (
                  <EventCard 
                    key={event.id} 
                    event={event} 
                    onClick={() => handleEventClick(event)}
                  />
                ))}
              </div>
            </ScrollArea>
            
            <div className="flex justify-between items-center text-xs text-muted-foreground pt-2 px-1">
              <span>Showing {indexOfFirstEvent + 1}-{Math.min(indexOfLastEvent, sortedEvents.length)} of {sortedEvents.length} events</span>
              <span>Page {currentPage} of {totalPages}</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
