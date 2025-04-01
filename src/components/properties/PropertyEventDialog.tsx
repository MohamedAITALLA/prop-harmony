
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EventType, Platform } from "@/types/enums";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface EventFormData {
  property_id: string;
  platform: Platform;
  summary: string;
  start_date: string;
  end_date: string;
  event_type: EventType;
  status: string;
  description: string;
}

interface PropertyEventDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: EventFormData;
  onInputChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const PropertyEventDialog: React.FC<PropertyEventDialogProps> = ({
  isOpen,
  onOpenChange,
  formData,
  onInputChange,
  onSubmit
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add New Calendar Event</DialogTitle>
          <DialogDescription>
            Create a new event for this property.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="platform">Platform</Label>
                <Select 
                  value={formData.platform} 
                  onValueChange={(value) => onInputChange("platform", value)}
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
                  onChange={(e) => onInputChange("summary", e.target.value)}
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
                    onChange={(e) => onInputChange("start_date", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date</Label>
                  <Input 
                    id="end_date" 
                    type="datetime-local"
                    value={formData.end_date}
                    onChange={(e) => onInputChange("end_date", e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="event_type">Event Type</Label>
                  <Select 
                    value={formData.event_type} 
                    onValueChange={(value) => onInputChange("event_type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Event Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(EventType).map((type) => (
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
                    onValueChange={(value) => onInputChange("status", value)}
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
                  onChange={(e) => onInputChange("description", e.target.value)}
                  placeholder="Add any additional details..."
                  rows={3}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Event</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
