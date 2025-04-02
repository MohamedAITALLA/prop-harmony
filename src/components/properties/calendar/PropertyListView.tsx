
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListSorter } from './list-view/ListSorter';
import { EventCard } from './list-view/EventCard';
import { SearchNotice } from './list-view/SearchNotice';
import { EmptyEventsList } from './list-view/EmptyEventsList';
import { LoadingSkeleton } from './list-view/LoadingSkeleton';
import { useListSorting } from './list-view/useListSorting';

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

  const handleEventClick = (event: any) => {
    if (onEventClick) {
      onEventClick({ event: { id: event.id } });
    }
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
          sortedEvents.map((event) => (
            <EventCard 
              key={event.id} 
              event={event} 
              onClick={() => handleEventClick(event)}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
};
