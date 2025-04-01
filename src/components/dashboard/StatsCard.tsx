
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, CalendarCheck, Percent, AlertTriangle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: string;
  change?: string;
  variant?: "default" | "warning" | "success" | "danger";
  action?: string;
  onClick?: () => void;
  isLoading?: boolean;
}

export function StatsCard({
  title,
  value,
  description,
  icon,
  change,
  variant = "default",
  action,
  onClick,
  isLoading = false
}: StatsCardProps) {
  const getIcon = () => {
    switch (icon) {
      case "home":
        return <Home className="h-5 w-5" />;
      case "calendar-check":
        return <CalendarCheck className="h-5 w-5" />;
      case "percent":
        return <Percent className="h-5 w-5" />;
      case "alert-triangle":
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return null;
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case "warning":
        return "text-amber-500";
      case "success":
        return "text-green-500";
      case "danger":
        return "text-red-500";
      default:
        return "text-blue-500";
    }
  };

  return (
    <Card className={cn(
      "overflow-hidden transition-all hover:shadow-md",
      variant === "warning" && "border-amber-200",
      variant === "success" && "border-green-200",
      variant === "danger" && "border-red-200"
    )}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className={getIconColor()}>{getIcon()}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">
          {isLoading ? (
            <div className="h-8 w-16 bg-muted rounded animate-pulse" />
          ) : (
            value
          )}
        </div>
        {change && (
          <CardDescription>{change}</CardDescription>
        )}
        {action && (
          <Button
            variant="link"
            className="p-0 h-auto mt-2"
            onClick={onClick}
          >
            {action}
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
