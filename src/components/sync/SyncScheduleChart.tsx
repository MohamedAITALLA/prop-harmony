
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { syncService } from "@/services/api-service";
import { toast } from "sonner";

export function SyncScheduleChart() {
  // Fetch sync schedule data
  const { data: scheduleData, isLoading } = useQuery({
    queryKey: ["sync", "schedule"],
    queryFn: async () => {
      try {
        // In a real app, this would use the actual API
        //const response = await syncService.getSyncSchedule();
        //return response.data.schedule;
        
        // For development purposes, return mock data
        return getMockSyncSchedule();
      } catch (error) {
        console.error("Error fetching sync schedule:", error);
        toast.error("Failed to load sync schedule");
        return [];
      }
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={scheduleData || []} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis 
          dataKey="time" 
          tick={{ fontSize: 12 }} 
          tickMargin={10}
        />
        <YAxis allowDecimals={false} />
        <Tooltip 
          formatter={(value: number, name: string) => [`${value} properties`, 'Scheduled Syncs']}
          labelFormatter={(label) => `Time: ${label}`}
        />
        <Bar 
          dataKey="count" 
          name="Scheduled Syncs" 
          fill="#8884d8" 
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

// Mock data function for development purposes
function getMockSyncSchedule() {
  const hours = [];
  const now = new Date();
  const currentHour = now.getHours();
  
  for (let i = 0; i < 24; i++) {
    const hour = (currentHour + i) % 24;
    const hourFormatted = hour === 0 ? '12 AM' : 
                          hour === 12 ? '12 PM' : 
                          hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
    
    // Generate random count with some pattern (more syncs during business hours)
    let count;
    if (hour >= 9 && hour <= 17) {
      count = Math.floor(Math.random() * 3) + 1; // 1-3 during business hours
    } else {
      count = Math.random() > 0.7 ? 1 : 0; // Occasional syncs outside business hours
    }
    
    hours.push({
      hour,
      time: hourFormatted,
      count
    });
  }
  
  return hours;
}
