
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminProfileService } from "@/services/api-service";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  UserRoundCog,
  User,
  Users,
  Calendar,
  SlidersHorizontal
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { UserProfile } from "@/types/api-responses";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProfileActionMenu from "@/components/admin/ProfileActionMenu";

export default function UserProfiles() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [filterStatus, setFilterStatus] = useState("all");
  const [limit, setLimit] = useState(10);
  
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["user-profiles", currentPage, limit, sortBy, filterStatus],
    queryFn: async () => {
      try {
        const response = await adminProfileService.getUserProfiles({
          page: currentPage,
          limit,
          sort: sortBy,
          status: filterStatus !== "all" ? filterStatus : undefined
        });
        return response.data;
      } catch (error) {
        console.error("Error fetching user profiles:", error);
        return {
          profiles: [],
          total: 0,
          page: 1,
          limit: 10,
          total_pages: 1
        };
      }
    }
  });
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    refetch();
    toast.info(`Searching for: ${searchQuery}`);
  };
  
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= (data?.total_pages || 1)) {
      setCurrentPage(page);
    }
  };
  
  const handleViewProfile = (profile: UserProfile) => {
    navigate(`/user-profiles/${profile.user_id}`);
  };

  const handleEditProfile = (profile: UserProfile) => {
    setSelectedProfile(profile);
  };
  
  const handleResetProfile = async (profileId: string) => {
    if (confirm("Are you sure you want to reset this user profile? This will clear all their preferences and settings.")) {
      try {
        await adminProfileService.resetUserProfile(profileId);
        toast.success("Profile reset successfully");
        refetch();
      } catch (error) {
        console.error("Error resetting profile:", error);
        toast.error("Failed to reset profile");
      }
    }
  };
  
  if (isLoading) {
    return (
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-4">User Profiles</h1>
        <div className="grid gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  
  const filteredProfiles = data?.profiles || [];
  const totalProfiles = data?.total || 0;
  const onboardedProfiles = data?.meta?.profiles_with_onboarding_completed || 0;
  const onboardingRate = totalProfiles > 0 ? Math.round((onboardedProfiles / totalProfiles) * 100) : 0;
  
  return (
    <div className="container py-10">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold">User Profiles</h1>
            <p className="text-muted-foreground">
              Manage and review user profiles and preferences
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 mt-4 md:mt-0">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsFiltersOpen(true)}
            >
              <Filter className="h-4 w-4 mr-2" /> 
              Filters
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSortBy("newest")}>
                  Newest first
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("oldest")}>
                  Oldest first
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("name_asc")}>
                  Name (A-Z)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("name_desc")}>
                  Name (Z-A)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{totalProfiles}</CardTitle>
              <CardDescription>Total Profiles</CardDescription>
            </CardHeader>
            <CardContent>
              <Users className="text-muted-foreground h-4 w-4" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{onboardedProfiles}</CardTitle>
              <CardDescription>Completed Onboarding</CardDescription>
            </CardHeader>
            <CardContent>
              <User className="text-muted-foreground h-4 w-4" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{onboardingRate}%</CardTitle>
              <CardDescription>Onboarding Rate</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar className="text-muted-foreground h-4 w-4" />
            </CardContent>
          </Card>
        </div>
        
        <form onSubmit={handleSearch} className="flex w-full max-w-lg">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              className="pl-10 w-full"
              placeholder="Search profiles..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button type="submit" className="ml-2">Search</Button>
        </form>
      </div>
      
      <div className="grid gap-4 mt-6">
        {filteredProfiles.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <UserRoundCog className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No user profiles found</p>
            </CardContent>
          </Card>
        ) : (
          filteredProfiles.map((profile: UserProfile) => (
            <Card key={profile._id} className="relative overflow-hidden">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <div>
                    <CardTitle className="flex items-center">
                      {profile.user_details?.full_name || "Unknown User"}
                    </CardTitle>
                    <CardDescription>
                      {profile.user_details?.email || "No email"}
                    </CardDescription>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                    {profile.onboarding_completed ? (
                      <Badge variant="default" className="bg-green-500">Onboarding Completed</Badge>
                    ) : (
                      <Badge variant="outline">Onboarding Pending</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-1">Preferences</h4>
                    <div className="text-sm text-muted-foreground">
                      {profile.preferences && Object.keys(profile.preferences).length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                          {profile.preferences.theme && (
                            <div>Theme: <span className="capitalize">{profile.preferences.theme}</span></div>
                          )}
                          {profile.preferences.language && (
                            <div>Language: <span className="uppercase">{profile.preferences.language}</span></div>
                          )}
                          {profile.preferences.timezone && (
                            <div>Timezone: {profile.preferences.timezone}</div>
                          )}
                        </div>
                      ) : (
                        <p>No preferences set</p>
                      )}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-sm">
                      Created on: {new Date(profile.created_at).toLocaleDateString()}
                    </span>
                    
                    <div className="space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewProfile(profile)}
                      >
                        View
                      </Button>
                      <ProfileActionMenu 
                        profile={profile} 
                        onEdit={() => handleEditProfile(profile)}
                        onView={() => handleViewProfile(profile)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              
              {!profile.onboarding_completed && (
                <div className="absolute top-0 right-0 w-20 h-20">
                  <div className="absolute transform rotate-45 bg-yellow-500 text-xs text-white font-semibold py-1 right-[-30px] top-[20px] w-[100px] text-center">
                    New
                  </div>
                </div>
              )}
            </Card>
          ))
        )}
      </div>
      
      {data && data.total_pages > 1 && (
        <div className="flex justify-between items-center mt-8">
          <div className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * limit) + 1} - {Math.min(currentPage * limit, totalProfiles)} of {totalProfiles} profiles
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, data.total_pages) }, (_, i) => {
                const pageNumber = i + 1;
                return (
                  <Button 
                    key={i}
                    variant={pageNumber === currentPage ? "default" : "outline"} 
                    size="sm"
                    className="w-8 h-8 p-0"
                    onClick={() => handlePageChange(pageNumber)}
                  >
                    {pageNumber}
                  </Button>
                );
              })}
              
              {data.total_pages > 5 && (
                <>
                  <span className="mx-1">...</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-8 h-8 p-0"
                    onClick={() => handlePageChange(data.total_pages)}
                  >
                    {data.total_pages}
                  </Button>
                </>
              )}
            </div>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === data.total_pages}
            >
              Next
            </Button>
          </div>
          
          <Select
            value={limit.toString()}
            onValueChange={(value) => {
              setLimit(parseInt(value));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="10 per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 per page</SelectItem>
              <SelectItem value="10">10 per page</SelectItem>
              <SelectItem value="20">20 per page</SelectItem>
              <SelectItem value="50">50 per page</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      
      <Dialog
        open={isFiltersOpen}
        onOpenChange={setIsFiltersOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filter Profiles</DialogTitle>
            <DialogDescription>
              Customize which profiles are displayed
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="status" className="text-right">
                Status
              </label>
              <Select
                value={filterStatus}
                onValueChange={setFilterStatus}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Profiles</SelectItem>
                  <SelectItem value="onboarded">Onboarded Only</SelectItem>
                  <SelectItem value="not_onboarded">Not Onboarded</SelectItem>
                  <SelectItem value="with_preferences">With Preferences</SelectItem>
                  <SelectItem value="with_contact">With Contact Info</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setFilterStatus("all");
              setSortBy("newest");
            }}>
              Reset
            </Button>
            <Button onClick={() => {
              setIsFiltersOpen(false);
              refetch();
            }}>
              Apply Filters
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
