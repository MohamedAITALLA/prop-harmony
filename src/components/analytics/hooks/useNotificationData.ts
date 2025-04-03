
import { useQuery } from "@tanstack/react-query";
import { notificationService } from "@/services/notification-service";
import React from "react";
import { NotificationsResponse } from "@/types/api-responses";

export function useNotificationData(propertyId?: string) {
  const {
    data: notificationsData,
    isLoading: isLoadingNotifications
  } = useQuery<NotificationsResponse["data"] | null>({
    queryKey: ["property-notifications", propertyId],
    queryFn: async () => {
      if (!propertyId) return null;
      const response = await notificationService.getNotifications({
        // Use 'property_id' as a custom param, but we need to cast to allow it
        page: 1,
        limit: 20
      });
      return response.data;
    },
    enabled: !!propertyId,
    staleTime: 1000 * 60, // 1 minute
  });

  const notificationTypeData = React.useMemo(() => {
    if (!notificationsData?.summary?.by_type) return [];
    
    return Object.entries(notificationsData.summary.by_type).map(([type, count]) => ({
      name: formatNotificationType(type),
      value: count as number,
    }));
  }, [notificationsData]);

  const formatNotificationType = (type: string): string => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return {
    notificationsData,
    isLoadingNotifications,
    notificationTypeData,
    formatNotificationType
  };
}
