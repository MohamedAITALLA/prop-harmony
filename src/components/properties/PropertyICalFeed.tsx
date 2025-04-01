import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { AlertCircle, Copy, Plus, Trash, Check, Loader2, RefreshCw } from "lucide-react";
import { icalConnectionService, propertyService } from "@/services/api-service";
import { ICalConnection } from "@/types/api-responses";
import { Platform } from "@/types/enums";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PlatformIcon } from "@/components/ui/platform-icon";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CircularProgress } from "@/components/ui/circular-progress";
import { convertToMongoIdFormat } from "@/lib/id-conversion";

interface PropertyICalFeedProps {
  propertyId: string;
}

export function PropertyICalFeed({ propertyId }: PropertyICalFeedProps) {
  const [isAddConnectionOpen, setIsAddConnectionOpen] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [newConnection, setNewConnection] = useState({
    platform: "Airbnb" as Platform,
    ical_url: ""
  });
  const [feedUrl, setFeedUrl] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  
  const { data: connections = [], isLoading, refetch } = useQuery({
    queryKey: ["ical-connections", propertyId],
    queryFn: async () => {
      try {
        const response = await icalConnectionService.getConnections(propertyId);
        return response.data;
      } catch (error) {
        console.error("Error fetching connections:", error);
        
        // Mock data for demonstration
        return convertToMongoIdFormat(getMockConnections());
      }
    },
  });
  
  // Get property feed URL
  useQuery({
    queryKey: ["ical-feed-url", propertyId],
    queryFn: async () => {
      try {
        // In a real app, this would be a real API call
        // const response = await icalService.getPropertyFeedUrl(propertyId);
        // return response.data.url;
        
        // For demonstration, use the helper method
        return propertyService.getICalFeedUrl(propertyId);
      } catch (error) {
        console.error("Error fetching feed URL:", error);
        return '';
      }
    },
    onSuccess: (data) => {
      if (data) {
        setFeedUrl(data);
      }
    }
  });
  
  const handleCopyFeedUrl = async () => {
    try {
      await navigator.clipboard.writeText(feedUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast.success("Feed URL copied to clipboard");
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      toast.error("Failed to copy to clipboard");
    }
  };
  
  const handleInputChange = (field: string, value: string) => {
    if (field === "platform") {
      setNewConnection(prev => ({ ...prev, [field]: value as Platform }));
    } else {
      setNewConnection(prev => ({ ...prev, [field]: value }));
    }
  };
  
  const handleAddConnection = async () => {
    if (!newConnection.ical_url) {
      toast.error("Please enter a valid iCal URL");
      return;
    }
    
    try {
      await icalConnectionService.createConnection(propertyId, {
        platform: newConnection.platform,
        ical_url: newConnection.ical_url
      });
      
      toast.success(`${newConnection.platform} calendar connected successfully`);
      setIsAddConnectionOpen(false);
      refetch();
      
      // Reset form
      setNewConnection({
        platform: "Airbnb" as Platform,
        ical_url: ""
      });
    } catch (error) {
      console.error("Error adding connection:", error);
      toast.error("Failed to connect calendar");
    }
  };
  
  const handleTestConnection = async (connectionId: string) => {
    setIsTestingConnection(true);
    
    try {
      await icalConnectionService.testConnection(propertyId, connectionId);
      toast.success("Connection test successful");
    } catch (error) {
      console.error("Error testing connection:", error);
      toast.error("Connection test failed");
    } finally {
      setIsTestingConnection(false);
    }
  };
  
  const handleDeleteConnection = async (connectionId: string) => {
    if (window.confirm("Are you sure you want to delete this connection? This will remove all associated events.")) {
      try {
        await icalConnectionService.deleteConnection(propertyId, connectionId);
        toast.success("Connection deleted successfully");
        refetch();
      } catch (error) {
        console.error("Error deleting connection:", error);
        toast.error("Failed to delete connection");
      }
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Your Property's iCal Feed</CardTitle>
          <Button variant="outline" size="sm" onClick={handleCopyFeedUrl}>
            {isCopied ? (
              <>
                <Check className="mr-2 h-4 w-4" /> Copied
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" /> Copy URL
              </>
            )}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Share this iCal feed with other platforms to sync your property's availability.
            </p>
            
            <div className="flex items-center space-x-2">
              <Input 
                value={feedUrl} 
                readOnly 
                className="font-mono text-sm"
              />
              <Button variant="outline" onClick={handleCopyFeedUrl}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold">External Calendar Connections</h2>
        <Button onClick={() => setIsAddConnectionOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Connection
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <RefreshCw className="h-6 w-6 animate-spin mr-2" />
          <span>Loading connections...</span>
        </div>
      ) : connections.length === 0 ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No connections found</AlertTitle>
          <AlertDescription>
            You haven't added any external calendar connections yet. Add a connection to sync
            availability with other platforms.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {connections.map((connection: ICalConnection) => (
            <Card key={connection._id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center space-x-2">
                  <PlatformIcon platform={connection.platform} />
                  <CardTitle className="text-lg">{connection.platform}</CardTitle>
                </div>
                <Badge 
                  variant={connection.status === 'active' ? 'default' : 
                          connection.status === 'error' ? 'destructive' : 'outline'}
                >
                  {connection.status}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">URL</p>
                    <p className="font-mono text-xs truncate" title={connection.ical_url}>
                      {connection.ical_url}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Last Synced</p>
                    <p>{new Date(connection.last_synced).toLocaleString()}</p>
                  </div>
                  
                  {connection.error_message && (
                    <Alert variant="destructive" className="p-2 text-xs">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle className="text-xs">Sync Error</AlertTitle>
                      <AlertDescription className="text-xs">
                        {connection.error_message}
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="flex justify-between pt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleTestConnection(connection._id)}
                      disabled={isTestingConnection}
                    >
                      {isTestingConnection ? <Loader2 className="h-4 w-4 animate-spin" /> : "Test"}
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDeleteConnection(connection._id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      <Dialog open={isAddConnectionOpen} onOpenChange={setIsAddConnectionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add External Calendar</DialogTitle>
            <DialogDescription>
              Connect an external calendar to sync availability with other platforms.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="platform">Platform</Label>
              <Select 
                value={newConnection.platform} 
                onValueChange={(value) => handleInputChange("platform", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Platform.AIRBNB}>Airbnb</SelectItem>
                  <SelectItem value={Platform.BOOKING}>Booking.com</SelectItem>
                  <SelectItem value={Platform.EXPEDIA}>Expedia</SelectItem>
                  <SelectItem value={Platform.TRIPADVISOR}>TripAdvisor</SelectItem>
                  <SelectItem value={Platform.VRBO}>Vrbo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="ical_url">iCal URL</Label>
              <Input 
                id="ical_url" 
                value={newConnection.ical_url}
                onChange={(e) => handleInputChange("ical_url", e.target.value)}
                placeholder="https://example.com/ical/feed.ics"
              />
            </div>
            
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>How to find your iCal URL</AlertTitle>
              <AlertDescription className="text-xs">
                Most vacation rental platforms provide iCal URLs in their calendar settings or 
                under "Sync calendars" options. Look for terms like "Export calendar" or "Calendar sync".
              </AlertDescription>
            </Alert>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddConnectionOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleAddConnection}>
              Add Connection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function getMockConnections() {
  return [
    {
      _id: "conn-1",
      property_id: "prop-123",
      platform: Platform.AIRBNB,
      ical_url: "https://www.airbnb.com/calendar/ical/12345.ics",
      sync_frequency: 60,
      status: "active",
      last_synced: new Date().toISOString(),
      error_message: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      _id: "conn-2",
      property_id: "prop-123",
      platform: Platform.BOOKING,
      ical_url: "https://admin.booking.com/hotel/ical/12345.ics",
      sync_frequency: 60,
      status: "error",
      last_synced: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      error_message: "Connection timeout when accessing URL",
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
      updated_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 1 day ago
    }
  ];
}
