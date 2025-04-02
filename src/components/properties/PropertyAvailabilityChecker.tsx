
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { format, differenceInDays, addDays } from 'date-fns';
import { calendarService } from "@/services/api-service";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { 
  Check,
  X, 
  CalendarRange, 
  Loader2 
} from "lucide-react";

interface PropertyAvailabilityCheckerProps {
  propertyId: string;
}

export function PropertyAvailabilityChecker({ propertyId }: PropertyAvailabilityCheckerProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isChecking, setIsChecking] = useState(false);
  
  const { data: availabilityData, isLoading, refetch } = useQuery({
    queryKey: ['property-availability', propertyId, dateRange],
    queryFn: async () => {
      if (!dateRange?.from || !dateRange?.to) return null;
      
      const startDate = format(dateRange.from, 'yyyy-MM-dd');
      const endDate = format(dateRange.to, 'yyyy-MM-dd');
      
      return await calendarService.checkAvailability(propertyId, startDate, endDate);
    },
    enabled: false, // Don't run automatically
  });
  
  const handleCheckAvailability = async () => {
    if (!dateRange?.from || !dateRange?.to) return;
    
    setIsChecking(true);
    await refetch();
    setIsChecking(false);
  };
  
  const isAvailable = availabilityData?.data?.available;
  const conflictingEvents = availabilityData?.data?.conflicts || [];
  
  const durationDays = dateRange?.from && dateRange?.to 
    ? differenceInDays(dateRange.to, dateRange.from) + 1 
    : 0;
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Check Availability</CardTitle>
        <CardDescription>
          Select date range to check if the property is available
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={setDateRange}
            numberOfMonths={1}
            disabled={[
              { before: new Date() }  // Disable past dates
            ]}
            className="rounded-md border"
          />
          
          {dateRange?.from && dateRange?.to && (
            <div className="pt-2">
              <p className="text-sm font-medium">
                Selected period: {format(dateRange.from, 'MMM dd, yyyy')} - {format(dateRange.to, 'MMM dd, yyyy')}
                {" "}({durationDays} {durationDays === 1 ? 'day' : 'days'})
              </p>
            </div>
          )}
          
          {availabilityData && (
            <div className="mt-4 p-4 rounded-md border">
              {isAvailable ? (
                <div className="flex items-center text-green-600">
                  <Check className="h-5 w-5 mr-2" />
                  <span className="font-medium">Property is available for these dates!</span>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center text-red-600">
                    <X className="h-5 w-5 mr-2" />
                    <span className="font-medium">Property is not available for these dates</span>
                  </div>
                  
                  {conflictingEvents.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium">Conflicting events:</p>
                      <ul className="mt-1 text-sm space-y-1">
                        {conflictingEvents.map((event: any, index: number) => (
                          <li key={index} className="flex items-center">
                            <span className="text-muted-foreground mr-2">•</span>
                            <span>{event.summary}: {format(new Date(event.start_date), 'MMM dd')} - {format(new Date(event.end_date), 'MMM dd')}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handleCheckAvailability}
          disabled={!dateRange?.from || !dateRange?.to || isChecking}
          className="w-full"
        >
          {isChecking || isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Checking...
            </>
          ) : (
            <>
              <CalendarRange className="h-4 w-4 mr-2" />
              Check Availability
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
