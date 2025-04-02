
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAdminProfiles } from '@/hooks/useAdminProfiles';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, User, Settings, ShieldAlert } from 'lucide-react';
import { format } from 'date-fns';
import UserProfileForm from '@/components/admin/UserProfileForm';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function UserProfileDetails() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const { getProfile, getUserDetails, resetProfile, isResetting } = useAdminProfiles();
  
  const { data: profileData, isLoading: isProfileLoading } = getProfile(userId || '');
  const { data: userData, isLoading: isUserLoading } = getUserDetails(userId || '');

  const isLoading = isProfileLoading || isUserLoading;
  
  const handleReset = () => {
    if (!userId) return;
    
    resetProfile(userId);
    setIsResetDialogOpen(false);
    toast.success("Profile reset process initiated");
  };

  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" className="mr-4" onClick={() => navigate('/user-profiles')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Skeleton className="h-8 w-64" />
        </div>
        
        <div className="grid gap-6">
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    );
  }

  const profile = profileData?.profile;
  const user = userData?.user;
  
  if (!profile || !user) {
    return (
      <div className="container py-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" className="mr-4" onClick={() => navigate('/user-profiles')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold">User Profile</h1>
          </div>
        </div>
        
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <ShieldAlert className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">User profile not found</p>
            <Button className="mt-4" onClick={() => navigate('/user-profiles')}>
              Return to User Profiles
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" className="mr-4" onClick={() => navigate('/user-profiles')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{user.full_name || 'User Profile'}</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </div>
        
        <div className="flex items-center mt-4 md:mt-0 space-x-2">
          {profile.onboarding_completed ? (
            <Badge variant="default" className="bg-green-500">Onboarding Completed</Badge>
          ) : (
            <Badge variant="outline">Onboarding Pending</Badge>
          )}
          
          {user.is_admin && (
            <Badge variant="default" className="bg-purple-500">Admin</Badge>
          )}
        </div>
      </div>
      
      <Tabs defaultValue="details" className="space-y-6">
        <TabsList>
          <TabsTrigger value="details">
            <User className="h-4 w-4 mr-2" />
            Details
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>User Information</CardTitle>
                <CardDescription>Basic user account details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">First Name</p>
                      <p>{user.first_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Last Name</p>
                      <p>{user.last_name}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p>{user.email}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Account Status</p>
                      <p>{user.is_active ? 'Active' : 'Inactive'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Role</p>
                      <p>{user.is_admin ? 'Administrator' : 'Regular User'}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>
                    Account created {format(new Date(user.created_at), 'PPP')}
                  </span>
                </div>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>User contact details</CardDescription>
              </CardHeader>
              <CardContent>
                {profile.contact_info && Object.keys(profile.contact_info).length > 0 ? (
                  <div className="space-y-4">
                    {profile.contact_info.phone && (
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p>{profile.contact_info.phone}</p>
                      </div>
                    )}
                    
                    {profile.contact_info.address && (
                      <div>
                        <p className="text-sm text-muted-foreground">Address</p>
                        <p>{profile.contact_info.address}</p>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4">
                      {profile.contact_info.city && (
                        <div>
                          <p className="text-sm text-muted-foreground">City</p>
                          <p>{profile.contact_info.city}</p>
                        </div>
                      )}
                      
                      {profile.contact_info.state && (
                        <div>
                          <p className="text-sm text-muted-foreground">State</p>
                          <p>{profile.contact_info.state}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {profile.contact_info.country && (
                        <div>
                          <p className="text-sm text-muted-foreground">Country</p>
                          <p>{profile.contact_info.country}</p>
                        </div>
                      )}
                      
                      {profile.contact_info.postalCode && (
                        <div>
                          <p className="text-sm text-muted-foreground">Postal Code</p>
                          <p>{profile.contact_info.postalCode}</p>
                        </div>
                      )}
                    </div>
                    
                    {profile.contact_info.emergency_contact && 
                     profile.contact_info.emergency_contact.name && (
                      <>
                        <Separator className="my-4" />
                        <div>
                          <p className="font-medium mb-2">Emergency Contact</p>
                          <div className="space-y-2">
                            <div>
                              <p className="text-sm text-muted-foreground">Name</p>
                              <p>{profile.contact_info.emergency_contact.name}</p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              {profile.contact_info.emergency_contact.phone && (
                                <div>
                                  <p className="text-sm text-muted-foreground">Phone</p>
                                  <p>{profile.contact_info.emergency_contact.phone}</p>
                                </div>
                              )}
                              
                              {profile.contact_info.emergency_contact.relationship && (
                                <div>
                                  <p className="text-sm text-muted-foreground">Relationship</p>
                                  <p>{profile.contact_info.emergency_contact.relationship}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6">
                    <p className="text-muted-foreground">No contact information available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>User preferences and settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground">Theme</p>
                  <p className="capitalize">{profile.preferences?.theme || "Default"}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Language</p>
                  <p className="uppercase">{profile.preferences?.language || "Default"}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Timezone</p>
                  <p>{profile.preferences?.timezone || "Default"}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Date Format</p>
                  <p>{profile.preferences?.date_format || "Default"}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Time Format</p>
                  <p>{profile.preferences?.time_format || "Default"}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Currency</p>
                  <p>{profile.preferences?.currency || "Default"}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Notifications</p>
                  <p>{profile.preferences?.notifications_enabled ? "Enabled" : "Disabled"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Profile Settings</CardTitle>
                <CardDescription>Edit user preferences and settings</CardDescription>
              </CardHeader>
              <CardContent>
                <UserProfileForm 
                  profile={profile}
                  onSuccess={() => {
                    toast.success("Profile updated successfully");
                  }}
                />
              </CardContent>
            </Card>
            
            <Card className="border-red-200 dark:border-red-900">
              <CardHeader>
                <CardTitle className="text-red-500">Danger Zone</CardTitle>
                <CardDescription>
                  Irreversible and destructive actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Resetting this profile will remove all custom settings and preferences.</p>
                <Button 
                  variant="destructive" 
                  onClick={() => setIsResetDialogOpen(true)}
                  disabled={isResetting}
                >
                  Reset User Profile
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      <AlertDialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset User Profile</AlertDialogTitle>
            <AlertDialogDescription>
              This will reset all user preferences and settings to their default values.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReset} className="bg-red-500 hover:bg-red-600">
              Reset Profile
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
