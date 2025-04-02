
import React, { useState } from 'react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarEvent } from "@/types/api-responses";
import { CalendarRange, CheckCircle2, AlertTriangle, XCircle, ArrowRight, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PlatformIcon } from "@/components/ui/platform-icon";
import { EventTypeBadge } from '@/components/ui/event-type-badge';
import calendarService from '@/services/calendar-service';

interface PropertyValidityCheckProps {
  propertyId: string;
}

interface AvailabilityResult {
  property_id: string;
  start_date: string;
  end_date: string;
  is_available: boolean;
  conflicting_events?: CalendarEvent[];
  duration_days?: number;
}

export const PropertyValidityCheck: React.FC<PropertyValidityCheckProps> = ({ propertyId }) => {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [isChecking, setIsChecking] = useState(false);
  const [availabilityResult, setAvailabilityResult] = useState<AvailabilityResult | null>(null);
  const [checkPerformed, setCheckPerformed] = useState(false);

  const handleCheckAvailability = async () => {
    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates");
      return;
    }

    if (startDate > endDate) {
      toast.error("Start date cannot be after end date");
      return;
    }

    try {
      setIsChecking(true);
      setCheckPerformed(true);
      
      const formattedStartDate = format(startDate, 'yyyy-MM-dd');
      const formattedEndDate = format(endDate, 'yyyy-MM-dd');
      
      const response = await calendarService.checkAvailability(
        propertyId, 
        formattedStartDate, 
        formattedEndDate
      );
      
      setAvailabilityResult(response.data);
      
      if (response.data?.is_available) {
        toast.success("The property is available for the selected dates!");
      } else {
        toast.error("The property is not available for the selected dates.");
      }
    } catch (error) {
      console.error("Error checking availability:", error);
      toast.error("Failed to check availability. Please try again.");
    } finally {
      setIsChecking(false);
    }
  };

  const clearDates = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setAvailabilityResult(null);
    setCheckPerformed(false);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="md:col-span-1 h-fit">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" /> Check Date Availability
          </CardTitle>
          <CardDescription>
            Select a date range to check if the property is available
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <DatePicker
                id="start-date"
                date={startDate}
                onSelect={setStartDate}
                placeholder="Select start date"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <DatePicker
                id="end-date"
                date={endDate}
                onSelect={setEndDate}
                placeholder="Select end date"
                disabled={!startDate}
                fromDate={startDate}
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button
              onClick={handleCheckAvailability}
              disabled={!startDate || !endDate || isChecking}
              className="flex-1"
            >
              {isChecking ? (
                <>
                  <span className="animate-spin mr-2">●</span> Checking...
                </>
              ) : (
                <>Check Availability</>
              )}
            </Button>
            <Button 
              variant="outline" 
              onClick={clearDates} 
              disabled={isChecking}
              className="flex-1"
            >
              Clear
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p>
              This will check if the selected dates are available for booking based on existing events.
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Availability Result</CardTitle>
          <CardDescription>
            View the availability status for your selected dates
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isChecking ? (
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : !checkPerformed ? (
            <div className="flex flex-col items-center justify-center text-center py-10 text-muted-foreground">
              <CalendarRange className="h-12 w-12 mb-3 opacity-20" />
              <h3 className="text-lg font-medium">No Check Performed Yet</h3>
              <p className="text-sm max-w-md mt-1">
                Select a date range and click "Check Availability" to see if the property is available
              </p>
            </div>
          ) : availabilityResult ? (
            <div className="space-y-6">
              <div className="flex items-center justify-center gap-4 sm:gap-6 p-4">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">From</p>
                  <div className="text-sm font-medium border rounded-md py-2 px-3 bg-background">
                    {format(startDate as Date, 'MMM dd, yyyy')}
                  </div>
                </div>
                
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">To</p>
                  <div className="text-sm font-medium border rounded-md py-2 px-3 bg-background">
                    {format(endDate as Date, 'MMM dd, yyyy')}
                  </div>
                </div>
                
                <div className="hidden sm:block border-l pl-6 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Duration</p>
                  <div className="text-sm font-medium py-2">
                    {availabilityResult.duration_days || 
                      Math.ceil((new Date(availabilityResult.end_date).getTime() - 
                        new Date(availabilityResult.start_date).getTime()) / 
                        (1000 * 60 * 60 * 24))} days
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex flex-col items-center justify-center text-center py-4">
                {availabilityResult.is_available ? (
                  <>
                    <div className="bg-green-100 dark:bg-green-900/20 h-16 w-16 rounded-full flex items-center justify-center mb-3">
                      <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-green-600 dark:text-green-500">Available!</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      This property is available for the selected dates
                    </p>
                    <Button className="mt-4" variant="outline">
                      <Calendar className="mr-2 h-4 w-4" /> Create Booking
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="bg-red-100 dark:bg-red-900/20 h-16 w-16 rounded-full flex items-center justify-center mb-3">
                      <XCircle className="h-8 w-8 text-red-600 dark:text-red-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-red-600 dark:text-red-500">Not Available</h3>
                    <p className="text-sm text-muted-foreground mt-1 max-w-md">
                      This property has conflicts with existing events during the selected dates
                    </p>
                  </>
                )}
              </div>
              
              {!availabilityResult.is_available && availabilityResult.conflicting_events && 
              availabilityResult.conflicting_events.length > 0 && (
                <>
                  <Separator />
                  
                  <div className="space-y-4">
                    <h4 className="font-medium flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      Conflicting Events
                    </h4>
                    
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                      {availabilityResult.conflicting_events.map((event) => (
                        <div 
                          key={event._id} 
                          className="border rounded-md p-3 bg-red-50 dark:bg-red-900/10"
                        >
                          <div className="flex justify-between items-start">
                            <span className="font-medium">{event.summary}</span>
                            <EventTypeBadge eventType={event.event_type} />
                          </div>
                          <div className="flex items-center gap-2 text-sm mt-2">
                            <PlatformIcon platform={event.platform} size={14} />
                            <span className="text-muted-foreground">{event.platform}</span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{format(new Date(event.start_date), 'MMM dd')} – {format(new Date(event.end_date), 'MMM dd, yyyy')}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Alert variant="destructive" className="border-red-300 bg-red-50 dark:bg-red-900/10">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error checking availability</AlertTitle>
              <AlertDescription>
                There was a problem checking the availability. Please try again or contact support.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
