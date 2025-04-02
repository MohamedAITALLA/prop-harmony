
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
  Loader2,
  Calendar as CalendarIcon, 
  ArrowRight
} from "lucide-react";

interface PropertyAvailabilityCheckerProps {
  propertyId: string;
}

interface AvailabilityResponse {
  success: boolean;
  data: {
    property_id: string;
    start_date: string;
    end_date: string;
    is_available: boolean;
    conflicting_events: Array<any>;
    duration_days: number;
  };
  message: string;
  timestamp: string;
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
  
  // Extract availability information using the correct data structure
  const isAvailable = availabilityData?.data?.is_available;
  const conflictingEvents = availabilityData?.data?.conflicting_events || [];
  const durationDays = availabilityData?.data?.duration_days || 
    (dateRange?.from && dateRange?.to 
      ? differenceInDays(dateRange.to, dateRange.from) + 1 
      : 0);
  
  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="bg-muted/20 pb-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-primary" />
          <CardTitle>Check Availability</CardTitle>
        </div>
        <CardDescription>
          Select date range to check if the property is available
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="space-y-4">
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={setDateRange}
            numberOfMonths={1}
            disabled={[
              { before: new Date() }  // Disable past dates
            ]}
            className="rounded-md border mx-auto"
          />
          
          {dateRange?.from && dateRange?.to && (
            <div className="mt-4 bg-muted/20 p-3 rounded-md border flex items-center justify-center gap-3 text-sm">
              <div className="font-medium">{format(dateRange.from, 'MMM dd, yyyy')}</div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <div className="font-medium">{format(dateRange.to, 'MMM dd, yyyy')}</div>
              <div className="text-muted-foreground ml-1">
                ({durationDays} {durationDays === 1 ? 'day' : 'days'})
              </div>
            </div>
          )}
          
          {availabilityData && (
            <div className="mt-4 p-4 rounded-md border">
              {isAvailable ? (
                <div className="flex flex-col items-center text-green-600 py-2">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mb-2">
                    <Check className="h-6 w-6" />
                  </div>
                  <span className="font-medium text-center">Property is available for these dates!</span>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex flex-col items-center text-red-600">
                    <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center mb-2">
                      <X className="h-6 w-6" />
                    </div>
                    <span className="font-medium text-center">Property is not available</span>
                  </div>
                  
                  {conflictingEvents.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2 text-center">Conflicting events:</p>
                      <ul className="space-y-2 max-h-32 overflow-y-auto bg-muted/10 rounded-md p-2">
                        {conflictingEvents.map((event: any, index: number) => (
                          <li key={index} className="flex items-center text-sm bg-background p-2 rounded-md shadow-sm">
                            <span className="w-3 h-3 rounded-full bg-red-500 mr-2 flex-shrink-0"></span>
                            <div>
                              <span className="font-semibold">{event.summary}</span>
                              <div className="text-muted-foreground text-xs">
                                {format(new Date(event.start_date), 'MMM dd')} - {format(new Date(event.end_date), 'MMM dd')}
                              </div>
                            </div>
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
