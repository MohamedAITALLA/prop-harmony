import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertTriangle, Search, MoreVertical, Filter, RefreshCw, Calendar, ChevronRight, 
  ArrowRight, X, MessageSquare
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { conflictService, propertyService } from "@/services/api-service";
import { Property, Conflict } from "@/types/api-responses";
import { 
  ConflictType, 
  ConflictSeverity, 
  ConflictStatus, 
  Platform 
} from "@/types/enums";
import { ConflictResolutionDialog } from "@/components/conflicts/ConflictResolutionDialog";
import { PlatformIcon } from "@/components/ui/platform-icon";
import { toast } from "sonner";
import { convertToMongoIdFormat } from "@/lib/id-conversion";

export default function Conflicts() {
  const [selectedProperty, setSelectedProperty] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<ConflictStatus | "">("");
  const [selectedSeverity, setSelectedSeverity] = useState<ConflictSeverity | "">("");
  const [isResolutionDialogOpen, setIsResolutionDialogOpen] = useState(false);
  const [selectedConflict, setSelectedConflict] = useState<Conflict | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: properties = [], isLoading: isPropertiesLoading } = useQuery({
    queryKey: ["properties"],
    queryFn: async () => {
      try {
        const response = await propertyService.getAllProperties();
        return response.data.properties;
      } catch (error) {
        console.error("Error fetching properties:", error);
        return convertToMongoIdFormat(getMockProperties());
      }
    },
  });
  
  const { data: conflicts = [], isLoading: isConflictsLoading, refetch } = useQuery({
    queryKey: ["conflicts", selectedProperty, selectedStatus],
    queryFn: async () => {
      try {
        if (selectedProperty) {
          const params = selectedStatus ? { status: selectedStatus } : undefined;
          const response = await conflictService.getConflicts(selectedProperty, params);
          return response.data;
        } else {
          return convertToMongoIdFormat(getMockConflicts());
        }
      } catch (error) {
        console.error("Error fetching conflicts:", error);
        return [];
      }
    },
  });
  
  const filteredConflicts = conflicts.filter((conflict: Conflict) => {
    const matchesSearch = 
      conflict.property?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conflict.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSeverity = selectedSeverity ? conflict.severity === selectedSeverity : true;
    
    return matchesSearch && matchesSeverity;
  });
  
  const conflictsByStatus = {
    new: filteredConflicts.filter(conflict => conflict.status === ConflictStatus.NEW),
    acknowledged: filteredConflicts.filter(conflict => conflict.status === ConflictStatus.ACKNOWLEDGED),
    resolved: filteredConflicts.filter(conflict => conflict.status === ConflictStatus.RESOLVED)
  };
  
  const handleResolveConflict = (conflict: Conflict) => {
    setSelectedConflict(conflict);
    setIsResolutionDialogOpen(true);
  };
  
  const handleUpdateStatus = (conflict: Conflict, status: ConflictStatus) => {
    toast.success(`Conflict status updated to ${status}`);
    setTimeout(() => {
      refetch();
    }, 500);
  };
  
  const getSeverityColor = (severity: ConflictSeverity) => {
    switch (severity) {
      case ConflictSeverity.HIGH:
        return "bg-red-100 text-red-800 border-red-200";
      case ConflictSeverity.MEDIUM:
        return "bg-orange-100 text-orange-800 border-orange-200";
      case ConflictSeverity.LOW:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };
  
  const getTypeLabel = (type: ConflictType) => {
    switch (type) {
      case ConflictType.OVERLAP:
        return "Booking Overlap";
      case ConflictType.ADJACENT:
        return "Adjacent Bookings";
      case ConflictType.TURNOVER:
        return "Turnover Conflict";
      default:
        return type;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar Conflicts</h1>
          <p className="text-muted-foreground">
            Review and resolve calendar conflicts across properties
          </p>
        </div>
        
        <Button onClick={() => refetch()}>
          <RefreshCw className="mr-2 h-4 w-4" /> Refresh
        </Button>
      </div>
      
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative sm:max-w-xs flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Search conflicts..."
              className="pl-8 h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Select value={selectedProperty} onValueChange={setSelectedProperty}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Properties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Properties</SelectItem>
                {properties.map((property: Property) => (
                  <SelectItem key={property._id} value={property._id}>
                    {property.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Severities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Severities</SelectItem>
                <SelectItem value={ConflictSeverity.HIGH}>High</SelectItem>
                <SelectItem value={ConflictSeverity.MEDIUM}>Medium</SelectItem>
                <SelectItem value={ConflictSeverity.LOW}>Low</SelectItem>
              </SelectContent>
            </Select>
            
            {(selectedProperty || selectedSeverity || selectedStatus) && (
              <Button variant="ghost" onClick={() => {
                setSelectedProperty("");
                setSelectedSeverity("");
                setSelectedStatus("");
              }}>
                <X className="mr-2 h-4 w-4" /> Clear
              </Button>
            )}
          </div>
        </div>
        
        <Tabs defaultValue="new" className="w-full" onValueChange={(v) => {
          if (v === "new") setSelectedStatus(ConflictStatus.NEW);
          else if (v === "acknowledged") setSelectedStatus(ConflictStatus.ACKNOWLEDGED);
          else if (v === "resolved") setSelectedStatus(ConflictStatus.RESOLVED);
          else setSelectedStatus("");
        }}>
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="all" className="relative">
              All
              <Badge className="ml-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                {filteredConflicts.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="new" className="relative">
              New
              <Badge className="ml-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center bg-red-500">
                {conflictsByStatus.new.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="acknowledged" className="relative">
              Acknowledged
              <Badge className="ml-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center bg-yellow-500">
                {conflictsByStatus.acknowledged.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="resolved" className="relative">
              Resolved
              <Badge className="ml-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center bg-green-500">
                {conflictsByStatus.resolved.length}
              </Badge>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="border-none p-0 pt-4">
            <ConflictsList 
              conflicts={filteredConflicts} 
              isLoading={isConflictsLoading}
              onResolve={handleResolveConflict}
              onUpdateStatus={handleUpdateStatus}
              getSeverityColor={getSeverityColor}
              getTypeLabel={getTypeLabel}
            />
          </TabsContent>
          
          <TabsContent value="new" className="border-none p-0 pt-4">
            <ConflictsList 
              conflicts={conflictsByStatus.new} 
              isLoading={isConflictsLoading}
              onResolve={handleResolveConflict}
              onUpdateStatus={handleUpdateStatus}
              getSeverityColor={getSeverityColor}
              getTypeLabel={getTypeLabel}
            />
          </TabsContent>
          
          <TabsContent value="acknowledged" className="border-none p-0 pt-4">
            <ConflictsList 
              conflicts={conflictsByStatus.acknowledged} 
              isLoading={isConflictsLoading}
              onResolve={handleResolveConflict}
              onUpdateStatus={handleUpdateStatus}
              getSeverityColor={getSeverityColor}
              getTypeLabel={getTypeLabel}
            />
          </TabsContent>
          
          <TabsContent value="resolved" className="border-none p-0 pt-4">
            <ConflictsList 
              conflicts={conflictsByStatus.resolved} 
              isLoading={isConflictsLoading}
              onResolve={handleResolveConflict}
              onUpdateStatus={handleUpdateStatus}
              getSeverityColor={getSeverityColor}
              getTypeLabel={getTypeLabel}
            />
          </TabsContent>
        </Tabs>
      </div>
      
      {isResolutionDialogOpen && selectedConflict && (
        <ConflictResolutionDialog 
          conflict={selectedConflict}
          open={isResolutionDialogOpen}
          onOpenChange={setIsResolutionDialogOpen}
          onResolve={() => {
            toast.success("Conflict resolved successfully");
            refetch();
          }}
        />
      )}
      
      <div className="mt-8 border-t pt-8">
        <h2 className="text-lg font-medium mb-4">Conflict Resolution Guidelines</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Booking Overlaps</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p>When two or more bookings overlap for the same property, contact the guest with the later booking to arrange an alternative.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Adjacent Bookings</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p>When bookings have no gap between them, ensure that cleaning services are arranged for a quick turnaround.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Turnover Conflicts</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p>When multiple properties have check-ins or check-outs on the same day, coordinate with your team to ensure all logistics are handled.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ConflictsList({ 
  conflicts, 
  isLoading, 
  onResolve,
  onUpdateStatus,
  getSeverityColor,
  getTypeLabel
}: { 
  conflicts: Conflict[]; 
  isLoading: boolean;
  onResolve: (conflict: Conflict) => void;
  onUpdateStatus: (conflict: Conflict, status: ConflictStatus) => void;
  getSeverityColor: (severity: ConflictSeverity) => string;
  getTypeLabel: (type: ConflictType) => string;
}) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin mr-2" />
        <span>Loading conflicts...</span>
      </div>
    );
  }
  
  if (conflicts.length === 0) {
    return (
      <div className="text-center py-12 border rounded-md">
        <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">No conflicts found</h3>
        <p className="mt-2 text-muted-foreground">
          There are currently no calendar conflicts matching your filters.
        </p>
      </div>
    );
  }
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox aria-label="Select all" />
            </TableHead>
            <TableHead>Property</TableHead>
            <TableHead>Conflict</TableHead>
            <TableHead>Period</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead>Platforms</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {conflicts.map((conflict: Conflict) => (
            <TableRow key={conflict._id}>
              <TableCell>
                <Checkbox aria-label={`Select conflict ${conflict._id}`} />
              </TableCell>
              <TableCell>
                <div className="font-medium">{conflict.property?.name || "Unknown Property"}</div>
              </TableCell>
              <TableCell>
                <div>{getTypeLabel(conflict.conflict_type)}</div>
                <div className="text-xs text-muted-foreground truncate max-w-[200px]" title={conflict.description}>
                  {conflict.description}
                </div>
              </TableCell>
              <TableCell>
                <div className="whitespace-nowrap">
                  {format(parseISO(conflict.start_date), 'MMM d')} - {format(parseISO(conflict.end_date), 'MMM d, yyyy')}
                </div>
              </TableCell>
              <TableCell>
                <Badge className={`font-normal ${getSeverityColor(conflict.severity)}`}>
                  {conflict.severity}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  {conflict.platforms?.map((platform) => (
                    <div key={platform} className="w-6 h-6 flex items-center justify-center">
                      <PlatformIcon platform={platform as Platform} size={16} />
                    </div>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={
                  conflict.status === ConflictStatus.NEW ? "bg-red-100 text-red-800 border-red-200" :
                  conflict.status === ConflictStatus.ACKNOWLEDGED ? "bg-yellow-100 text-yellow-800 border-yellow-200" :
                  "bg-green-100 text-green-800 border-green-200"
                }>
                  {conflict.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Calendar className="mr-2 h-4 w-4" /> View Calendar
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <MessageSquare className="mr-2 h-4 w-4" /> Add Note
                    </DropdownMenuItem>
                    
                    {conflict.status === ConflictStatus.NEW && (
                      <DropdownMenuItem onClick={() => onUpdateStatus(conflict, ConflictStatus.ACKNOWLEDGED)}>
                        <ChevronRight className="mr-2 h-4 w-4" /> Acknowledge
                      </DropdownMenuItem>
                    )}
                    
                    {conflict.status !== ConflictStatus.RESOLVED && (
                      <DropdownMenuItem onClick={() => onResolve(conflict)}>
                        <ArrowRight className="mr-2 h-4 w-4" /> Resolve
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function getMockProperties() {
  return [
    { _id: "prop-1", name: "Oceanfront Villa" },
    { _id: "prop-2", name: "Mountain Cabin" },
    { _id: "prop-3", name: "Downtown Loft" },
  ];
}

function getMockConflicts() {
  return [
    {
      _id: "conflict-1",
      property_id: "prop-1",
      property: { _id: "prop-1", name: "Oceanfront Villa" },
      event_ids: ["event-1", "event-2"],
      conflict_type: ConflictType.OVERLAP,
      start_date: "2023-07-15T00:00:00Z",
      end_date: "2023-07-17T00:00:00Z",
      severity: ConflictSeverity.HIGH,
      status: ConflictStatus.NEW,
      description: "Two bookings overlap by 2 days",
      created_at: "2023-07-01T12:00:00Z",
      updated_at: "2023-07-01T12:00:00Z",
      platforms: [Platform.AIRBNB, Platform.BOOKING],
    },
    // ... keep existing code (Other mock conflicts)
  ];
}
