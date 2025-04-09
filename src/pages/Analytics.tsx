import React, { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { PropertySelect } from "@/components/properties/PropertySelect";
import { format, subMonths } from "date-fns";
import { useAnalyticsTabs } from "@/hooks/useAnalytics";
import { OverviewTab } from "@/components/analytics/tabs/OverviewTab";
import { BookingsTab } from "@/components/analytics/tabs/BookingsTab";
import { PlatformsTab } from "@/components/analytics/tabs/PlatformsTab";
import { CalendarAnalyticsTab } from "@/components/analytics/tabs/CalendarTab";
import { UserActivityTab } from "@/components/analytics/tabs/UserActivityTab";
import { Button } from "@/components/ui/button";
import { Download, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { DateRange } from "react-day-picker";

export default function Analytics() {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subMonths(new Date(), 3),
    to: new Date(),
  });

  const {
    activeTab,
    setActiveTab,
    propertyId,
    setPropertyId,
    isLoading,
    overviewData,
    bookingData,
    platformData,
    calendarData,
    userActivityData,
  } = useAnalyticsTabs();

  const eventsDistributionData = useMemo(() => [
    { name: "Airbnb", value: 45 },
    { name: "Booking.com", value: 30 },
    { name: "VRBO", value: 15 },
    { name: "Direct", value: 10 }
  ], []);

  const eventsByMonth = useMemo(() => [
    { name: "Jan", count: 20 },
    { name: "Feb", count: 28 },
    { name: "Mar", count: 35 },
    { name: "Apr", count: 42 },
    { name: "May", count: 38 },
    { name: "Jun", count: 45 }
  ], []);

  const notificationTypeData = useMemo(() => [
    { name: "System", value: 12 },
    { name: "Booking", value: 25 },
    { name: "Calendar", value: 18 },
    { name: "Conflict", value: 5 }
  ], []);

  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (range) {
      setDateRange(range);
    }
  };

  const handlePropertyChange = (value: string) => {
    setPropertyId(value === "all" ? undefined : value);
  };

  const handleRefresh = () => {
    overviewData.refetch();
    bookingData.refetch();
    platformData.refetch();
    calendarData.refetch();
    userActivityData.refetch();
    toast.success("Analytics data refreshed");
  };

  const handleExport = () => {
    toast.success("Analytics data export started. You will be notified when it's ready.");
  };

  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Get insights about your properties, bookings, and system performance
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={handleRefresh}
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={handleExport}
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Property Filter</CardTitle>
            <CardDescription>Select a specific property or view all</CardDescription>
          </CardHeader>
          <CardContent>
            <PropertySelect 
              value={propertyId ?? "all"} 
              onValueChange={handlePropertyChange} 
              includeAllOption 
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Date Range</CardTitle>
            <CardDescription>Filter analytics by date range</CardDescription>
          </CardHeader>
          <CardContent>
            <DatePickerWithRange 
              date={dateRange} 
              onDateChange={handleDateRangeChange} 
            />
          </CardContent>
        </Card>
      </div>

      <Tabs
        defaultValue="overview"
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="activity">User Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <OverviewTab 
            eventsData={calendarData.data}
            eventsDistributionData={eventsDistributionData}
            eventsByMonth={eventsByMonth}
            notificationTypeData={notificationTypeData}
            notificationsData={userActivityData.data}
            syncLogs={userActivityData.data}
            isLoadingEvents={calendarData.isLoading}
            isLoadingNotifications={userActivityData.isLoading}
            isLoadingSyncLogs={userActivityData.isLoading}
          />
        </TabsContent>

        <TabsContent value="bookings" className="space-y-4">
          <BookingsTab 
            data={bookingData.data}
            isLoading={bookingData.isLoading}
            dateRange={dateRange}
          />
        </TabsContent>

        <TabsContent value="platforms" className="space-y-4">
          <PlatformsTab 
            data={platformData.data}
            isLoading={platformData.isLoading}
          />
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <CalendarAnalyticsTab 
            data={calendarData.data}
            isLoading={calendarData.isLoading}
            dateRange={dateRange}
          />
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <UserActivityTab 
            data={userActivityData.data}
            isLoading={userActivityData.isLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
