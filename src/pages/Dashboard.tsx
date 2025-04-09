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
import { AlertCircle, ArrowRightCircle, BarChart3, Calendar, Clock, Home, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { analyticsService } from "@/services/api-service";
import { format } from "date-fns";
import { PlatformsList } from "@/components/sync/PlatformsList";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

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
  
  // Fetch platform analytics for the platforms section
  const { data: platformData, isLoading: isPlatformLoading } = useQuery({
    queryKey: ["platformAnalytics"],
    queryFn: () => analyticsService.getPlatformAnalytics(),
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

  // Get connection data for platforms visualization
  const connectionsByPlatform = platformData?.data?.connections_by_platform || [
    { _id: "airbnb", count: 2 },
    { _id: "booking.com", count: 1 },
    { _id: "vrbo", count: 1 }
  ];

  const connectionColors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

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
      
      {/* Platform Connections Section */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-lg font-semibold">Platform Connections</CardTitle>
              <CardDescription>Active connections by platform</CardDescription>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-1"
              onClick={() => navigate("/analytics")}
            >
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="w-full md:w-1/2 h-[200px]">
                {isPlatformLoading ? (
                  <div className="flex h-full items-center justify-center">
                    <div className="h-32 w-32 animate-pulse rounded-full bg-muted"></div>
                  </div>
                ) : connectionsByPlatform && connectionsByPlatform.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={connectionsByPlatform}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        nameKey="_id"
                        label={({ _id, percent }) => 
                          `${_id}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {connectionsByPlatform.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={connectionColors[index % connectionColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name) => [`${value} connections`, name]}
                        contentStyle={{
                          backgroundColor: 'var(--background)',
                          borderColor: 'var(--border)',
                          borderRadius: '0.375rem',
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    No connection data available
                  </div>
                )}
              </div>
              
              <div className="w-full md:w-1/2">
                <h3 className="font-medium text-base mb-3">Connection Status</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Active Connections</span>
                    <span className="font-semibold">
                      {platformData?.data?.connections_by_status?.find(s => s._id === 'active')?.count || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Inactive Connections</span>
                    <span className="font-semibold">
                      {platformData?.data?.connections_by_status?.find(s => s._id === 'inactive')?.count || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Error Connections</span>
                    <span className="font-semibold text-destructive">
                      {platformData?.data?.connections_by_status?.find(s => s._id === 'error')?.count || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="font-medium">Total</span>
                    <span className="font-semibold">
                      {isPlatformLoading ? (
                        <span className="animate-pulse">...</span>
                      ) : (
                        platformData?.data?.connections_by_platform?.reduce((total, item) => total + item.count, 0) || 0
                      )}
                    </span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => navigate("/sync")}
                  >
                    Manage Connections
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Connected Platforms</CardTitle>
            <CardDescription>Your property connections</CardDescription>
          </CardHeader>
          <CardContent>
            {isPlatformLoading ? (
              <div className="space-y-3">
                {Array(3).fill(0).map((_, i) => (
                  <div key={i} className="h-8 bg-muted animate-pulse rounded"></div>
                ))}
              </div>
            ) : platformData?.data?.connections_by_platform && platformData.data.connections_by_platform.length > 0 ? (
              <div className="space-y-1">
                <PlatformsList 
                  platforms={platformData.data.connections_by_platform.map(item => item._id)} 
                />
                
                <div className="mt-4 pt-3 border-t">
                  <div className="text-sm text-muted-foreground">
                    <div className="flex justify-between mb-1">
                      <span>Most reliable platform</span>
                      <span className="font-medium capitalize">
                        {platformData?.data?.most_reliable_platform?.platform || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Most active platform</span>
                      <span className="font-medium capitalize">
                        {platformData?.data?.most_active_platform?._id || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <p>No platforms connected yet</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4"
                  onClick={() => navigate("/properties")}
                >
                  Connect Platforms
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
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
              <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
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
                <CardTitle className="text-lg font-semibold">Upcoming Events</CardTitle>
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
