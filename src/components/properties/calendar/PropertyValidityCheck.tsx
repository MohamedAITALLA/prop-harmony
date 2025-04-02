
import React, { useState } from 'react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { Separator } from "@/components/ui/separator";
import { CalendarEvent } from "@/types/api-responses";
import { 
  CalendarRange, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ArrowRight, 
  Calendar, 
  CalendarCheck,
  CalendarX,
  Calendar as CalendarIcon,
  Info
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PlatformIcon } from "@/components/ui/platform-icon";
import { EventTypeBadge } from '@/components/ui/event-type-badge';
import calendarService from '@/services/calendar-service';
import { capitalizeFirstLetter } from '@/lib/utils';

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
    <div className="grid gap-8 md:grid-cols-2">
      {/* Date Selection Card */}
      <Card className="md:sticky md:top-24 h-fit shadow-sm border-border/60 bg-card">
        <CardHeader className="space-y-1 bg-muted/20 border-b border-border/40 pb-4">
          <div className="flex items-center gap-2">
            <CalendarCheck className="h-5 w-5 text-primary" />
            <CardTitle>Check Date Availability</CardTitle>
          </div>
          <CardDescription>
            Verify if the property is available for your desired dates
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6 space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="start-date" className="font-medium flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                Start Date
              </Label>
              <DatePicker
                id="start-date"
                date={startDate}
                onSelect={setStartDate}
                placeholder="Select start date"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date" className="font-medium flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                End Date
              </Label>
              <DatePicker
                id="end-date"
                date={endDate}
                onSelect={setEndDate}
                placeholder="Select end date"
                className="w-full"
                disabled={!startDate}
                fromDate={startDate}
              />
            </div>
          </div>
          
          {startDate && endDate && (
            <div className="flex items-center justify-center gap-4 p-3 bg-muted/20 border border-border/40 rounded-md">
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">From</p>
                <div className="text-sm font-medium bg-background border rounded-md py-1.5 px-3">
                  {format(startDate, 'MMM dd, yyyy')}
                </div>
              </div>
              
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">To</p>
                <div className="text-sm font-medium bg-background border rounded-md py-1.5 px-3">
                  {format(endDate, 'MMM dd, yyyy')}
                </div>
              </div>
            </div>
          )}
          
          <Alert variant="default" className="bg-muted/20 border-primary/20 text-foreground">
            <Info className="h-4 w-4 text-primary" />
            <AlertTitle>How it works</AlertTitle>
            <AlertDescription className="text-muted-foreground">
              This tool checks if the selected dates conflict with any existing bookings or events.
            </AlertDescription>
          </Alert>
        </CardContent>
        
        <CardFooter className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-border/40 bg-muted/10">
          <Button
            onClick={handleCheckAvailability}
            disabled={!startDate || !endDate || isChecking}
            className="flex-1 gap-2"
            size="lg"
          >
            {isChecking ? (
              <>
                <span className="animate-spin mr-2">●</span> Checking...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" /> 
                Check Availability
              </>
            )}
          </Button>
          <Button 
            variant="outline" 
            onClick={clearDates} 
            disabled={isChecking}
            className="flex-1 gap-2"
            size="lg"
          >
            <CalendarX className="h-4 w-4" />
            Clear Dates
          </Button>
        </CardFooter>
      </Card>

      {/* Results Card */}
      <Card className="shadow-sm border-border/60 bg-card">
        <CardHeader className="space-y-1 bg-muted/20 border-b border-border/40">
          <div className="flex items-center gap-2">
            <CalendarRange className="h-5 w-5 text-primary" />
            <CardTitle>Availability Results</CardTitle>
          </div>
          <CardDescription>
            View the property availability for your selected dates
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6">
          {isChecking ? (
            <div className="space-y-4 p-8">
              <div className="animate-pulse flex flex-col items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-muted/40"></div>
                <div className="h-6 w-32 bg-muted/40 rounded"></div>
                <div className="h-4 w-48 bg-muted/40 rounded"></div>
                <div className="h-10 w-40 mt-4 bg-muted/40 rounded"></div>
              </div>
            </div>
          ) : !checkPerformed ? (
            <div className="flex flex-col items-center justify-center text-center py-16 px-4 text-muted-foreground">
              <div className="bg-muted/20 h-20 w-20 rounded-full flex items-center justify-center mb-4">
                <CalendarRange className="h-10 w-10 opacity-40" />
              </div>
              <h3 className="text-lg font-medium mb-2">No Check Performed Yet</h3>
              <p className="text-sm max-w-md">
                Select a date range and click "Check Availability" to see if the property is available for booking
              </p>
            </div>
          ) : availabilityResult ? (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 p-4 bg-muted/10 rounded-lg border border-border/40">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">Check Period</p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">{format(startDate as Date, 'MMM dd, yyyy')}</span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    <span className="font-medium">{format(endDate as Date, 'MMM dd, yyyy')}</span>
                  </div>
                </div>
                
                <div className="border-l pl-6 text-center hidden md:block">
                  <p className="text-xs text-muted-foreground mb-1">Duration</p>
                  <div className="text-sm font-medium">
                    {availabilityResult.duration_days || 
                      Math.ceil((new Date(availabilityResult.end_date).getTime() - 
                        new Date(availabilityResult.start_date).getTime()) / 
                        (1000 * 60 * 60 * 24))}{' '}
                    days
                  </div>
                </div>
              </div>
              
              <Separator />
              
              {availabilityResult.is_available ? (
                <div className="flex flex-col items-center justify-center text-center p-8">
                  <div className="bg-green-100 dark:bg-green-900/20 h-20 w-20 rounded-full flex items-center justify-center mb-4 animate-fade-in">
                    <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-green-600 dark:text-green-400 mb-2">Available!</h3>
                  <p className="text-muted-foreground max-w-md mb-6">
                    This property is available for booking during your selected dates. No conflicts were found.
                  </p>
                  <Button className="gap-2" size="lg">
                    <CalendarCheck className="h-4 w-4" /> Create Booking
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center px-4 pb-2">
                  <div className="bg-red-100 dark:bg-red-900/20 h-20 w-20 rounded-full flex items-center justify-center mb-4 animate-fade-in">
                    <XCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">Not Available</h3>
                  <p className="text-muted-foreground mt-1 max-w-md">
                    This property has conflicts with existing events during your selected dates
                  </p>
                </div>
              )}
              
              {!availabilityResult.is_available && availabilityResult.conflicting_events && 
              availabilityResult.conflicting_events.length > 0 && (
                <>
                  <Separator />
                  
                  <div className="space-y-4 pb-2">
                    <h4 className="font-medium flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      Conflicting Events ({availabilityResult.conflicting_events.length})
                    </h4>
                    
                    <div className="grid gap-3 max-h-[300px] overflow-y-auto pr-1">
                      {availabilityResult.conflicting_events.map((event, i) => (
                        <div 
                          key={event._id || i} 
                          className="border rounded-md p-3 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <div className="flex justify-between items-start gap-2">
                            <span className="font-medium">{event.summary}</span>
                            <EventTypeBadge eventType={event.event_type} />
                          </div>
                          <div className="flex items-center gap-2 text-sm mt-2 text-muted-foreground">
                            <PlatformIcon platform={event.platform} size={14} />
                            <span>{capitalizeFirstLetter(event.platform)}</span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5 border-t pt-2 border-red-200/40">
                            <CalendarIcon className="h-3 w-3" />
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
