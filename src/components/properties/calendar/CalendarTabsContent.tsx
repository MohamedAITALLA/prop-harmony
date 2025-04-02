
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, List, CheckCircle2 } from "lucide-react";
import { CalendarContainer } from '@/components/properties/calendar/CalendarContainer';
import { PropertyListView } from "@/components/properties/calendar/PropertyListView";
import { PropertyValidityCheck } from "@/components/properties/calendar/PropertyValidityCheck";

interface CalendarTabsContentProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  events: any[];
  formattedEvents: any[];
  eventsLoading: boolean;
  propertyId: string;
  handleDateClick: (info: any) => void;
  handleEventClick: (info: any) => void;
  currentDate: Date;
  handleCalendarNavigation: (action: 'prev' | 'next' | 'today') => void;
  searchQuery: string;
  hasConflicts?: boolean;
  onViewConflicts?: () => void;
  onAddEvent?: () => void;
  onExport?: (format: string) => void;
  copyICalFeedUrl: () => void;
  setCurrentDate: (date: Date) => void;
}

export const CalendarTabsContent: React.FC<CalendarTabsContentProps> = ({
  activeTab,
  setActiveTab,
  events,
  formattedEvents,
  eventsLoading,
  propertyId,
  handleDateClick,
  handleEventClick,
  currentDate,
  handleCalendarNavigation,
  searchQuery,
  hasConflicts,
  onViewConflicts,
  onAddEvent,
  onExport,
  copyICalFeedUrl,
  setCurrentDate
}) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="calendar">
          <CalendarDays className="mr-2 h-4 w-4" /> Calendar
        </TabsTrigger>
        <TabsTrigger value="list">
          <List className="mr-2 h-4 w-4" /> List View
        </TabsTrigger>
        <TabsTrigger value="check">
          <CheckCircle2 className="mr-2 h-4 w-4" /> Check Validity
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="calendar" className="mt-4">
        <Card>
          <CardContent className="p-0 sm:p-6">
            <CalendarContainer
              events={formattedEvents}
              eventsLoading={eventsLoading}
              propertyId={propertyId}
              onDateClick={handleDateClick}
              onEventClick={handleEventClick}
              onDateChange={setCurrentDate}
              hasConflicts={hasConflicts}
              onViewConflicts={onViewConflicts}
              onAddEvent={onAddEvent}
              onExport={onExport}
              copyICalFeedUrl={copyICalFeedUrl}
              currentDate={currentDate}
              handleCalendarNavigation={handleCalendarNavigation}
            />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="list" className="mt-4">
        <PropertyListView 
          events={events} 
          isLoading={eventsLoading} 
          propertyId={propertyId}
          onEventClick={handleEventClick}
          searchQuery={searchQuery}
        />
      </TabsContent>
      
      <TabsContent value="check" className="mt-4">
        <PropertyValidityCheck propertyId={propertyId} />
      </TabsContent>
    </Tabs>
  );
};
