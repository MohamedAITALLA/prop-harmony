
import React, { useState } from "react";
import { AlertCircle, Check, X, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

export interface ConflictResolverProps extends React.HTMLAttributes<HTMLDivElement> {
  conflictId: string;
  propertyId: string;
  onResolve?: (action: string, selectedEventId?: string) => Promise<void>;
  events?: Array<{
    id: string;
    platform: string;
    summary: string;
    startDate: string;
    endDate: string;
  }>;
}

export function ConflictResolver({
  conflictId,
  propertyId,
  onResolve,
  events = [],
  ...props
}: ConflictResolverProps) {
  const navigate = useNavigate();
  const [selectedAction, setSelectedAction] = useState<string>("");
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleResolve = async () => {
    if (!selectedAction) {
      toast.error("Please select a resolution action");
      return;
    }

    if (selectedAction === "keep_one" && !selectedEvent) {
      toast.error("Please select which event to keep");
      return;
    }

    setLoading(true);
    try {
      if (onResolve) {
        await onResolve(selectedAction, selectedEvent);
      }
      toast.success("Conflict has been resolved");
    } catch (error) {
      toast.error("Failed to resolve conflict");
    } finally {
      setLoading(false);
    }
  };

  const handleViewCalendar = () => {
    navigate(`/properties/${propertyId}?tab=calendar`);
  };

  return (
    <Card className="border-red-200 bg-red-50/50 dark:bg-red-900/5" {...props}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-600">
          <AlertCircle className="h-5 w-5" />
          <span>Booking Conflict</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="rounded-md border bg-white p-3 dark:bg-black/10">
            <h4 className="mb-2 font-medium">Conflicting Events</h4>
            <div className="space-y-2">
              {events.map((event) => (
                <div key={event.id} className="flex justify-between items-center p-2 rounded-md bg-gray-50 border">
                  <div>
                    <div className="font-medium">{event.summary}</div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Badge variant="outline" className="text-xs">{event.platform}</Badge>
                      <span>{format(new Date(event.startDate), 'MMM dd')} - {format(new Date(event.endDate), 'MMM dd')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-md border bg-white p-3 dark:bg-black/10">
            <h4 className="mb-2 font-medium">How would you like to resolve this conflict?</h4>
            <RadioGroup value={selectedAction} onValueChange={setSelectedAction}>
              <div className="flex items-center space-x-2 py-1">
                <RadioGroupItem value="keep_all" id="keep_all" />
                <Label htmlFor="keep_all">Keep all bookings</Label>
              </div>
              <div className="flex items-center space-x-2 py-1">
                <RadioGroupItem value="keep_one" id="keep_one" />
                <Label htmlFor="keep_one">Keep one booking and delete others</Label>
              </div>
              <div className="flex items-center space-x-2 py-1">
                <RadioGroupItem value="delete_all" id="delete_all" />
                <Label htmlFor="delete_all">Delete all bookings</Label>
              </div>
            </RadioGroup>
          </div>

          {selectedAction === "keep_one" && events.length > 0 && (
            <div className="mt-4 rounded-md border bg-white p-3 dark:bg-black/10">
              <h4 className="mb-2 font-medium">Select which booking to keep:</h4>
              <RadioGroup value={selectedEvent} onValueChange={setSelectedEvent}>
                {events.map((event) => (
                  <div key={event.id} className="flex items-center space-x-2 py-1">
                    <RadioGroupItem value={event.id} id={event.id} />
                    <Label htmlFor={event.id}>
                      {event.platform}: {event.summary} ({format(new Date(event.startDate), 'MMM dd')} - {format(new Date(event.endDate), 'MMM dd')})
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="justify-between">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleViewCalendar}
        >
          <Calendar className="mr-1 h-4 w-4" /> View in Calendar
        </Button>
        <div className="space-x-2">
          <Button variant="outline" size="sm">
            <X className="mr-1 h-4 w-4" /> Cancel
          </Button>
          <Button 
            onClick={handleResolve} 
            size="sm"
            disabled={loading || !selectedAction || (selectedAction === "keep_one" && !selectedEvent)}
          >
            <Check className="mr-1 h-4 w-4" /> Resolve Conflict
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
