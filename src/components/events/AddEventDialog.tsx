
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { EventType, Platform } from "@/types/enums";
import { Property } from "@/types/api-responses";
import { eventService } from "@/services/api-service";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface AddEventDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  properties: Property[];
}

export const AddEventDialog: React.FC<AddEventDialogProps> = ({
  isOpen,
  onOpenChange,
  properties
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    property_id: "",
    platform: Platform.MANUAL,
    summary: "",
    start_date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    end_date: format(new Date(Date.now() + 86400000), "yyyy-MM-dd'T'HH:mm"),
    event_type: EventType.BOOKING,
    status: "confirmed",
    description: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.property_id) {
      toast.error("Please select a property");
      return;
    }
    
    if (!formData.summary) {
      toast.error("Please enter a title for the event");
      return;
    }
    
    try {
      setLoading(true);
      const response = await eventService.createEvent(formData.property_id, {
        platform: formData.platform,
        summary: formData.summary,
        start_date: formData.start_date,
        end_date: formData.end_date,
        event_type: formData.event_type,
        status: formData.status,
        description: formData.description
      });
      
      toast.success("Event created successfully");
      onOpenChange(false);
      setFormData({
        property_id: "",
        platform: Platform.MANUAL,
        summary: "",
        start_date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
        end_date: format(new Date(Date.now() + 86400000), "yyyy-MM-dd'T'HH:mm"),
        event_type: EventType.BOOKING,
        status: "confirmed",
        description: ""
      });
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add New Event</DialogTitle>
          <DialogDescription>
            Create a new event for your property
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="property_id">Property</Label>
              <Select 
                value={formData.property_id} 
                onValueChange={(value) => handleInputChange("property_id", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a property" />
                </SelectTrigger>
                <SelectContent>
                  {properties.map((property) => (
                    <SelectItem key={property._id} value={property._id}>
                      {property.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
              <Select 
                value={formData.platform} 
                onValueChange={(value) => handleInputChange("platform", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Platform" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(Platform).map((platform) => (
                    <SelectItem key={platform} value={platform}>
                      {platform}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="summary">Title</Label>
              <Input 
                id="summary" 
                value={formData.summary}
                onChange={(e) => handleInputChange("summary", e.target.value)}
                placeholder="Event title"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date</Label>
                <Input 
                  id="start_date" 
                  type="datetime-local"
                  value={formData.start_date}
                  onChange={(e) => handleInputChange("start_date", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_date">End Date</Label>
                <Input 
                  id="end_date" 
                  type="datetime-local"
                  value={formData.end_date}
                  onChange={(e) => handleInputChange("end_date", e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="event_type">Event Type</Label>
                <Select 
                  value={formData.event_type} 
                  onValueChange={(value) => handleInputChange("event_type", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Event Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {[EventType.BOOKING, EventType.BLOCKED, EventType.MAINTENANCE].map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => handleInputChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="tentative">Tentative</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Add any additional details..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Event"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
