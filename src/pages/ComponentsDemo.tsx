
import React from "react";
import { StatusBadge } from "@/components/ui/status-badge";
import { PlatformIcon } from "@/components/ui/platform-icon";
import { DateRange } from "@/components/ui/date-range";
import { ConflictResolver } from "@/components/ui/conflict-resolver";
import { NotificationsList } from "@/components/ui/notifications-list";
import { SyncStatusBadge } from "@/components/ui/sync-status-badge";
import { PropertyCard } from "@/components/ui/property-card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

export default function ComponentsDemo() {
  const { toast } = useToast();

  // Sample property data
  const sampleProperty = {
    id: "prop-123",
    name: "Beachfront Villa",
    propertyType: "villa",
    address: {
      city: "Malibu",
      stateProvince: "CA",
      country: "USA"
    },
    bedrooms: 3,
    bathrooms: 2,
    accommodates: 6,
    images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop"]
  };

  // Sample notifications
  const sampleNotifications = [
    {
      id: "1",
      title: "New Booking",
      message: "You have a new booking for Beachfront Villa from Airbnb",
      type: "booking",
      severity: "info",
      read: false,
      created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 minutes ago
    },
    {
      id: "2",
      title: "Sync Complete",
      message: "All properties have been synced successfully",
      type: "sync",
      severity: "success",
      read: true,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString() // 3 hours ago
    },
    {
      id: "3",
      title: "Booking Conflict",
      message: "Double booking detected for Mountain Cabin on 05/15/2023",
      type: "conflict",
      severity: "error",
      read: false,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString() // 1 hour ago
    }
  ];

  // Sample conflict events
  const conflictEvents = [
    {
      id: "event-1",
      platform: "Airbnb",
      summary: "John Doe - 2 guests",
      startDate: "2023-05-15T00:00:00Z",
      endDate: "2023-05-18T00:00:00Z"
    },
    {
      id: "event-2",
      platform: "Booking.com",
      summary: "Jane Smith - 3 guests",
      startDate: "2023-05-16T00:00:00Z",
      endDate: "2023-05-20T00:00:00Z"
    }
  ];

  const handleNotificationMarkRead = (id: string) => {
    toast({
      title: "Notification marked as read",
      description: `Marked notification ${id} as read`
    });
  };

  const handleNotificationDelete = (id: string) => {
    toast({
      title: "Notification deleted",
      description: `Deleted notification ${id}`
    });
  };

  const handleMarkAllRead = () => {
    toast({
      title: "All notifications marked as read",
      description: "All notifications have been marked as read"
    });
  };

  const handleConflictResolve = async (action: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: "Conflict Resolved",
      description: `Action: ${action}`
    });
  };

  return (
    <div className="container py-10 space-y-12">
      <div>
        <h1 className="text-3xl font-bold mb-2">Component Library</h1>
        <p className="text-muted-foreground mb-6">
          A showcase of all the reusable components for the property management system
        </p>
      </div>

      {/* StatusBadge Component */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Status Badges</h2>
        <div className="flex flex-wrap gap-4">
          <StatusBadge status="Active" />
          <StatusBadge status="Pending" />
          <StatusBadge status="Error" />
          <StatusBadge status="Completed" />
          <StatusBadge status="Inactive" />
          <StatusBadge status="Processing" />
        </div>
        <div className="flex flex-wrap gap-4 mt-4">
          <StatusBadge status="Success" size="sm" />
          <StatusBadge status="Warning" size="md" />
          <StatusBadge status="Error" size="lg" />
        </div>
      </section>
      
      <Separator />

      {/* PlatformIcon Component */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Platform Icons</h2>
        <div className="flex flex-wrap gap-6">
          <div className="flex flex-col items-center">
            <PlatformIcon platform="Airbnb" size={32} />
            <span className="text-sm mt-2">Airbnb</span>
          </div>
          <div className="flex flex-col items-center">
            <PlatformIcon platform="booking.com" size={32} />
            <span className="text-sm mt-2">Booking.com</span>
          </div>
          <div className="flex flex-col items-center">
            <PlatformIcon platform="Vrbo" size={32} />
            <span className="text-sm mt-2">Vrbo</span>
          </div>
          <div className="flex flex-col items-center">
            <PlatformIcon platform="Expedia" size={32} />
            <span className="text-sm mt-2">Expedia</span>
          </div>
          <div className="flex flex-col items-center">
            <PlatformIcon platform="TripAdvisor" size={32} />
            <span className="text-sm mt-2">TripAdvisor</span>
          </div>
          <div className="flex flex-col items-center">
            <PlatformIcon platform="Direct" size={32} />
            <span className="text-sm mt-2">Direct</span>
          </div>
          <div className="flex flex-col items-center">
            <PlatformIcon platform="Unknown" size={32} />
            <span className="text-sm mt-2">Unknown</span>
          </div>
        </div>
      </section>
      
      <Separator />

      {/* DateRange Component */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Date Range</h2>
        <div className="space-y-4">
          <DateRange 
            startDate="2023-05-15T00:00:00Z" 
            endDate="2023-05-20T00:00:00Z" 
          />
          <DateRange 
            startDate="2023-06-01T00:00:00Z" 
            endDate="2023-06-07T00:00:00Z" 
            format="MMMM d, yyyy"
            showIcon={false}
          />
          <DateRange 
            startDate="2023-07-10T00:00:00Z" 
            endDate="2023-07-15T00:00:00Z" 
            format="yyyy-MM-dd"
            className="text-primary"
          />
        </div>
      </section>
      
      <Separator />

      {/* SyncStatusBadge Component */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Sync Status Badges</h2>
        <div className="flex flex-wrap gap-4">
          <SyncStatusBadge 
            status="success" 
            lastSync={new Date(Date.now() - 1000 * 60 * 30).toISOString()} 
          />
          <SyncStatusBadge 
            status="warning" 
            lastSync={new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()}
            message="Some events could not be synced" 
          />
          <SyncStatusBadge 
            status="error" 
            lastSync={new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString()}
            message="API error: Cannot connect to server" 
          />
          <SyncStatusBadge 
            status="pending"
          />
        </div>
      </section>
      
      <Separator />

      {/* PropertyCard Component */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Property Card</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <PropertyCard property={sampleProperty} />
          <PropertyCard 
            property={{
              ...sampleProperty,
              id: "prop-456",
              name: "Mountain Cabin",
              propertyType: "cabin",
              bedrooms: 2,
              bathrooms: 1,
              accommodates: 4,
              images: ["https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=800&auto=format&fit=crop"]
            }} 
          />
          <PropertyCard 
            property={{
              ...sampleProperty,
              id: "prop-789",
              name: "Downtown Apartment",
              propertyType: "apartment",
              address: {
                city: "New York",
                stateProvince: "NY",
                country: "USA"
              },
              images: undefined
            }} 
          />
        </div>
      </section>
      
      <Separator />

      {/* NotificationsList Component */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Notifications List</h2>
        <NotificationsList 
          notifications={sampleNotifications}
          onMarkRead={handleNotificationMarkRead}
          onMarkAllRead={handleMarkAllRead}
          onDelete={handleNotificationDelete}
        />
      </section>
      
      <Separator />

      {/* ConflictResolver Component */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Conflict Resolver</h2>
        <ConflictResolver 
          conflictId="conflict-123"
          propertyId="prop-456"
          events={conflictEvents}
          onResolve={handleConflictResolve}
        />
      </section>
    </div>
  );
}
