
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface MiniCalendarProps {
  height?: string;
  action?: string;
}

export function MiniCalendar({ height = "300px", action }: MiniCalendarProps) {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Calendar Overview</CardTitle>
        {action && (
          <Button 
            variant="outline" 
            onClick={() => navigate("/calendar")}
            className="gap-2"
          >
            {action}
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div style={{ height }}>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border w-full"
          />
        </div>
      </CardContent>
    </Card>
  );
}
