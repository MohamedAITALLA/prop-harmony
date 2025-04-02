
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  BarChart, 
  Bar, 
  LineChart, 
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer
} from "recharts";

interface SyncTabProps {
  syncPerformanceData: Array<{
    name: string;
    duration: number;
    platform: string;
    status: string;
    eventsProcessed: number;
  }>;
  isLoadingSyncLogs: boolean;
}

export function SyncTab({ syncPerformanceData, isLoadingSyncLogs }: SyncTabProps) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Sync Performance History</CardTitle>
          <CardDescription>Duration of sync operations over time</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingSyncLogs ? (
            <div className="h-[400px] w-full">
              <Skeleton className="h-full w-full" />
            </div>
          ) : syncPerformanceData.length > 0 ? (
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={syncPerformanceData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis label={{ value: 'Duration (ms)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-background border border-border p-3 rounded shadow-md">
                            <p className="font-medium">{label}</p>
                            <p>Duration: {payload[0].value} ms</p>
                            <p>Platform: {payload[0].payload.platform}</p>
                            <p>Events: {payload[0].payload.eventsProcessed}</p>
                            <Badge 
                              variant={payload[0].payload.status === "success" ? "outline" : "destructive"}
                              className="mt-1"
                            >
                              {payload[0].payload.status}
                            </Badge>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="duration" 
                    fill="#8884d8" 
                    name="Sync Duration (ms)"
                    fillOpacity={0.8}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[400px] flex items-center justify-center text-muted-foreground">
              No sync performance data available
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Events Processed During Sync</CardTitle>
          <CardDescription>Number of events processed in each sync operation</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingSyncLogs ? (
            <div className="h-[400px] w-full">
              <Skeleton className="h-full w-full" />
            </div>
          ) : syncPerformanceData.length > 0 ? (
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={syncPerformanceData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-background border border-border p-3 rounded shadow-md">
                            <p className="font-medium">{label}</p>
                            <p>Events Processed: {payload[0].value}</p>
                            <p>Platform: {payload[0].payload.platform}</p>
                            <Badge 
                              variant={payload[0].payload.status === "success" ? "outline" : "destructive"}
                              className="mt-1"
                            >
                              {payload[0].payload.status}
                            </Badge>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="eventsProcessed" 
                    stroke="#82ca9d" 
                    activeDot={{ r: 8 }}
                    name="Events Processed"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[400px] flex items-center justify-center text-muted-foreground">
              No event processing data available
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
