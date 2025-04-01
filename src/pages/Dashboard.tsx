
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Building, Calendar, Link as LinkIcon, AlertCircle, BarChart3, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";

interface DashboardStats {
  totalProperties: number;
  totalConnections: number;
  activeConflicts: number;
  upcomingEvents: number;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // This is a mock query that would normally fetch data from your API
  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      // In a real app, you would fetch this data from your API
      // const response = await api.get("/dashboard/stats");
      // return response.data;
      
      // Mock data for now
      return {
        totalProperties: 5,
        totalConnections: 12,
        activeConflicts: 2,
        upcomingEvents: 8
      } as DashboardStats;
    },
  });

  const statCards = [
    {
      title: "Total Properties",
      value: stats?.totalProperties || 0,
      description: "Properties in your portfolio",
      icon: Building,
      color: "text-blue-500",
      link: "/properties",
    },
    {
      title: "iCal Connections",
      value: stats?.totalConnections || 0,
      description: "Active platform connections",
      icon: LinkIcon,
      color: "text-green-500",
      link: "/ical-connections",
    },
    {
      title: "Active Conflicts",
      value: stats?.activeConflicts || 0,
      description: "Conflicts requiring attention",
      icon: AlertCircle,
      color: "text-amber-500",
      link: "/conflicts",
    },
    {
      title: "Upcoming Events",
      value: stats?.upcomingEvents || 0,
      description: "Events in the next 30 days",
      icon: Calendar,
      color: "text-purple-500",
      link: "/calendar",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.first_name || "User"}</h1>
        <p className="text-muted-foreground">
          Here's an overview of your property portfolio
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {isLoading ? (
                  <div className="h-8 w-16 bg-muted rounded animate-pulse" />
                ) : (
                  stat.value
                )}
              </div>
              <CardDescription>{stat.description}</CardDescription>
              <Button
                variant="link"
                className="p-0 h-auto mt-2"
                onClick={() => navigate(stat.link)}
              >
                View details
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest property updates and events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-md p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium">New booking on Airbnb</p>
                  <span className="text-xs text-muted-foreground">2 hours ago</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Beach House property - Jun 18 to Jun 25
                </p>
              </div>
              
              <div className="border rounded-md p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium">Sync completed</p>
                  <span className="text-xs text-muted-foreground">5 hours ago</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  All properties synchronized with no conflicts
                </p>
              </div>
              
              <div className="border rounded-md p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium">Booking modified on Booking.com</p>
                  <span className="text-xs text-muted-foreground">1 day ago</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  City Apartment property - Date changed to Jul 10-15
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Occupancy Rate</CardTitle>
              <CardDescription>Last 30 days overview</CardDescription>
            </div>
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="flex items-center justify-center h-[250px]">
            {/* In a real app, this would be a chart component */}
            <div className="text-muted-foreground text-center">
              <p>Chart Component Placeholder</p>
              <p className="text-sm mt-2">Occupancy data will be displayed here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
