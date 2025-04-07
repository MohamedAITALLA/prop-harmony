
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from "recharts";
import { format, parseISO, isValid } from "date-fns";
import { Card } from "@/components/ui/card";

interface SyncHistoryItem {
  date: string;
  count: number;
}

interface SyncScheduleChartProps {
  data?: SyncHistoryItem[];
}

export function SyncScheduleChart({ data }: SyncScheduleChartProps) {
  // If no data is provided, generate mock data
  const chartData = data || generateMockData();
  
  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return isValid(date) ? format(date, "MMM dd") : dateString;
    } catch (error) {
      return dateString;
    }
  };

  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <Card className="bg-background border shadow-md p-2 text-sm">
          <p className="font-medium">{formatDate(label)}</p>
          <p>{`Syncs: ${payload[0].value}`}</p>
        </Card>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="date" 
          tickFormatter={formatDate}
          tick={{ fontSize: 12 }}
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          allowDecimals={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="count" fill="#3b82f6" barSize={24} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// Generate mock data if real data is not available
function generateMockData(): SyncHistoryItem[] {
  const data: SyncHistoryItem[] = [];
  const today = new Date();
  
  for (let i = 9; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    data.push({
      date: date.toISOString().split('T')[0],
      count: Math.floor(Math.random() * 10) + 1
    });
  }
  
  return data;
}
