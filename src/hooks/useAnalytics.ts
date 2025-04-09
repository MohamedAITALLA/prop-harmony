
import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "@/services/api-service";
import { type BookingAnalytics, type CalendarAnalytics, type DashboardAnalytics, type PlatformAnalytics, type PropertyAnalytics, type UserActivityAnalytics } from "@/services/analytics-service";
import { useState } from "react";

export function useDashboardAnalytics() {
  return useQuery({
    queryKey: ['dashboardAnalytics'],
    queryFn: () => analyticsService.getDashboardAnalytics(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function usePropertyAnalytics(propertyId?: string) {
  return useQuery({
    queryKey: ['propertyAnalytics', propertyId],
    queryFn: () => analyticsService.getPropertyAnalytics(propertyId),
    staleTime: 5 * 60 * 1000,
    enabled: true,
  });
}

export function useBookingAnalytics(options?: {
  propertyId?: string;
  startDate?: string;
  endDate?: string;
}) {
  return useQuery({
    queryKey: ['bookingAnalytics', options?.propertyId, options?.startDate, options?.endDate],
    queryFn: () => analyticsService.getBookingAnalytics(options),
    staleTime: 5 * 60 * 1000,
    enabled: true,
  });
}

export function usePlatformAnalytics(propertyId?: string) {
  return useQuery({
    queryKey: ['platformAnalytics', propertyId],
    queryFn: () => analyticsService.getPlatformAnalytics(propertyId),
    staleTime: 5 * 60 * 1000,
    enabled: true,
  });
}

export function useCalendarAnalytics(options?: {
  propertyId?: string;
  startDate?: string;
  endDate?: string;
}) {
  return useQuery({
    queryKey: ['calendarAnalytics', options?.propertyId, options?.startDate, options?.endDate],
    queryFn: () => analyticsService.getCalendarAnalytics(options),
    staleTime: 5 * 60 * 1000,
    enabled: true,
  });
}

export function useUserActivityAnalytics() {
  return useQuery({
    queryKey: ['userActivityAnalytics'],
    queryFn: () => analyticsService.getUserActivityAnalytics(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useAnalyticsTabs() {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [propertyId, setPropertyId] = useState<string | undefined>(undefined);
  const [dateRange, setDateRange] = useState<{
    startDate?: string;
    endDate?: string;
  }>({});

  const overviewData = usePropertyAnalytics();
  const bookingData = useBookingAnalytics({
    propertyId,
    ...dateRange
  });
  const platformData = usePlatformAnalytics(propertyId);
  const calendarData = useCalendarAnalytics({
    propertyId,
    ...dateRange
  });
  const userActivityData = useUserActivityAnalytics();

  const isLoading = 
    overviewData.isLoading || 
    bookingData.isLoading || 
    platformData.isLoading || 
    calendarData.isLoading || 
    userActivityData.isLoading;

  return {
    activeTab,
    setActiveTab,
    propertyId,
    setPropertyId,
    dateRange,
    setDateRange,
    isLoading,
    overviewData,
    bookingData,
    platformData,
    calendarData,
    userActivityData
  };
}
