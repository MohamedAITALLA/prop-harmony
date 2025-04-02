
import React from "react";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { EventTypeBadge } from "@/components/ui/event-type-badge";
import { CalendarEvent } from "@/types/api-responses";

interface EventsTableProps {
  events: CalendarEvent[];
  filteredEvents: CalendarEvent[];
  isLoading: boolean;
  searchQuery: string;
}

export const EventsTable: React.FC<EventsTableProps> = ({ 
  events, 
  filteredEvents, 
  isLoading,
  searchQuery
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox aria-label="Select all" />
            </TableHead>
            <TableHead>Property</TableHead>
            <TableHead>Platform</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-10">Loading events...</TableCell>
            </TableRow>
          ) : filteredEvents.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-10">
                {searchQuery ? "No events matching your search" : "No events found"}
              </TableCell>
            </TableRow>
          ) : (
            filteredEvents.map((event) => (
              <TableRow key={event._id}>
                <TableCell>
                  <Checkbox aria-label={`Select ${event.summary}`} />
                </TableCell>
                <TableCell>{event.property?.name}</TableCell>
                <TableCell>{event.platform}</TableCell>
                <TableCell>{event.summary}</TableCell>
                <TableCell>{format(parseISO(event.start_date), 'MMM d, yyyy')}</TableCell>
                <TableCell>{format(parseISO(event.end_date), 'MMM d, yyyy')}</TableCell>
                <TableCell>
                  <EventTypeBadge eventType={event.event_type} />
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    event.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                    event.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {event.status}
                  </span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View</DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
