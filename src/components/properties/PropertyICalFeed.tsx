
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Check, Copy, RefreshCw, Download, Calendar, Link } from "lucide-react";
import { Platform } from "@/types/enums";
import { calendarService } from "@/services/api-service";
import api from "@/lib/api";
import { SyncStatusBadge } from "@/components/ui/sync-status-badge";
import { format } from 'date-fns';
import { createICalFeedUrl } from '@/components/properties/calendar/CalendarUtils';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';

interface PropertyICalFeedProps {
  propertyId: string;
  platform?: Platform;
}

export function PropertyICalFeed({ propertyId, platform = Platform.MANUAL }: PropertyICalFeedProps) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  
  // Use our utility function to generate the iCal URL
  const icalUrl = createICalFeedUrl(propertyId);
  
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
    toast.success(`Refreshed iCal feed for ${platform}`);
  };
  
  const handleDownloadICalFile = async () => {
    if (!propertyId) return;
    
    try {
      setDownloading(true);
      const url = `/properties/${propertyId}/ical-feed`;
      const blob = await api.getICalFile(url);
      
      // Create a URL for the blob
      const blobUrl = window.URL.createObjectURL(blob);
      
      // Create an anchor element and trigger download
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `property-${propertyId}-${format(new Date(), 'yyyy-MM-dd')}.ics`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(blobUrl);
      document.body.removeChild(a);
      toast.success("iCal file downloaded");
    } catch (err) {
      console.error("Failed to download iCal file:", err);
      toast.error("Failed to download iCal file");
    } finally {
      setDownloading(false);
    }
  };
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="bg-muted/20 pb-3 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">iCal Feed</h3>
          </div>
          <SyncStatusBadge status="success" lastSync={new Date().toISOString()} />
        </div>
      </CardHeader>
      
      <CardContent className="pt-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`ical-${platform}`} className="text-sm font-medium">
            iCal Feed URL
          </Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input 
                id={`ical-${platform}`}
                value={icalUrl}
                readOnly
                className="pr-10 bg-muted/20 border-muted-foreground/20 focus:border-primary"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full hover:bg-transparent"
                onClick={handleCopyToClipboard}
              >
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <Button variant="outline" size="icon" onClick={handleRefresh} className="shadow-sm">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-2 pt-2">
          <Button 
            variant="secondary" 
            size="sm"
            className="flex items-center gap-1 shadow-sm"
            onClick={handleDownloadICalFile}
            disabled={downloading}
          >
            {downloading ? (
              <span className="flex items-center gap-1">
                <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                Downloading...
              </span>
            ) : (
              <>
                <Download className="h-4 w-4 mr-1" />
                Download iCal File
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 shadow-sm"
            onClick={() => {
              if (icalUrl) {
                window.open(icalUrl, '_blank');
              }
            }}
          >
            <Calendar className="h-4 w-4 mr-1" />
            Open in Calendar
          </Button>
        </div>
      </CardContent>
      
      <CardFooter className="text-sm text-muted-foreground bg-muted/10 border-t">
        <p>
          Use this iCal feed URL to sync this property's calendar with external calendars.
          You can add this URL to Google Calendar, Apple Calendar, or any other calendar that supports iCal.
        </p>
      </CardFooter>
    </Card>
  );
}
