
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { UserActivityAnalytics } from "@/services/analytics-service";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  AlertCircle, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  ExternalLink, 
  Home, 
  RefreshCw, 
  Shield 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { format, formatDistanceToNow } from "date-fns";

interface UserActivityTabProps {
  data?: UserActivityAnalytics;
  isLoading: boolean;
}

export function UserActivityTab({ data, isLoading }: UserActivityTabProps) {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          title="System Health Score"
          value={`${data?.data?.health_score || 0}%`}
          icon="activity"
          variant={
            (data?.data?.health_score || 0) > 90
              ? "success"
              : (data?.data?.health_score || 0) > 70
                ? "warning"
                : "danger"
          }
          isLoading={isLoading}
        />
        
        <StatsCard
          title="Total Properties"
          value={data?.data?.total_properties || 0}
          icon="home"
          isLoading={isLoading}
        />
        
        <StatsCard
          title="Total Connections"
          value={data?.data?.total_connections || 0}
          icon="link"
          isLoading={isLoading}
        />
      </div>
      
      {data?.data?.health_score && data.data.health_score < 80 && (
        <Alert variant={data.data.health_score < 70 ? "destructive" : "warning"} className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>System Health Alert</AlertTitle>
          <AlertDescription>
            Your system health score is {data.data.health_score}%. {data.data.recommended_actions?.[0]}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Connection Health</CardTitle>
            <CardDescription>Status of your iCal connections</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : data?.data?.connection_health ? (
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-2xl font-bold">
                      {data.data.connection_health.active} / {data.data.connection_health.total}
                    </div>
                    <p className="text-sm text-muted-foreground">Active connections</p>
                  </div>
                  <div className="flex gap-2">
                    {data.data.connection_health.error > 0 && (
                      <Badge variant="destructive" className="flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        {data.data.connection_health.error} Error
                      </Badge>
                    )}
                    {data.data.connection_health.inactive > 0 && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        {data.data.connection_health.inactive} Inactive
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span>Connection Health</span>
                    <span>{data.data.health_score}%</span>
                  </div>
                  <Progress 
                    value={data.data.health_score} 
                    className="h-2" 
                    indicatorClassName={
                      data.data.health_score > 90 
                        ? "bg-green-600" 
                        : data.data.health_score > 70
                          ? "bg-amber-500"
                          : "bg-red-500"
                    }
                  />
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">Active</span>
                      <span className="font-medium text-sm">{data.data.connection_health.active}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">Errors</span>
                      <span className="font-medium text-sm text-destructive">{data.data.connection_health.error}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">Inactive</span>
                      <span className="font-medium text-sm">{data.data.connection_health.inactive}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-40 items-center justify-center text-muted-foreground">
                No connection health data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Recommended Actions</CardTitle>
                <CardDescription>Improve your system health with these actions</CardDescription>
              </div>
              <Button size="sm" variant="outline" className="h-8">
                <RefreshCw className="h-3.5 w-3.5 mr-1" />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array(3).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            ) : data?.data?.recommended_actions && data.data.recommended_actions.length > 0 ? (
              <div className="space-y-3">
                {data.data.recommended_actions.map((action, index) => (
                  <div key={index} className="flex items-start gap-2 p-2 rounded border bg-muted/40">
                    {action.includes("error") || action.includes("conflict") ? (
                      <AlertCircle className="h-5 w-5 mt-0.5 text-destructive flex-shrink-0" />
                    ) : (
                      <Shield className="h-5 w-5 mt-0.5 text-primary flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm">{action}</p>
                    </div>
                    <Button size="sm" variant="ghost" className="h-7 px-2">
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span className="sr-only">Fix</span>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-40 flex-col items-center justify-center text-muted-foreground gap-2">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <p>No recommended actions at this time</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Sync Activity</CardTitle>
          <CardDescription>Recent synchronization activity across your platforms</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="border-b pb-3 last:border-0 last:pb-0">
                  <div className="flex justify-between">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                  <div className="flex justify-between mt-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : data?.data?.recent_sync_activity && data.data.recent_sync_activity.length > 0 ? (
            <div className="space-y-4 divide-y">
              {data.data.recent_sync_activity.map((activity, index) => (
                <div key={index} className={`${index > 0 ? 'pt-4' : ''}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.status === 'active' 
                          ? 'bg-green-500' 
                          : activity.status === 'error'
                            ? 'bg-red-500'
                            : 'bg-amber-500'
                      }`} />
                      <div>
                        <div className="font-medium capitalize">{activity.platform}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Home className="h-3 w-3" />
                          <span>Property ID: {activity.property_id.substring(0, 8)}...</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm ${
                        activity.status === 'error' ? 'text-destructive font-medium' : 'text-muted-foreground'
                      }`}>
                        {activity.status}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                        <Clock className="h-3 w-3" />
                        <span>{formatDistanceToNow(new Date(activity.last_synced), { addSuffix: true })}</span>
                      </div>
                    </div>
                  </div>
                  
                  {activity.error_message && (
                    <div className="mt-2 text-sm text-destructive bg-destructive/10 p-2 rounded">
                      {activity.error_message}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center text-muted-foreground">
              No recent sync activity found
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
