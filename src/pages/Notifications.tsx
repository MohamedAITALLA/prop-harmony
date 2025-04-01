
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
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Check, Settings } from "lucide-react";
import { Property, Notification } from "@/types/api-responses";
import { propertyService } from "@/services/api-service";
import { NotificationType, NotificationSeverity } from "@/types/enums";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface NotificationFilters {
  property_id?: string;
  type?: string;
  severity?: string;
  read?: string;
  search?: string;
}

interface NotificationSettingsForm {
  email_notifications: boolean;
  new_booking_notifications: boolean;
  modified_booking_notifications: boolean;
  cancelled_booking_notifications: boolean;
  conflict_notifications: boolean;
  sync_failure_notifications: boolean;
}

const initialSettings: NotificationSettingsForm = {
  email_notifications: true,
  new_booking_notifications: true,
  modified_booking_notifications: true,
  cancelled_booking_notifications: true,
  conflict_notifications: true,
  sync_failure_notifications: true,
};

export default function Notifications() {
  const [filters, setFilters] = useState<NotificationFilters>({
    read: "",
  });
  const [searchQuery, setSearchQuery] = useState("");

  const { 
    notifications, 
    isLoading, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotifications();

  // Get properties for the filter dropdown
  const { data: properties = [] } = useQuery<Property[]>({
    queryKey: ["properties", "list"],
    queryFn: async () => {
      // In a real app, this would call the API
      const response = await propertyService.getAllProperties();
      return response.data.properties;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const form = useForm<NotificationSettingsForm>({
    defaultValues: initialSettings,
  });

  const handleFilterChange = (key: keyof NotificationFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmitSettings = (data: NotificationSettingsForm) => {
    // In a real app, this would submit to the API
    console.log("Notification settings:", data);
    toast.success("Notification settings updated");
  };

  // Filter notifications based on selected filters
  const filteredNotifications = notifications.filter((notification: Notification) => {
    // Apply property filter
    if (filters.property_id && notification.property_id !== filters.property_id) {
      return false;
    }

    // Apply type filter
    if (filters.type && notification.type !== filters.type) {
      return false;
    }

    // Apply severity filter
    if (filters.severity && notification.severity !== filters.severity) {
      return false;
    }

    // Apply read status filter
    if (filters.read === "true" && !notification.read) {
      return false;
    }
    if (filters.read === "false" && notification.read) {
      return false;
    }

    // Apply search filter
    if (
      searchQuery &&
      !notification.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !notification.message.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold">Notifications</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={markAllAsRead}
            disabled={notifications.every((n) => n.read)}
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
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmitSettings)} className="space-y-4 py-4">
                  <FormField
                    control={form.control}
                    name="email_notifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Email Notifications</FormLabel>
                          <FormDescription>
                            Receive notifications via email
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="new_booking_notifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>New Bookings</FormLabel>
                          <FormDescription>
                            Get notified when new bookings are created
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="modified_booking_notifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Modified Bookings</FormLabel>
                          <FormDescription>
                            Get notified when existing bookings are modified
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="cancelled_booking_notifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Cancelled Bookings</FormLabel>
                          <FormDescription>
                            Get notified when bookings are cancelled
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="conflict_notifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Booking Conflicts</FormLabel>
                          <FormDescription>
                            Get notified when booking conflicts are detected
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="sync_failure_notifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Sync Failures</FormLabel>
                          <FormDescription>
                            Get notified when calendar synchronization fails
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button type="submit">Save Changes</Button>
                  </DialogFooter>
                </form>
              </Form>
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
              />
            </div>
            
            <Select
              value={filters.property_id || ""}
              onValueChange={(value) => handleFilterChange("property_id", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Property" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_properties">All Properties</SelectItem>
                {properties.map((property) => (
                  <SelectItem key={property.id} value={property.id}>
                    {property.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select
              value={filters.type || ""}
              onValueChange={(value) => handleFilterChange("type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_types">All Types</SelectItem>
                <SelectItem value="new_booking">New Booking</SelectItem>
                <SelectItem value="modified_booking">Modified Booking</SelectItem>
                <SelectItem value="cancelled_booking">Cancelled Booking</SelectItem>
                <SelectItem value="booking_conflict">Booking Conflict</SelectItem>
                <SelectItem value="sync_failure">Sync Failure</SelectItem>
              </SelectContent>
            </Select>
            
            <Select
              value={filters.severity || ""}
              onValueChange={(value) => handleFilterChange("severity", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_severities">All Severities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="info">Info</SelectItem>
              </SelectContent>
            </Select>
            
            <Select
              value={filters.read}
              onValueChange={(value) => handleFilterChange("read", value)}
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
            {filteredNotifications.length} notification{filteredNotifications.length !== 1 && 's'} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NotificationsList
            notifications={filteredNotifications}
            isLoading={isLoading}
            onMarkRead={markAsRead}
            onMarkAllRead={markAllAsRead}
            onDelete={deleteNotification}
            maxHeight="600px"
          />
        </CardContent>
      </Card>
    </div>
  );
}
