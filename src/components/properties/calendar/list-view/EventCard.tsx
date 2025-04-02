
import React from 'react';
import { EventTypeBadge } from "@/components/ui/event-type-badge";
import { PlatformIcon } from "@/components/ui/platform-icon";
import { DateRange } from "@/components/ui/date-range";
import { Separator } from "@/components/ui/separator";
import { format } from 'date-fns';
import { cn } from "@/lib/utils";
import { Calendar, Clock, AlertCircle, MessageSquare, Check } from "lucide-react";

interface EventCardProps {
  event: any;
  onClick: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
  return (
    <div 
      className="border rounded-lg p-4 hover:bg-accent/5 transition-colors cursor-pointer group"
      onClick={onClick}
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
  );
};
