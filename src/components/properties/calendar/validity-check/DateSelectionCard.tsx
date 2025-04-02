
import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  CalendarCheck,
  CalendarX,
  Calendar,
  Info,
  ArrowRight,
} from 'lucide-react';

interface DateSelectionCardProps {
  startDate: Date | undefined;
  endDate: Date | undefined;
  setStartDate: (date: Date | undefined) => void;
  setEndDate: (date: Date | undefined) => void;
  onCheckAvailability: () => void;
  onClearDates: () => void;
  isChecking: boolean;
}

export const DateSelectionCard: React.FC<DateSelectionCardProps> = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  onCheckAvailability,
  onClearDates,
  isChecking,
}) => {
  return (
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
          onClick={onCheckAvailability}
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
              <CalendarCheck className="h-4 w-4" /> 
              Check Availability
            </>
          )}
        </Button>
        <Button 
          variant="outline" 
          onClick={onClearDates} 
          disabled={isChecking}
          className="flex-1 gap-2"
          size="lg"
        >
          <CalendarX className="h-4 w-4" />
          Clear Dates
        </Button>
      </CardFooter>
    </Card>
  );
};
