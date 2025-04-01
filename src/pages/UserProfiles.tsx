
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminProfileService } from "@/services/api-service";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Filter, UserRoundCog } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { UserProfile } from "@/types/api-responses";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserProfiles() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["user-profiles", currentPage],
    queryFn: async () => {
      try {
        const response = await adminProfileService.getUserProfiles({
          page: currentPage,
          limit: 10
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
    // Implement search logic here
    toast.info(`Searching for: ${searchQuery}`);
  };
  
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= (data?.total_pages || 1)) {
      setCurrentPage(page);
    }
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
  
  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold">User Profiles</h1>
        
        <form onSubmit={handleSearch} className="flex mt-4 md:mt-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              className="pl-10 w-full md:w-[300px]"
              placeholder="Search profiles..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="ml-2">
            <Filter className="h-4 w-4 mr-2" /> Filter
          </Button>
        </form>
      </div>
      
      <div className="grid gap-4">
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
                    <CardTitle>
                      {profile.user_details?.full_name || "Unknown User"}
                    </CardTitle>
                    <CardDescription>
                      {profile.user_details?.email || "No email"}
                    </CardDescription>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                    {profile.onboarding_completed ? (
                      <Badge>Onboarding Completed</Badge>
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
                            <div>Theme: {profile.preferences.theme}</div>
                          )}
                          {profile.preferences.language && (
                            <div>Language: {profile.preferences.language}</div>
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
                        onClick={() => {
                          window.location.href = `/admin/user-profiles/${profile._id}`;
                        }}
                      >
                        View
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleResetProfile(profile._id)}
                      >
                        Reset Profile
                      </Button>
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
        <div className="flex justify-center mt-8">
          <Button 
            variant="outline" 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <div className="flex items-center mx-4">
            Page {currentPage} of {data.total_pages}
          </div>
          <Button 
            variant="outline" 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === data.total_pages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
