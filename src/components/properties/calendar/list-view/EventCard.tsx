
import React from 'react';
import { EventTypeBadge } from "@/components/ui/event-type-badge";
import { PlatformIcon } from "@/components/ui/platform-icon";
import { DateRange } from "@/components/ui/date-range";
import { Separator } from "@/components/ui/separator";
import { format } from 'date-fns';
import { cn } from "@/lib/utils";
import { Calendar, Clock, AlertCircle, MessageSquare, Check, CalendarDays } from "lucide-react";

interface EventCardProps {
  event: any;
  onClick: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
  return (
    <div 
      className="border border-border/50 rounded-lg p-4 hover:bg-accent/10 transition-colors cursor-pointer group bg-card shadow-sm"
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h3 className="font-medium text-lg group-hover:text-primary transition-colors">
            {event.title}
          </h3>
          <div className="flex flex-wrap gap-2 items-center">
            <EventTypeBadge eventType={event.extendedProps?.event_type} />
            <div className="flex items-center gap-1.5 bg-muted/40 px-2 py-0.5 rounded-full">
              <PlatformIcon platform={event.extendedProps?.platform} size={14} />
              <span className="text-xs font-medium">
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
      
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <CalendarDays className="h-3.5 w-3.5 text-primary/70" />
          <span>{format(new Date(event.start), 'MMM dd')} - {format(new Date(event.end), 'MMM dd, yyyy')}</span>
        </div>
        
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Clock className="h-3.5 w-3.5 text-primary/70" />
          <span>
            {Math.ceil((new Date(event.end).getTime() - new Date(event.start).getTime()) / (1000 * 60 * 60 * 24))} days
          </span>
        </div>
        
        {event.extendedProps?.status && (
          <div className={cn(
            "flex items-center gap-1.5",
            event.extendedProps.status === "conflict" ? "text-destructive" : "text-muted-foreground"
          )}>
            {event.extendedProps.status === "conflict" ? (
              <AlertCircle className="h-3.5 w-3.5" />
            ) : (
              <Check className="h-3.5 w-3.5 text-green-500" />
            )}
            <span className="capitalize">{event.extendedProps.status}</span>
          </div>
        )}
      </div>
      
      {event.extendedProps?.description && (
        <div className="mt-3 pt-3 border-t border-border/30">
          <div className="flex items-start gap-2">
            <MessageSquare className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-primary/70" />
            <span className="text-sm text-muted-foreground line-clamp-2">
              {event.extendedProps.description}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
