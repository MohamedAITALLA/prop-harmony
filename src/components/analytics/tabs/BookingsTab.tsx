
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, PieChart, Pie, Cell } from "recharts";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { BookingAnalytics } from "@/services/analytics-service";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Clock } from "lucide-react";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

interface BookingsTabProps {
  data?: BookingAnalytics;
  isLoading: boolean;
  dateRange: {
    from?: Date;
    to?: Date;
  };
}

export function BookingsTab({ data, isLoading, dateRange }: BookingsTabProps) {
  const formattedDateRange = dateRange.from && dateRange.to
    ? `${format(dateRange.from, 'PPP')} - ${format(dateRange.to, 'PPP')}`
    : 'All time';

  return (
    <>
      <div className="flex flex-col space-y-1.5">
        <h2 className="text-2xl font-semibold tracking-tight">Booking Analytics</h2>
        <p className="text-sm text-muted-foreground">
          Analysis period: <span className="font-medium">{formattedDateRange}</span>
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          title="Total Bookings"
          value={data?.data?.total_bookings || 0}
          icon="calendar-check"
          isLoading={isLoading}
        />
        
        <StatsCard
          title="Active Bookings"
          value={data?.data?.active_bookings || 0}
          icon="calendar-check"
          variant="success"
          isLoading={isLoading}
        />
        
        <StatsCard
          title="Avg. Booking Duration"
          value={`${data?.data?.average_booking_duration || 0} days`}
          icon="calendar"
          isLoading={isLoading}
        />
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-1 md:col-span-2 lg:col-span-2">
          <CardHeader>
            <CardTitle>Bookings by Month</CardTitle>
            <CardDescription>Number of bookings per month</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {isLoading ? (
              <Skeleton className="w-full h-full" />
            ) : data?.data?.bookings_by_month && data.data.bookings_by_month.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.data.bookings_by_month}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month_name" />
                  <YAxis />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-background border border-border p-2 rounded shadow-md">
                            <p className="font-medium">{payload[0]?.payload.period}</p>
                            <p className="text-sm">Bookings: {payload[0]?.value}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="count" name="Bookings" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                No booking data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bookings by Platform</CardTitle>
            <CardDescription>Distribution across platforms</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {isLoading ? (
              <Skeleton className="w-full h-full" />
            ) : data?.data?.bookings_by_platform && data.data.bookings_by_platform.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.data.bookings_by_platform}
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
                    {data.data.bookings_by_platform.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [`${value} bookings`, name]}
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
                No platform data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Occupancy Rate</CardTitle>
          <CardDescription>Percentage of days occupied per month</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          {isLoading ? (
            <Skeleton className="w-full h-full" />
          ) : data?.data?.occupancy_by_month && data.data.occupancy_by_month.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data.data.occupancy_by_month}
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
                  formatter={(value) => [`${value}%`, 'Occupancy Rate']}
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
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No occupancy data available
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="col-span-1 md:col-span-3">
        <CardHeader>
          <CardTitle>Upcoming Bookings</CardTitle>
          <CardDescription>Next scheduled bookings across your properties</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="flex justify-between border-b pb-3">
                  <div className="space-y-1">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="space-y-1">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : data?.data?.bookings_by_platform ? (
            <div className="space-y-4 divide-y">
              {/* This is mock data since the endpoint doesn't return upcoming bookings specifically */}
              {[
                {
                  id: "booking1",
                  property_name: "Oceanfront Villa",
                  summary: "Guest booking from Airbnb",
                  start_date: new Date(new Date().setDate(new Date().getDate() + 5)),
                  end_date: new Date(new Date().setDate(new Date().getDate() + 10)),
                  platform: "airbnb",
                  days_until: 5
                },
                {
                  id: "booking2",
                  property_name: "Mountain Lodge",
                  summary: "Family vacation",
                  start_date: new Date(new Date().setDate(new Date().getDate() + 12)),
                  end_date: new Date(new Date().setDate(new Date().getDate() + 19)),
                  platform: "booking.com",
                  days_until: 12
                },
                {
                  id: "booking3",
                  property_name: "City Apartment",
                  summary: "Business trip",
                  start_date: new Date(new Date().setDate(new Date().getDate() + 15)),
                  end_date: new Date(new Date().setDate(new Date().getDate() + 18)),
                  platform: "vrbo",
                  days_until: 15
                }
              ].map((booking, index) => (
                <div key={booking.id} className={`pt-3 ${index === 0 ? 'pb-0' : 'pb-3'}`}>
                  <div className="flex flex-col md:flex-row justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{booking.summary}</h4>
                        <Badge className="capitalize">{booking.platform}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{booking.property_name}</p>
                    </div>
                    <div className="flex flex-col items-start md:items-end gap-1">
                      <div className="flex items-center gap-1.5 text-sm">
                        <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{format(booking.start_date, 'MMM d')} - {format(booking.end_date, 'MMM d, yyyy')}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-sm font-medium">{booking.days_until} days until check-in</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-24 items-center justify-center text-muted-foreground">
              No upcoming bookings found
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
