
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Check, Copy, RefreshCw } from "lucide-react";
import { Platform } from "@/types/enums";
import { calendarService } from "@/services/api-service";

interface PropertyICalFeedProps {
  propertyId: string;
  platform?: Platform;
}

export function PropertyICalFeed({ propertyId, platform = Platform.MANUAL }: PropertyICalFeedProps) {
  const [copied, setCopied] = useState(false);
  
  // Fetch iCal feed URL from API
  const { data: response, isLoading, refetch } = useQuery({
    queryKey: [`property-ical-feed-${propertyId}`],
    queryFn: async () => {
      return await calendarService.getICalFeed(propertyId);
    },
  });
  
  const icalUrl = response?.data || '';
  
  const handleCopyToClipboard = async () => {
    if (!icalUrl) return;
    
    try {
      await navigator.clipboard.writeText(icalUrl);
      setCopied(true);
      toast.success("iCal feed URL copied to clipboard");
      
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      toast.error("Failed to copy. Please try again.");
    }
  };
  
  const handleRefresh = () => {
    refetch();
    toast.success(`Refreshed iCal feed for ${platform}`);
  };
  
  if (isLoading) {
    return <div className="flex items-center justify-center p-4">Loading iCal feed...</div>;
  }
  
  return (
    <div className="space-y-4 w-full">
      <div className="space-y-2">
        <Label htmlFor={`ical-${platform}`}>
          iCal Feed URL
        </Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input 
              id={`ical-${platform}`}
              value={icalUrl}
              readOnly
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full"
              onClick={handleCopyToClipboard}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <Button variant="outline" size="icon" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        Use this iCal feed URL to sync this property's calendar with external calendars.
      </p>
    </div>
  );
}
