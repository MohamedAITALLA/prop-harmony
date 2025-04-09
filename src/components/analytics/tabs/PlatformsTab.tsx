
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { PlatformAnalytics } from "@/services/analytics-service";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

interface PlatformsTabProps {
  data?: PlatformAnalytics;
  isLoading: boolean;
}

export function PlatformsTab({ data, isLoading }: PlatformsTabProps) {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          title="Total Platform Connections"
          value={data?.data?.connections_by_platform?.reduce((total, item) => total + item.count, 0) || 0}
          icon="link"
          isLoading={isLoading}
        />
        
        <StatsCard
          title="Active Connections"
          value={data?.data?.connections_by_status?.find(s => s._id === 'active')?.count || 0}
          icon="check-circle"
          variant="success"
          isLoading={isLoading}
        />
        
        <StatsCard
          title="Connection Errors"
          value={data?.data?.connections_by_status?.find(s => s._id === 'error')?.count || 0}
          icon="alert-triangle"
          variant={
            (data?.data?.connections_by_status?.find(s => s._id === 'error')?.count || 0) > 0
              ? "danger"
              : "success"
          }
          isLoading={isLoading}
        />
      </div>
      
      {data?.data?.sync_errors_by_platform?.some(p => p.count > 0) && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Connection Issues Detected</AlertTitle>
          <AlertDescription>
            There are {data?.data?.sync_errors_by_platform?.reduce((total, item) => total + item.count, 0)} connection errors that need your attention.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Connections by Platform</CardTitle>
            <CardDescription>Distribution of connections across platforms</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {isLoading ? (
              <Skeleton className="w-full h-full" />
            ) : data?.data?.connections_by_platform && data.data.connections_by_platform.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.data.connections_by_platform}
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
                    {data.data.connections_by_platform.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                No connection data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bookings by Platform</CardTitle>
            <CardDescription>Number of bookings by channel</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {isLoading ? (
              <Skeleton className="w-full h-full" />
            ) : data?.data?.bookings_by_platform && data.data.bookings_by_platform.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.data.bookings_by_platform}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="_id" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`${value} bookings`]}
                    contentStyle={{
                      backgroundColor: 'var(--background)',
                      borderColor: 'var(--border)',
                      borderRadius: '0.375rem',
                    }}
                  />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                No booking data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Platform Performance</CardTitle>
          <CardDescription>Performance metrics by platform</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                  <div className="grid grid-cols-3 gap-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : data?.data?.platform_performance_scores ? (
            <div className="space-y-6">
              {data.data.platform_performance_scores.map((platform) => (
                <div key={platform.platform} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium capitalize">{platform.platform}</h3>
                      <Badge variant={Number(platform.reliability_score) > 90 ? "secondary" : Number(platform.reliability_score) > 70 ? "outline" : "destructive"}>
                        {platform.reliability_score}% Reliability
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>Last synced: {new Date(platform.last_synced).toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <Progress 
                    value={parseFloat(platform.reliability_score)} 
                    className={`h-2 ${
                      Number(platform.reliability_score) > 90 
                        ? "bg-green-100" 
                        : Number(platform.reliability_score) > 70
                          ? "bg-amber-100"
                          : "bg-red-100"
                    }`}
                    indicatorClassName={
                      Number(platform.reliability_score) > 90 
                        ? "bg-green-600" 
                        : Number(platform.reliability_score) > 70
                          ? "bg-amber-500"
                          : "bg-red-500"
                    }
                  />
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                    <div className="flex items-center justify-between sm:block">
                      <span className="text-sm text-muted-foreground">Connections</span>
                      <span className="font-medium">{platform.connections_count} total</span>
                    </div>
                    <div className="flex items-center justify-between sm:block">
                      <span className="text-sm text-muted-foreground">Active</span>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">{platform.active_connections}</span>
                        {platform.error_connections > 0 && (
                          <span className="text-sm text-destructive">
                            ({platform.error_connections} with errors)
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:block">
                      <span className="text-sm text-muted-foreground">Bookings</span>
                      <span className="font-medium">{platform.bookings_count} ({platform.average_booking_duration} days avg.)</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center text-muted-foreground">
              No platform performance data available
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
