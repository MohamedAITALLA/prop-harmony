
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { BarChart3 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { dashboardConfig } from "@/config/dashboard.config";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { PropertyCards } from "@/components/dashboard/PropertyCards";
import { MiniCalendar } from "@/components/dashboard/MiniCalendar";
import { RecentNotifications } from "@/components/dashboard/RecentNotifications";
import { SyncStatusTable } from "@/components/dashboard/SyncStatusTable";

interface DashboardStats {
  totalProperties: number;
  activeBookings: number;
  occupancyRate: number;
  pendingConflicts: number;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.first_name || "User"}</h1>
        <p className="text-muted-foreground">
          Here's an overview of your property portfolio
        </p>
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
                      card.title === "Pending Conflicts" ? "/conflicts" :
                      card.title === "Total Properties" ? "/properties" :
                      card.title === "Active Bookings" ? "/calendar" :
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
          
          {section.component === "SyncStatusTable" && (
            <SyncStatusTable action={section.action} />
          )}
        </div>
      ))}
    </div>
  );
}
