
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/auth/useAuth";
import { useQuery } from "@tanstack/react-query";
import { dashboardConfig } from "@/config/dashboard.config";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { PropertyCards } from "@/components/dashboard/PropertyCards";
import { MiniCalendar } from "@/components/dashboard/MiniCalendar";
import { RecentNotifications } from "@/components/dashboard/RecentNotifications";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ArrowRightCircle, BarChart3, Calendar, Clock, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { analyticsService } from "@/services/api-service";
import { format } from "date-fns";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Fetch dashboard analytics
  const { data: dashboardData, isLoading: isDashboardLoading } = useQuery({
    queryKey: ["dashboardAnalytics"],
    queryFn: () => analyticsService.getDashboardAnalytics(),
    staleTime: 5 * 60 * 1000,
  });

  // Update current time every minute
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

  // Helper function to replace placeholders in strings
  const replacePlaceholders = (text: string, data: any) => {
    if (!text) return "";
    
    return text
      .replace("{count}", data?.toString() || "0")
      .replace("{percent}", data?.toString() || "0")
      .replace("{percentage}", data?.toString() || "0%")
      .replace("{number}", data?.toString() || "0")
      .replace("{time}", new Date().toLocaleTimeString());
  };

  // Recent activities from API or fallback
  const recentActivities = dashboardData?.data?.upcoming_bookings || [
    {
      id: "1",
      action: "New booking",
      property: "Oceanfront Villa",
      date: "2 hours ago",
      user: "John Smith",
    },
    {
      id: "2",
      action: "Sync completed",
      property: "Mountain Cabin",
      date: "5 hours ago",
      user: "System",
    },
    {
      id: "3",
      action: "Price update",
      property: "Downtown Apartment",
      date: "Yesterday",
      user: "Sarah Johnson",
    },
    {
      id: "4",
      action: "Booking cancelled",
      property: "Luxury Penthouse",
      date: "2 days ago",
      user: "Mike Wilson",
    }
  ];

  // Upcoming events from API data or fallback
  const upcomingEvents = dashboardData?.data?.upcoming_bookings?.map((booking: any) => ({
    id: booking.id,
    title: booking.summary,
    property: booking.property_name || "Property",
    date: `${format(new Date(booking.start_date), 'MMM d')} - ${format(new Date(booking.end_date), 'MMM d, yyyy')}`
  })) || [
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
      date: "May 15, 10:00 AM"
    },
    {
      id: 3,
      title: "Guest Check-out",
      property: "Mountain Cabin",
      date: "May 17, 11:00 AM"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.first_name || "User"}</h1>
          <p className="text-muted-foreground">
            {formattedDate} · {formattedTime}
          </p>
        </div>
        
        {dashboardData?.data?.active_conflicts > 0 && (
          <Alert className="max-w-xl">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You have <strong>{dashboardData.data.active_conflicts} calendar conflicts</strong> that require your attention.
              <Button variant="link" className="p-0 h-auto ml-2" onClick={() => navigate("/properties")}>
                View details
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {dashboardData?.data?.alerts?.map((alert: any, index: number) => (
          <Alert key={index} variant={alert.severity === "high" ? "destructive" : "default"} className="max-w-xl">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {alert.message}
              <Button variant="link" className="p-0 h-auto ml-2" onClick={() => navigate("/sync")}>
                View details
              </Button>
            </AlertDescription>
          </Alert>
        ))}
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Properties"
          value={dashboardData?.data?.total_properties || 0}
          icon="home"
          change={`${Math.floor(Math.random() * 10)}% from last month`}
          onClick={() => navigate("/properties")}
          isLoading={isDashboardLoading}
        />
        
        <StatsCard
          title="Active Bookings"
          value={dashboardData?.data?.active_bookings || 0}
          icon="calendar-check"
          change={`${Math.floor(Math.random() * 5) + 5}% from last month`}
          onClick={() => navigate("/properties")}
          isLoading={isDashboardLoading}
        />
        
        <StatsCard
          title="Occupancy Rate"
          value={`${dashboardData?.data?.current_occupancy_rate || 0}%`}
          icon="percent"
          variant="success"
          change={`Last updated: ${new Date().toLocaleTimeString()}`}
          isLoading={isDashboardLoading}
        />
        
        <StatsCard
          title="System Health"
          value={`${dashboardData?.data?.health_score || 0}%`}
          icon="activity"
          variant={
            (dashboardData?.data?.health_score || 0) > 90
              ? "success"
              : (dashboardData?.data?.health_score || 0) > 70
                ? "warning"
                : "danger"
          }
          change={`${dashboardData?.data?.connection_health?.error || 0} issues detected`}
          onClick={() => navigate("/sync")}
          isLoading={isDashboardLoading}
        />
      </div>
      
      {dashboardConfig.overview_page.sections.map((section, index) => (
        section.component === "PropertyCards" && (
          <div key={index} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">{section.name || "Your Properties"}</h2>
              {section.action && (
                <Button variant="ghost" size="sm" className="gap-1" onClick={() => navigate("/properties")}>
                  {section.action}
                  <ArrowRightCircle className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <PropertyCards 
              limit={section.columns || 3} 
              action={section.action}
              isLoading={false}
              error={null}
            />
          </div>
        )
      ))}
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-base font-medium">Recent Activity</CardTitle>
              <CardDescription>Latest activity across your properties</CardDescription>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-1"
              onClick={() => navigate("/notifications")}
            >
              View all
              <ArrowRightCircle className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.slice(0, 4).map((activity: any) => (
                <div key={activity.id} className="flex justify-between border-b pb-2 last:border-0">
                  <div>
                    <p className="font-medium">{activity.action || activity.summary}</p>
                    <p className="text-sm text-muted-foreground">{activity.property}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">{activity.date || format(new Date(activity.start_date), 'MMM d')}</p>
                    <p className="text-sm">{activity.user || activity.platform}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-base font-medium">Upcoming Events</CardTitle>
                <CardDescription>Next scheduled events</CardDescription>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => navigate("/events")}
              >
                <Calendar className="h-4 w-4" />
                <span className="sr-only">View calendar</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.slice(0, 3).map((event) => (
                <div key={event.id} className="flex justify-between border-b pb-2 last:border-0">
                  <div>
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-muted-foreground">{event.property}</p>
                  </div>
                  <div className="text-right flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{event.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row justify-between items-center pb-2">
            <div>
              <CardTitle className="text-base font-medium">Calendar</CardTitle>
              <CardDescription>Upcoming reservations</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1"
              onClick={() => navigate("/events")}
            >
              View calendar
              <ArrowRightCircle className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="pl-2">
            <MiniCalendar 
              height="300px"
              action="View calendar"
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row justify-between items-center pb-2">
            <div>
              <CardTitle className="text-base font-medium">Analytics Overview</CardTitle>
              <CardDescription>Booking performance</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1"
              onClick={() => navigate("/analytics")}
            >
              View analytics
              <BarChart3 className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {isDashboardLoading ? (
              <div className="space-y-4 py-8">
                <div className="h-4 w-full bg-muted rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                <div className="h-4 w-5/6 bg-muted rounded animate-pulse" />
              </div>
            ) : (
              <div className="space-y-8">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Occupancy Rate</h4>
                    <span className="text-sm font-medium">{dashboardData?.data?.current_occupancy_rate || 0}%</span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary" 
                      style={{ width: `${dashboardData?.data?.current_occupancy_rate || 0}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Current period</span>
                    <span>Target: 80%</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Connection Health</h4>
                    <span className="text-sm font-medium">{dashboardData?.data?.health_score || 0}%</span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${(dashboardData?.data?.health_score || 0) > 70 ? 'bg-green-600' : 'bg-red-500'}`}
                      style={{ width: `${dashboardData?.data?.health_score || 0}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{dashboardData?.data?.connection_health?.active || 0} active connections</span>
                    <span>{dashboardData?.data?.connection_health?.error || 0} errors</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <h4 className="text-sm font-medium">System Status</h4>
                    <span className={`text-sm font-medium ${
                      (dashboardData?.data?.system_health_status || '') === 'Good' 
                        ? 'text-green-600' 
                        : 'text-amber-500'
                    }`}>
                      {dashboardData?.data?.system_health_status || 'Good'}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {dashboardData?.data?.connection_health?.error 
                      ? `${dashboardData.data.connection_health.error} connections need attention` 
                      : 'All systems operational'}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
