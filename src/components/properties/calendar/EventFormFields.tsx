
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EventType, Platform } from "@/types/enums";

interface EventFormFieldsProps {
  formData: {
    platform: string;
    summary: string;
    start_date: string;
    end_date: string;
    event_type: string;
    status: string;
    description: string;
  };
  onInputChange?: (field: string, value: string) => void;
  readOnly?: boolean;
}

export const EventFormFields: React.FC<EventFormFieldsProps> = ({
  formData,
  onInputChange = () => {},
  readOnly = false
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="platform">Platform</Label>
          <Select 
            value={formData.platform} 
            onValueChange={(value) => onInputChange("platform", value)}
            disabled={readOnly}
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
            readOnly={readOnly}
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
              readOnly={readOnly}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end_date">End Date</Label>
            <Input 
              id="end_date" 
              type="datetime-local"
              value={formData.end_date}
              onChange={(e) => onInputChange("end_date", e.target.value)}
              readOnly={readOnly}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="event_type">Event Type</Label>
            <Select 
              value={formData.event_type} 
              onValueChange={(value) => onInputChange("event_type", value)}
              disabled={readOnly}
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
              disabled={readOnly}
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
            readOnly={readOnly}
          />
        </div>
      </div>
    </div>
  );
};
