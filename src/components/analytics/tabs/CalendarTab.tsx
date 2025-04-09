
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { CalendarAnalytics } from "@/services/analytics-service";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, CalendarCheck, CalendarClock, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

interface CalendarAnalyticsTabProps {
  data?: CalendarAnalytics;
  isLoading: boolean;
  dateRange: {
    from?: Date;
    to?: Date;
  };
}

export function CalendarAnalyticsTab({ data, isLoading, dateRange }: CalendarAnalyticsTabProps) {
  const formattedDateRange = dateRange.from && dateRange.to
    ? `${format(dateRange.from, 'PPP')} - ${format(dateRange.to, 'PPP')}`
    : 'All time';

  return (
    <>
      <div className="flex flex-col space-y-1.5 mb-4">
        <h2 className="text-2xl font-semibold tracking-tight">Calendar Analytics</h2>
        <p className="text-sm text-muted-foreground">
          Analysis period: <span className="font-medium">{formattedDateRange}</span>
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          title="Current Occupancy"
          value={data?.data?.occupancy_rate || "0%"}
          icon="percent"
          variant={
            parseFloat((data?.data?.occupancy_rate || "0").toString()) > 70
              ? "success"
              : "default"
          }
          isLoading={isLoading}
        />
        
        <StatsCard
          title="Total Conflicts"
          value={data?.data?.total_conflicts || 0}
          icon="alert-triangle"
          variant={
            (data?.data?.total_conflicts || 0) > 0
              ? "warning" 
              : "success"
          }
          isLoading={isLoading}
        />
        
        <StatsCard
          title="Active Conflicts"
          value={data?.data?.active_conflicts || 0}
          icon="alert-circle"
          variant={
            (data?.data?.active_conflicts || 0) > 0
              ? "danger"
              : "success"
          }
          isLoading={isLoading}
        />
      </div>
      
      {data?.data?.active_conflicts && data.data.active_conflicts > 0 && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Active Calendar Conflicts</AlertTitle>
          <AlertDescription>
            There {data.data.active_conflicts === 1 ? 'is' : 'are'} {data.data.active_conflicts} active calendar conflict{data.data.active_conflicts !== 1 ? 's' : ''} that need{data.data.active_conflicts === 1 ? 's' : ''} your attention.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Events by Type</CardTitle>
            <CardDescription>Distribution of calendar events by type</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {isLoading ? (
              <Skeleton className="w-full h-full" />
            ) : data?.data?.events_by_type && data.data.events_by_type.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.data.events_by_type}
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
                    {data.data.events_by_type.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [`${value} events`, name]}
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
                No event type data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>Monthly Availability</CardTitle>
              <CardDescription>Occupancy and availability rates by month</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="h-[300px]">
            {isLoading ? (
              <Skeleton className="w-full h-full" />
            ) : data?.data?.availability_by_month && data.data.availability_by_month.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data.data.availability_by_month}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month_name" />
                  <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                  <Tooltip
                    formatter={(value) => [`${value}%`]}
                    labelFormatter={(label) => `${label}`}
                    contentStyle={{
                      backgroundColor: 'var(--background)',
                      borderColor: 'var(--border)',
                      borderRadius: '0.375rem',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey={(data) => parseFloat(data.occupancy_rate.replace('%', ''))}
                    name="Occupancy Rate"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey={(data) => parseFloat(data.availability_rate.replace('%', ''))}
                    name="Availability Rate"
                    stroke="#82ca9d"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                No availability data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Availability Details</CardTitle>
          <CardDescription>Detailed occupancy and availability data by month</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array(3).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : data?.data?.availability_by_month && data.data.availability_by_month.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {data.data.availability_by_month.map((month) => (
                <Card key={`${month.year}-${month.month}`} className="overflow-hidden border">
                  <CardHeader className="p-4">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base font-medium">{month.month_name} {month.year}</CardTitle>
                      <Badge 
                        variant={
                          parseFloat(month.occupancy_rate) > 70
                            ? "success"
                            : parseFloat(month.occupancy_rate) > 40
                              ? "default"
                              : "outline"
                        }
                      >
                        {month.occupancy_rate} Occupied
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Occupied days:</span>
                        <p className="font-medium">{month.occupied_days} days</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Available days:</span>
                        <p className="font-medium">{month.total_days - month.occupied_days} days</p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-muted-foreground">Availability rate:</span>
                        <p className="font-medium">{month.availability_rate}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center text-muted-foreground">
              No monthly availability data available
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
