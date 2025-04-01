import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Eye, MoreVertical, RefreshCw } from "lucide-react";
import { format, parseISO } from "date-fns";
import { adminProfileService } from "@/services/api-service";
import { UserProfile } from "@/types/api-responses";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { convertToMongoIdFormat } from "@/lib/id-conversion";

export default function UserProfiles() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin", "user-profiles"],
    queryFn: async () => {
      try {
        const response = await adminProfileService.getUserProfiles();
        return response;
      } catch (error) {
        console.error("Failed to fetch user profiles:", error);
        // Return mock data for demonstration
        const mockProfiles = getMockProfiles();
        return {
          success: true,
          data: {
            profiles: convertToMongoIdFormat(mockProfiles),
            total: mockProfiles.length,
            page: 1,
            limit: 10,
            total_pages: 1,
            meta: {
              profiles_with_onboarding_completed: 3,
              profiles_with_contact_info: 4,
            }
          },
          message: "Mock profiles loaded",
          timestamp: new Date().toISOString()
        };
      }
    },
  });

  const profiles = data?.data?.profiles || [];
  const filteredProfiles = profiles.filter((profile: UserProfile) => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    
    const userDetails = profile.user_details || {};
    
    return (
      userDetails.full_name?.toLowerCase().includes(searchLower) ||
      userDetails.email?.toLowerCase().includes(searchLower)
    );
  });

  const handleResetProfile = async (userId: string) => {
    const confirmReset = window.confirm(
      "Are you sure you want to reset this user's profile? This will clear all their preferences and contact information."
    );
    
    if (confirmReset) {
      try {
        await adminProfileService.resetUserProfile(userId);
        toast.success("User profile has been reset");
        refetch();
      } catch (error) {
        toast.error("Failed to reset user profile");
        console.error("Error resetting user profile:", error);
      }
    }
  };

  const viewProfile = (userId: string) => {
    navigate(`/admin/user-profiles/${userId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Profiles</h1>
          <p className="text-muted-foreground">
            Manage user profile data and preferences
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={() => refetch()}>
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh
          </Button>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search user profiles..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Onboarding</TableHead>
                  <TableHead>Theme</TableHead>
                  <TableHead>Language</TableHead>
                  <TableHead>Timezone</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center h-24">
                      <div className="flex items-center justify-center">
                        <RefreshCw className="h-6 w-6 animate-spin mr-2" />
                        <span>Loading profiles...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center h-24 text-red-500">
                      Failed to load user profiles. Please try again.
                    </TableCell>
                  </TableRow>
                ) : filteredProfiles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center h-24">
                      No user profiles found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProfiles.map((profile: UserProfile) => {
                    const userDetails = profile.user_details || {};
                    return (
                      <TableRow key={profile._id}>
                        <TableCell className="font-medium">
                          {userDetails.full_name || "Unknown User"}
                          <div className="text-xs text-muted-foreground">
                            {userDetails.email}
                          </div>
                        </TableCell>
                        <TableCell>
                          {profile.onboarding_completed ? (
                            <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                              Completed
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                              Incomplete
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{profile.preferences?.theme || "Default"}</TableCell>
                        <TableCell>{profile.preferences?.language || "English"}</TableCell>
                        <TableCell>{profile.preferences?.timezone || "UTC"}</TableCell>
                        <TableCell>
                          {profile.created_at ? format(parseISO(profile.created_at), 'MMM dd, yyyy') : "Unknown"}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => viewProfile(profile._id)}>
                                <Eye className="mr-2 h-4 w-4" /> View Profile
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => handleResetProfile(profile._id)}
                              >
                                Reset Profile
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {filteredProfiles.length} of {profiles.length} profiles
        </div>
      </div>
    </div>
  );
}

function getMockProfiles() {
  return [
    {
      _id: "profile1",
      user_id: "user1",
      user_details: {
        email: "admin@example.com",
        first_name: "Admin",
        last_name: "User",
        full_name: "Admin User"
      },
      preferences: {
        theme: "dark",
        language: "en",
        timezone: "America/New_York",
        date_format: "MM/DD/YYYY",
        time_format: "12h",
        currency: "USD",
        notifications_enabled: true
      },
      contact_info: {
        phone: "+1 555-123-4567",
        address: "123 Admin St",
        city: "New York",
        state: "NY",
        country: "USA",
        postalCode: "10001"
      },
      onboarding_completed: true,
      created_at: "2023-01-01T00:00:00Z",
      updated_at: "2023-01-01T00:00:00Z"
    },
    {
      _id: "profile2",
      user_id: "user2",
      user_details: {
        email: "john.doe@example.com",
        first_name: "John",
        last_name: "Doe",
        full_name: "John Doe"
      },
      preferences: {
        theme: "light",
        language: "en",
        timezone: "America/Los_Angeles",
        date_format: "MM/DD/YYYY",
        time_format: "12h",
        currency: "USD",
        notifications_enabled: false
      },
      contact_info: {
        phone: "+1 555-987-6543",
        address: "456 User Ave",
        city: "Los Angeles",
        state: "CA",
        country: "USA",
        postalCode: "90001"
      },
      onboarding_completed: false,
      created_at: "2023-02-15T00:00:00Z",
      updated_at: "2023-02-15T00:00:00Z"
    },
    {
      _id: "profile3",
      user_id: "user3",
      user_details: {
        email: "jane.smith@example.com",
        first_name: "Jane",
        last_name: "Smith",
        full_name: "Jane Smith"
      },
      preferences: {
        theme: "system",
        language: "es",
        timezone: "Europe/Madrid",
        date_format: "DD/MM/YYYY",
        time_format: "24h",
        currency: "EUR",
        notifications_enabled: true
      },
      contact_info: {
        phone: "+34 666-777-888",
        address: "789 Calle Usuario",
        city: "Madrid",
        state: "Madrid",
        country: "Spain",
        postalCode: "28001"
      },
      onboarding_completed: true,
      created_at: "2023-03-20T00:00:00Z",
      updated_at: "2023-03-20T00:00:00Z"
    },
    {
      _id: "profile4",
      user_id: "user4",
      user_details: {
        email: "test.user@example.com",
        first_name: "Test",
        last_name: "User",
        full_name: "Test User"
      },
      preferences: {
        theme: "light",
        language: "fr",
        timezone: "Asia/Tokyo",
        date_format: "YYYY-MM-DD",
        time_format: "24h",
        currency: "JPY",
        notifications_enabled: false
      },
      contact_info: {
        phone: "+81 3-1234-5678",
        address: "1-2-3 Test Street",
        city: "Tokyo",
        state: "Tokyo",
        country: "Japan",
        postalCode: "100-0001"
      },
      onboarding_completed: false,
      created_at: "2023-04-01T00:00:00Z",
      updated_at: "2023-04-01T00:00:00Z"
    },
    {
      _id: "profile5",
      user_id: "user5",
      user_details: {
        email: "sample.user@example.com",
        first_name: "Sample",
        last_name: "User",
        full_name: "Sample User"
      },
      preferences: {
        theme: "dark",
        language: "de",
        timezone: "Europe/Berlin",
        date_format: "DD/MM/YYYY",
        time_format: "24h",
        currency: "EUR",
        notifications_enabled: true
      },
      contact_info: {
        phone: "+49 30-1234567",
        address: "4-5-6 Beispielweg",
        city: "Berlin",
        state: "Berlin",
        country: "Germany",
        postalCode: "10115"
      },
      onboarding_completed: true,
      created_at: "2023-05-10T00:00:00Z",
      updated_at: "2023-05-10T00:00:00Z"
    }
  ];
}
