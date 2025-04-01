import { useState } from "react";
import { useNotifications } from "@/hooks/useNotifications";
import { useQuery } from "@tanstack/react-query";
import { NotificationsList } from "@/components/ui/notifications-list";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Search, Check, Settings } from "lucide-react";
import { Property } from "@/types/api-responses";
import { propertyService } from "@/services/api-service";
import { NotificationType, NotificationSeverity } from "@/types/enums";
import { NotificationSettings } from "@/components/notifications/NotificationSettings";

interface NotificationFilters {
  page: number;
  property_id?: string;
  type?: string;
  severity?: string;
  read?: string;
  limit?: number;
  search?: string;
}

export default function Notifications() {
  const [filters, setFilters] = useState<NotificationFilters>({
    page: 1,
    limit: 20,
    read: "",
  });
  const [searchQuery, setSearchQuery] = useState("");

  const { 
    notifications, 
    isLoading, 
    totalPages,
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotifications({
    ...filters,
    read: filters.read === "true" ? true : filters.read === "false" ? false : undefined,
  });

  const { data: properties = [] } = useQuery<Property[]>({
    queryKey: ["properties", "list"],
    queryFn: async () => {
      const response = await propertyService.getAllProperties();
      return response.data.properties;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const handleFilterChange = (filterKey: keyof NotificationFilters, value: string | number) => {
    setFilters((prev) => {
      if (filterKey === 'page' && typeof value === 'string') {
        return { ...prev, [filterKey]: parseInt(value, 10) || 1 };
      }
      return { ...prev, [filterKey]: value };
    });
  };

  const handleSearch = () => {
    setFilters(prev => ({ ...prev, search: searchQuery, page: 1 }));
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold">Notifications</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleMarkAllAsRead}
            disabled={!notifications?.some(n => !n.read)}
            className="gap-2"
          >
            <Check className="h-4 w-4" /> Mark All as Read
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Settings className="h-4 w-4" /> Settings
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Notification Settings</DialogTitle>
                <DialogDescription>
                  Customize how and when you receive notifications.
                </DialogDescription>
              </DialogHeader>
              <NotificationSettings />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Filters</CardTitle>
          <CardDescription>
            Filter notifications by property, type, severity, and status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search notifications..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            
            {properties.length > 0 && (
              <Select
                value={filters.property_id || ""}
                onValueChange={(value) => handleFilterChange('property_id', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Properties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Properties</SelectItem>
                  {properties.map((property) => (
                    <SelectItem key={property._id} value={property._id}>
                      {property.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            <Select
              value={filters.type || ""}
              onValueChange={(value) => handleFilterChange("type", value === "all_types" ? "" : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_types">All Types</SelectItem>
                <SelectItem value={NotificationType.NEW_BOOKING}>New Booking</SelectItem>
                <SelectItem value={NotificationType.MODIFIED_BOOKING}>Modified Booking</SelectItem>
                <SelectItem value={NotificationType.CANCELLED_BOOKING}>Cancelled Booking</SelectItem>
                <SelectItem value={NotificationType.BOOKING_CONFLICT}>Booking Conflict</SelectItem>
                <SelectItem value={NotificationType.SYNC_FAILURE}>Sync Failure</SelectItem>
              </SelectContent>
            </Select>
            
            <Select
              value={filters.severity || ""}
              onValueChange={(value) => handleFilterChange("severity", value === "all_severities" ? "" : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_severities">All Severities</SelectItem>
                <SelectItem value={NotificationSeverity.CRITICAL}>Critical</SelectItem>
                <SelectItem value={NotificationSeverity.WARNING}>Warning</SelectItem>
                <SelectItem value={NotificationSeverity.INFO}>Info</SelectItem>
              </SelectContent>
            </Select>
            
            <Select
              value={filters.read}
              onValueChange={(value) => handleFilterChange("read", value === "all_statuses" ? "" : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_statuses">All</SelectItem>
                <SelectItem value="false">Unread</SelectItem>
                <SelectItem value="true">Read</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            {notifications.length} notification{notifications.length !== 1 && 's'} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NotificationsList
            notifications={notifications.map(notification => ({
              _id: notification._id,
              id: notification._id, // For backwards compatibility with components expecting id
              type: notification.type,
              title: notification.title,
              message: notification.message,
              severity: notification.severity,
              read: notification.read,
              created_at: notification.created_at,
              updated_at: notification.updated_at,
              age_in_hours: notification.age_in_hours,
              is_recent: notification.is_recent,
              user_id: notification.user_id,
              property_id: notification.property_id
            }))}
            isLoading={isLoading}
            onMarkRead={markAsRead}
            onMarkAllRead={markAllAsRead}
            onDelete={deleteNotification}
          />
          
          {totalPages > 1 && (
            <div className="flex items-center justify-center mt-6">
              <nav className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => handleFilterChange('page', String(Math.max(1, Number(filters.page) - 1)))}
                  disabled={Number(filters.page) <= 1}
                >
                  Previous
                </Button>
                
                <div className="text-sm">
                  Page <span className="font-medium">{filters.page}</span> of{" "}
                  <span className="font-medium">{totalPages}</span>
                </div>
                
                <Button 
                  variant="outline" 
                  onClick={() => handleFilterChange('page', String(Math.min(totalPages, Number(filters.page) + 1)))}
                  disabled={Number(filters.page) >= totalPages}
                >
                  Next
                </Button>
              </nav>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
