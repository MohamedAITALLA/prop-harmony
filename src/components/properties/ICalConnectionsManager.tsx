
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { icalConnectionService } from '@/services/api-service';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, RefreshCw, Trash2, Edit, AlertTriangle, Check } from "lucide-react";
import { Platform, ConnectionStatus } from "@/types/enums";
import { ICalConnection } from "@/types/api-responses";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ICalConnectionsManagerProps {
  propertyId: string;
}

export function ICalConnectionsManager({ propertyId }: ICalConnectionsManagerProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isTestDialogOpen, setIsTestDialogOpen] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState<ICalConnection | null>(null);
  const [newConnection, setNewConnection] = useState({
    platform: Platform.AIRBNB,
    ical_url: '',
    sync_frequency: 12
  });

  const queryClient = useQueryClient();

  // Fetch all connections
  const { data, isLoading, isError } = useQuery({
    queryKey: [`property-ical-connections-${propertyId}`],
    queryFn: async () => {
      return await icalConnectionService.getConnections(propertyId);
    }
  });

  // Create connection mutation
  const createMutation = useMutation({
    mutationFn: (connectionData: { platform: string; ical_url: string; sync_frequency?: number }) => {
      return icalConnectionService.createConnection(propertyId, connectionData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`property-ical-connections-${propertyId}`] });
      setIsAddDialogOpen(false);
      toast.success("Connection created successfully");
      resetForm();
    },
    onError: (error) => {
      toast.error("Failed to create connection");
      console.error("Error creating connection:", error);
    }
  });

  // Update connection mutation
  const updateMutation = useMutation({
    mutationFn: (data: { connectionId: string; connectionData: Partial<{ platform: string; ical_url: string; sync_frequency: number; status: string; }> }) => {
      return icalConnectionService.updateConnection(propertyId, data.connectionId, data.connectionData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`property-ical-connections-${propertyId}`] });
      setIsEditDialogOpen(false);
      toast.success("Connection updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update connection");
      console.error("Error updating connection:", error);
    }
  });

  // Delete connection mutation
  const deleteMutation = useMutation({
    mutationFn: (connectionId: string) => {
      return icalConnectionService.deleteConnection(propertyId, connectionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`property-ical-connections-${propertyId}`] });
      setIsDeleteDialogOpen(false);
      toast.success("Connection deleted successfully");
      setSelectedConnection(null);
    },
    onError: (error) => {
      toast.error("Failed to delete connection");
      console.error("Error deleting connection:", error);
    }
  });

  // Test connection mutation
  const testMutation = useMutation({
    mutationFn: (connectionId: string) => {
      return icalConnectionService.testConnection(propertyId, connectionId);
    },
    onSuccess: (data) => {
      // Fix: Check data.data (the actual response data) for the connection test result
      if (data.data.success) {
        toast.success("Connection test passed successfully");
      } else {
        toast.error(`Connection test failed: ${data.data.results?.error || 'Unknown error'}`);
      }
      setIsTestDialogOpen(false);
    },
    onError: (error) => {
      toast.error("Failed to test connection");
      console.error("Error testing connection:", error);
    }
  });

  const handleAddConnection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newConnection.platform || !newConnection.ical_url) {
      toast.error("Please fill in all required fields");
      return;
    }

    createMutation.mutate({
      platform: newConnection.platform,
      ical_url: newConnection.ical_url,
      sync_frequency: newConnection.sync_frequency
    });
  };

  const handleUpdateConnection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConnection) return;

    updateMutation.mutate({
      connectionId: selectedConnection._id,
      connectionData: {
        ical_url: selectedConnection.ical_url,
        sync_frequency: selectedConnection.sync_frequency,
        platform: selectedConnection.platform,
        status: selectedConnection.status
      }
    });
  };

  const handleDeleteConnection = () => {
    if (!selectedConnection) return;
    deleteMutation.mutate(selectedConnection._id);
  };

  const handleTestConnection = () => {
    if (!selectedConnection) return;
    testMutation.mutate(selectedConnection._id);
  };

  const handleEditClick = (connection: ICalConnection) => {
    setSelectedConnection(connection);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (connection: ICalConnection) => {
    setSelectedConnection(connection);
    setIsDeleteDialogOpen(true);
  };

  const handleTestClick = (connection: ICalConnection) => {
    setSelectedConnection(connection);
    setIsTestDialogOpen(true);
  };

  const resetForm = () => {
    setNewConnection({
      platform: Platform.AIRBNB,
      ical_url: '',
      sync_frequency: 12
    });
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-4">Loading iCal connections...</div>;
  }

  if (isError) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>iCal Connections</CardTitle>
          <CardDescription>Connect external calendars via iCal</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-4 text-red-500">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Failed to load iCal connections. Please try again later.
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => queryClient.invalidateQueries({ queryKey: [`property-ical-connections-${propertyId}`] })}>
            Retry
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const connections = data?.data || [];
  const connectionsMeta = data?.meta || { total: 0, active_connections: 0 };

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>iCal Connections</CardTitle>
            <CardDescription>Connect external calendars via iCal</CardDescription>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> Add Connection
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {connections.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Platform</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Synced</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {connections.map((connection) => (
                <TableRow key={connection._id}>
                  <TableCell>
                    <Badge variant="outline">{connection.platform}</Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{connection.ical_url}</TableCell>
                  <TableCell>
                    <Badge
                      variant={connection.status === ConnectionStatus.ACTIVE ? "outline" : 
                        connection.status === ConnectionStatus.ERROR ? "destructive" : "default"}
                      className={connection.status === ConnectionStatus.ACTIVE ? "border-green-500 text-green-500" : ""}
                    >
                      {connection.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{connection.last_synced ? new Date(connection.last_synced).toLocaleString() : 'Never'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => handleTestClick(connection)}
                        title="Test Connection"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => handleEditClick(connection)}
                        title="Edit Connection"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleDeleteClick(connection)}
                        title="Delete Connection"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground">No iCal connections found</p>
            <p className="text-sm text-muted-foreground mt-2">
              Add connections to sync calendars from other platforms
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <div className="text-sm text-muted-foreground">
          {connectionsMeta.total} connection{connectionsMeta.total !== 1 ? 's' : ''} • 
          {connectionsMeta.active_connections} active
        </div>
      </CardFooter>

      {/* Add Connection Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add iCal Connection</DialogTitle>
            <DialogDescription>
              Connect an external calendar using iCal URL
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddConnection}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="platform">Platform</Label>
                <Select
                  value={newConnection.platform}
                  onValueChange={(value) => setNewConnection(prev => ({ ...prev, platform: value as Platform }))}
                >
                  <SelectTrigger id="platform">
                    <SelectValue placeholder="Select Platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(Platform).map((platform) => (
                      <SelectItem key={platform} value={platform}>{platform}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ical_url">iCal URL</Label>
                <Input
                  id="ical_url"
                  value={newConnection.ical_url}
                  onChange={(e) => setNewConnection(prev => ({ ...prev, ical_url: e.target.value }))}
                  placeholder="https://example.com/ical/calendar.ics"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sync_frequency">Sync Frequency (hours)</Label>
                <Select
                  value={String(newConnection.sync_frequency)}
                  onValueChange={(value) => setNewConnection(prev => ({ ...prev, sync_frequency: parseInt(value) }))}
                >
                  <SelectTrigger id="sync_frequency">
                    <SelectValue placeholder="Select Frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Every hour</SelectItem>
                    <SelectItem value="3">Every 3 hours</SelectItem>
                    <SelectItem value="6">Every 6 hours</SelectItem>
                    <SelectItem value="12">Every 12 hours</SelectItem>
                    <SelectItem value="24">Once a day</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Adding..." : "Add Connection"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Connection Dialog */}
      {selectedConnection && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit iCal Connection</DialogTitle>
              <DialogDescription>
                Update external calendar connection
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdateConnection}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-platform">Platform</Label>
                  <Input id="edit-platform" value={selectedConnection.platform} disabled />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-ical_url">iCal URL</Label>
                  <Input
                    id="edit-ical_url"
                    value={selectedConnection.ical_url}
                    onChange={(e) => setSelectedConnection({ ...selectedConnection, ical_url: e.target.value })}
                    placeholder="https://example.com/ical/calendar.ics"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-sync_frequency">Sync Frequency (hours)</Label>
                  <Select
                    value={String(selectedConnection.sync_frequency)}
                    onValueChange={(value) => setSelectedConnection({ ...selectedConnection, sync_frequency: parseInt(value) })}
                  >
                    <SelectTrigger id="edit-sync_frequency">
                      <SelectValue placeholder="Select Frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Every hour</SelectItem>
                      <SelectItem value="3">Every 3 hours</SelectItem>
                      <SelectItem value="6">Every 6 hours</SelectItem>
                      <SelectItem value="12">Every 12 hours</SelectItem>
                      <SelectItem value="24">Once a day</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={selectedConnection.status}
                    onValueChange={(value) => setSelectedConnection({ ...selectedConnection, status: value as ConnectionStatus })}
                  >
                    <SelectTrigger id="edit-status">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ConnectionStatus.ACTIVE}>Active</SelectItem>
                      <SelectItem value={ConnectionStatus.INACTIVE}>Inactive</SelectItem>
                      <SelectItem value={ConnectionStatus.ERROR}>Error</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? "Updating..." : "Update Connection"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Connection Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Delete Connection</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this connection? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedConnection && (
              <div className="bg-muted p-3 rounded-md">
                <p><strong>Platform:</strong> {selectedConnection.platform}</p>
                <p className="truncate"><strong>URL:</strong> {selectedConnection.ical_url}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="button" 
              variant="destructive" 
              onClick={handleDeleteConnection}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete Connection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Test Connection Dialog */}
      <Dialog open={isTestDialogOpen} onOpenChange={setIsTestDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Test Connection</DialogTitle>
            <DialogDescription>
              Test the connection to verify it's working properly
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedConnection && (
              <div className="bg-muted p-3 rounded-md">
                <p><strong>Platform:</strong> {selectedConnection.platform}</p>
                <p className="truncate"><strong>URL:</strong> {selectedConnection.ical_url}</p>
                <p><strong>Status:</strong> {selectedConnection.status}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsTestDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={handleTestConnection}
              disabled={testMutation.isPending}
            >
              {testMutation.isPending ? "Testing..." : "Test Connection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
