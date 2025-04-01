
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyableField } from "@/components/ui/copyable-field";
import { propertyService, icalConnectionService } from "@/services/api-service";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Platform } from "@/types/enums";
import { toast } from "sonner";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PropertyICalFeedProps {
  propertyId: string;
}

export function PropertyICalFeed({ propertyId }: PropertyICalFeedProps) {
  const feedUrl = propertyService.getICalFeedUrl(propertyId);
  const [isAddConnectionOpen, setIsAddConnectionOpen] = useState(false);
  const [newConnection, setNewConnection] = useState({
    platform: Platform.AIRBNB,
    ical_url: "",
    sync_frequency: 60
  });
  
  const { data: connections, isLoading, refetch } = useQuery({
    queryKey: ["ical-connections", propertyId],
    queryFn: async () => {
      try {
        const response = await icalConnectionService.getConnections(propertyId);
        return response.data || [];
      } catch (error) {
        console.error("Error fetching iCal connections:", error);
        return [];
      }
    }
  });

  const handleInputChange = (field: string, value: any) => {
    setNewConnection(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await icalConnectionService.createConnection(propertyId, newConnection);
      toast.success("iCal connection added successfully");
      setIsAddConnectionOpen(false);
      setNewConnection({
        platform: Platform.AIRBNB,
        ical_url: "",
        sync_frequency: 60
      });
      refetch();
    } catch (error) {
      toast.error("Failed to add iCal connection");
    }
  };

  const handleDeleteConnection = async (connectionId: string) => {
    if (!window.confirm("Are you sure you want to delete this connection?")) return;
    
    try {
      await icalConnectionService.deleteConnection(propertyId, connectionId);
      toast.success("iCal connection deleted successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to delete iCal connection");
    }
  };

  const handleTestConnection = async (connectionId: string) => {
    try {
      await icalConnectionService.testConnection(propertyId, connectionId);
      toast.success("iCal connection test successful");
    } catch (error) {
      toast.error("iCal connection test failed");
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Property iCal Feed</CardTitle>
          <CardDescription>
            Share this iCal feed with other platforms to export your calendar
          </CardDescription>
        </div>
        <Dialog open={isAddConnectionOpen} onOpenChange={setIsAddConnectionOpen}>
          <DialogTrigger asChild>
            <Button>Add Platform</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add iCal Connection</DialogTitle>
              <DialogDescription>
                Add a new platform by entering the iCal URL from the platform
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="platform" className="text-right">
                    Platform
                  </Label>
                  <Select 
                    value={newConnection.platform} 
                    onValueChange={(value) => handleInputChange("platform", value)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a platform" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(Platform).map(platform => (
                        <SelectItem key={platform} value={platform}>
                          {platform}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="ical_url" className="text-right">
                    iCal URL
                  </Label>
                  <Input
                    id="ical_url"
                    value={newConnection.ical_url}
                    onChange={(e) => handleInputChange("ical_url", e.target.value)}
                    className="col-span-3"
                    placeholder="https://example.com/ical/feed.ics"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="sync_frequency" className="text-right">
                    Sync Frequency (minutes)
                  </Label>
                  <Input
                    id="sync_frequency"
                    type="number"
                    min="15"
                    max="1440"
                    value={newConnection.sync_frequency}
                    onChange={(e) => handleInputChange("sync_frequency", parseInt(e.target.value))}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Add Connection</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <CopyableField 
          value={feedUrl}
          description="Copy this URL and add it to any platform that supports iCal importing"
        />

        {isLoading ? (
          <div className="flex items-center justify-center h-20">
            <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : connections && connections.length > 0 ? (
          <div className="mt-6 space-y-4">
            <h3 className="text-sm font-medium">Connected Platforms</h3>
            <div className="space-y-2">
              {connections.map((connection) => (
                <div key={connection._id} className="flex items-center justify-between p-3 rounded-md border">
                  <div>
                    <p className="font-medium">{connection.platform}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                      {connection.ical_url}
                    </p>
                    <div className="flex items-center text-xs mt-1 gap-1">
                      <span className={`w-2 h-2 rounded-full ${
                        connection.status === "active" ? "bg-green-500" : 
                        connection.status === "error" ? "bg-red-500" : "bg-amber-500"
                      }`}></span>
                      <span>{connection.status}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleTestConnection(connection._id)}
                    >
                      Test
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDeleteConnection(connection._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-6">
            No connections added yet. Add your first platform connection.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
