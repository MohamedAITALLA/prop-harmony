
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EventTypeBadge } from "@/components/ui/event-type-badge";
import { Badge } from "@/components/ui/badge";
import { PlatformIcon } from "@/components/ui/platform-icon";
import { DateRange } from "@/components/ui/date-range";
import { Separator } from "@/components/ui/separator";
import { format, parseISO } from 'date-fns';
import { CalendarEvent } from "@/types/api-responses";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Calendar, Clock, User, AlertCircle, MessageSquare, 
  Search, CalendarRange, Check 
} from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [sortField, setSortField] = useState<string>("start");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedEvents = [...events].sort((a, b) => {
    if (sortField === "start") {
      const dateA = new Date(a.start).getTime();
      const dateB = new Date(b.start).getTime();
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    }
    
    if (sortField === "title") {
      return sortDirection === "asc" 
        ? a.title.localeCompare(b.title) 
        : b.title.localeCompare(a.title);
    }
    
    if (sortField === "platform") {
      const platformA = a.extendedProps?.platform || "";
      const platformB = b.extendedProps?.platform || "";
      return sortDirection === "asc" 
        ? platformA.localeCompare(platformB) 
        : platformB.localeCompare(platformA);
    }
    
    return 0;
  });

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
          {[1, 2, 3, 4, 5].map((index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-24" />
              </div>
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Events List</span>
          <div className="flex items-center gap-2 text-sm font-normal">
            <span>Sort by:</span>
            <div className="flex gap-1">
              <Button 
                variant={sortField === "start" ? "secondary" : "ghost"} 
                size="sm"
                onClick={() => handleSort("start")}
                className="h-7 text-xs"
              >
                Date {sortField === "start" && (sortDirection === "asc" ? "↑" : "↓")}
              </Button>
              <Button 
                variant={sortField === "title" ? "secondary" : "ghost"} 
                size="sm"
                onClick={() => handleSort("title")}
                className="h-7 text-xs"
              >
                Title {sortField === "title" && (sortDirection === "asc" ? "↑" : "↓")}
              </Button>
              <Button 
                variant={sortField === "platform" ? "secondary" : "ghost"} 
                size="sm"
                onClick={() => handleSort("platform")}
                className="h-7 text-xs"
              >
                Platform {sortField === "platform" && (sortDirection === "asc" ? "↑" : "↓")}
              </Button>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 relative">
        {searchQuery && (
          <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-md mb-4">
            <Search className="h-4 w-4" />
            <span className="text-sm">
              Showing results for: <span className="font-medium">{searchQuery}</span>
            </span>
          </div>
        )}
        
        {sortedEvents.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            <CalendarRange className="mx-auto h-10 w-10 mb-2 opacity-20" />
            <p className="font-medium">No events found</p>
            <p className="text-sm mt-1">
              {searchQuery 
                ? "Try adjusting your search query or filters" 
                : "Try creating a new event or adjusting your filters"}
            </p>
          </div>
        ) : (
          sortedEvents.map((event) => (
            <div 
              key={event.id}
              className="border rounded-lg p-4 hover:bg-accent/5 transition-colors cursor-pointer group"
              onClick={() => handleEventClick(event)}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h3 className="font-medium text-lg group-hover:text-primary transition-colors">
                    {event.title}
                  </h3>
                  <div className="flex flex-wrap gap-2 items-center">
                    <EventTypeBadge eventType={event.extendedProps?.event_type} />
                    <div className="flex items-center gap-1">
                      <PlatformIcon platform={event.extendedProps?.platform} size={16} />
                      <span className="text-sm text-muted-foreground">
                        {event.extendedProps?.platform || "Unknown"}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <DateRange startDate={event.start} endDate={event.end} />
                </div>
              </div>
              
              <Separator className="my-3" />
              
              <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(event.start), 'MMM dd, yyyy')}</span>
                  <span className="mx-1">→</span>
                  <span>{format(new Date(event.end), 'MMM dd, yyyy')}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>
                    {Math.ceil((new Date(event.end).getTime() - new Date(event.start).getTime()) / (1000 * 60 * 60 * 24))} days
                  </span>
                </div>
                
                {event.extendedProps?.status && (
                  <div className={cn(
                    "flex items-center gap-1",
                    event.extendedProps.status === "conflict" && "text-destructive"
                  )}>
                    {event.extendedProps.status === "conflict" ? (
                      <AlertCircle className="h-4 w-4" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                    <span className="capitalize">{event.extendedProps.status}</span>
                  </div>
                )}
              </div>
              
              {event.extendedProps?.description && (
                <div className="mt-3 pt-3 border-t text-sm">
                  <div className="flex items-start gap-1">
                    <MessageSquare className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground line-clamp-2">
                      {event.extendedProps.description}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
