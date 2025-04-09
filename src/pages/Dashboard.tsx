
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { dashboardConfig } from "@/config/dashboard.config";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { PropertyCards } from "@/components/dashboard/PropertyCards";
import { MiniCalendar } from "@/components/dashboard/MiniCalendar";
import { RecentNotifications } from "@/components/dashboard/RecentNotifications";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ArrowRightCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface DashboardStats {
  totalProperties: number;
  activeBookings: number;
  occupancyRate: number;
  pendingConflicts: number;
}

// Mock recent activity data
const recentActivities = [
  {
    id: 1,
    action: "New booking",
    property: "Oceanfront Villa",
    date: "2 hours ago",
    user: "John Smith",
  },
  {
    id: 2,
    action: "Sync completed",
    property: "Mountain Cabin",
    date: "5 hours ago",
    user: "System",
  },
  {
    id: 3,
    action: "Price update",
    property: "Downtown Apartment",
    date: "Yesterday",
    user: "Sarah Johnson",
  },
  {
    id: 4,
    action: "Booking cancelled",
    property: "Luxury Penthouse",
    date: "2 days ago",
    user: "Mike Wilson",
  }
];

// Mock upcoming events
const upcomingEvents = [
  {
    id: 1,
    title: "Guest Check-in",
    property: "Beachside Cottage",
    date: "Tomorrow, 3:00 PM"
  },
  {
    id: 2,
    title: "Maintenance Visit",
    property: "City Loft",
    date: "May 12, 10:00 AM"
  },
  {
    id: 3,
    title: "Guest Check-out",
    property: "Mountain View Cabin",
    date: "May 15, 11:00 AM"
  }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  // Format current date and time
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(currentTime);
  
  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(currentTime);

  // This is a mock query that would normally fetch data from your API
  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      // In a real app, you would fetch this data from your API
      // Mock data for now
      return {
        totalProperties: 5,
        activeBookings: 8,
        occupancyRate: 72,
        pendingConflicts: 2
      } as DashboardStats;
    },
  });

  // Helper function to replace placeholders in strings
  const replacePlaceholders = (text: string, data: any) => {
    return text
      .replace("{count}", data?.toString() || "0")
      .replace("{percentage}", data?.toString() || "0")
      .replace("{number}", "5"); // Mock change percentage
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.first_name || "User"}</h1>
          <p className="text-muted-foreground">
            {formattedDate} · {formattedTime}
          </p>
        </div>
        
        <Alert className="max-w-xl">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You have <strong>2 calendar conflicts</strong> that require your attention.
            <Button variant="link" className="p-0 h-auto ml-2" onClick={() => navigate("/properties")}>
              View details
            </Button>
          </AlertDescription>
        </Alert>
      </div>
      
      {/* Dynamically render sections based on the configuration */}
      {dashboardConfig.overview_page.sections.map((section, index) => (
        <div key={index} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">{section.name}</h2>
          </div>
          
          {section.layout === "grid" && section.cards && (
            <div className={`grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-${section.columns || 4}`}>
              {section.cards.map((card, cardIndex) => {
                let value = "";
                
                // Map card values to actual data
                switch (card.title) {
                  case "Total Properties":
                    value = replacePlaceholders(card.value, stats?.totalProperties);
                    break;
                  case "Active Bookings":
                    value = replacePlaceholders(card.value, stats?.activeBookings);
                    break;
                  case "Occupancy Rate":
                    value = replacePlaceholders(card.value, stats?.occupancyRate);
                    break;
                  case "Pending Conflicts":
                    value = replacePlaceholders(card.value, stats?.pendingConflicts);
                    break;
                  default:
                    value = card.value;
                }
                
                return (
                  <StatsCard
                    key={cardIndex}
                    title={card.title}
                    value={value}
                    icon={card.icon}
                    change={card.change ? replacePlaceholders(card.change, "5") : undefined}
                    variant={card.variant}
                    action={card.action}
                    onClick={() => card.action && navigate(
                      card.title === "Pending Conflicts" ? "/properties" :
                      card.title === "Total Properties" ? "/properties" :
                      card.title === "Active Bookings" ? "/properties" :
                      "/"
                    )}
                    isLoading={isLoading}
                  />
                );
              })}
            </div>
          )}
          
          {section.component === "PropertyCards" && (
            <PropertyCards 
              limit={section.columns || 3} 
              action={section.action}
              isLoading={false}
              error={null}
            />
          )}
          
          {section.component === "MiniCalendar" && (
            <MiniCalendar 
              height={section.height || "300px"}
              action={section.action}
            />
          )}
          
          {section.component === "NotificationsList" && (
            <RecentNotifications 
              limit={section.limit || 5}
              action={section.action}
            />
          )}
        </div>
      ))}
      
      {/* Recent Activity Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Activity</h2>
          <Button variant="ghost" size="sm" className="gap-1" onClick={() => navigate("/notifications")}>
            View all
            <ArrowRightCircle className="ml-1 h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Recent Actions</CardTitle>
              <CardDescription>Latest activities across your properties</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map(activity => (
                  <div key={activity.id} className="flex justify-between border-b pb-2 last:border-0">
                    <div>
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.property}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">{activity.date}</p>
                      <p className="text-sm">{activity.user}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Upcoming Events</CardTitle>
              <CardDescription>Scheduled events in the next 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map(event => (
                  <div key={event.id} className="flex justify-between border-b pb-2 last:border-0">
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-muted-foreground">{event.property}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{event.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
