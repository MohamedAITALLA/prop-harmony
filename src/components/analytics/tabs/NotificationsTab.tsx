
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { NotificationsList } from "@/components/ui/notifications-list";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ['#0088FE', '#FFBB28', '#FF8042', '#00C49F'];

interface NotificationsTabProps {
  notificationsData: any;
  isLoadingNotifications: boolean;
}

export function NotificationsTab({ 
  notificationsData, 
  isLoadingNotifications 
}: NotificationsTabProps) {
  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Property Notifications</CardTitle>
              <CardDescription>Recent notifications for this property</CardDescription>
            </div>
            {notificationsData?.summary?.unread_count ? (
              <Badge variant="secondary" className="ml-2">
                {notificationsData.summary.unread_count} unread
              </Badge>
            ) : null}
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingNotifications ? (
            <div className="space-y-2">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : notificationsData?.notifications?.length ? (
            <NotificationsList
              notifications={notificationsData.notifications.map((n: any) => ({
                _id: n._id,
                title: n.title,
                message: n.message,
                type: n.type,
                severity: n.severity,
                read: n.read,
                created_at: n.created_at,
                property_id: n.property_id,
                user_id: n.user_id
              }))}
              isLoading={false}
              showHeader={false}
              maxHeight="500px"
            />
          ) : (
            <div className="py-10 text-center text-muted-foreground">
              No notifications found for this property
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Notification Severity Breakdown</CardTitle>
          <CardDescription>Distribution of notifications by severity level</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingNotifications ? (
            <div className="h-[300px] w-full flex items-center justify-center">
              <Skeleton className="h-[250px] w-[250px] rounded-full" />
            </div>
          ) : notificationsData?.notifications?.length > 0 ? (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={
                      Object.entries(
                        notificationsData.notifications.reduce((acc: Record<string, number>, n: any) => {
                          acc[n.severity] = (acc[n.severity] || 0) + 1;
                          return acc;
                        }, {})
                      ).map(([severity, count]) => ({
                        name: severity.charAt(0).toUpperCase() + severity.slice(1),
                        value: count as number,
                      }))
                    }
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {[
                      { name: 'Info', color: '#0088FE' },
                      { name: 'Warning', color: '#FFBB28' },
                      { name: 'Critical', color: '#FF8042' },
                      { name: 'Low', color: '#00C49F' }
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-background border border-border p-2 rounded shadow-md">
                            <p className="font-medium">{String(payload[0].name)}</p>
                            <p>Count: {payload[0].value}</p>
                          </div>
                        );
                      }
                      return null;
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No notification data available
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
