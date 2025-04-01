
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminProfileService } from '@/services/api-service';
import { UserProfile } from '@/types/api-responses';
import { format } from 'date-fns';

// UI Components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

// Custom Components
import CompletionBadge from '@/components/admin/CompletionBadge';
import ProfileActionMenu from '@/components/admin/ProfileActionMenu';
import UserProfileForm from '@/components/admin/UserProfileForm';

const UserProfiles = () => {
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const [isViewProfileOpen, setIsViewProfileOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  // Fetch profiles with pagination
  const { data, isLoading, error } = useQuery({
    queryKey: ['userProfiles', currentPage, pageSize],
    queryFn: () => adminProfileService.getUserProfiles({
      page: currentPage,
      limit: pageSize,
    }),
  });

  const profiles = data?.data?.profiles || [];
  const totalPages = data?.data?.total_pages || 1;

  const handleView = (profile: UserProfile) => {
    setSelectedProfile(profile);
    setIsViewProfileOpen(true);
  };

  const handleEdit = (profile: UserProfile) => {
    setSelectedProfile(profile);
    setIsEditProfileOpen(true);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">User Profiles</h1>
      </div>

      {/* Filters Section */}
      <div className="bg-card rounded-lg p-4 shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="page" className="block text-sm font-medium mb-1">Page</label>
            <Input
              id="page"
              type="number"
              min={1}
              value={currentPage}
              onChange={(e) => setCurrentPage(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full"
            />
          </div>
          
          <div>
            <label htmlFor="perPage" className="block text-sm font-medium mb-1">Per Page</label>
            <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(parseInt(value))}>
              <SelectTrigger>
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Profiles Table */}
      <div className="bg-card rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">Loading profiles...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">Error loading profiles</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">User ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Language</TableHead>
                <TableHead>Timezone</TableHead>
                <TableHead>Onboarding</TableHead>
                <TableHead className="w-[80px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profiles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No profiles found
                  </TableCell>
                </TableRow>
              ) : (
                profiles.map((profile) => (
                  <TableRow key={profile.id}>
                    <TableCell className="font-medium">{profile.user_id.substring(0, 8)}</TableCell>
                    <TableCell>{profile.user?.full_name || 'N/A'}</TableCell>
                    <TableCell>{profile.user?.email || 'N/A'}</TableCell>
                    <TableCell>{profile.preferences.language || 'N/A'}</TableCell>
                    <TableCell>{profile.preferences.timezone || 'UTC'}</TableCell>
                    <TableCell>
                      <CompletionBadge value={profile.onboarding_completed} />
                    </TableCell>
                    <TableCell className="text-right">
                      <ProfileActionMenu 
                        profile={profile} 
                        onEdit={handleEdit} 
                        onView={handleView} 
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
        
        {/* Pagination */}
        {profiles.length > 0 && (
          <div className="py-4 border-t">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} 
                    className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Show pages around current page
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink 
                        isActive={currentPage === pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                    className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      {/* View Profile Dialog */}
      <Dialog open={isViewProfileOpen} onOpenChange={setIsViewProfileOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>User Profile Details</DialogTitle>
          </DialogHeader>
          {selectedProfile && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">User</p>
                  <p>{selectedProfile.user?.full_name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p>{selectedProfile.user?.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Language</p>
                  <p>{selectedProfile.preferences.language || 'Default'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Timezone</p>
                  <p>{selectedProfile.preferences.timezone || 'UTC'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Theme</p>
                  <p>{selectedProfile.preferences.theme || 'Default'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Date Format</p>
                  <p>{selectedProfile.preferences.date_format || 'Default'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Time Format</p>
                  <p>{selectedProfile.preferences.time_format || 'Default'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Currency</p>
                  <p>{selectedProfile.preferences.currency || 'Default'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Notifications</p>
                  <p>{selectedProfile.preferences.notifications_enabled !== false ? 'Enabled' : 'Disabled'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Onboarding</p>
                  <CompletionBadge value={selectedProfile.onboarding_completed} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Created</p>
                  <p>{format(new Date(selectedProfile.created_at), 'PPP')}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Updated</p>
                  <p>{format(new Date(selectedProfile.updated_at), 'PPP')}</p>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsViewProfileOpen(false)}>
                  Close
                </Button>
                <Button onClick={() => {
                  setIsViewProfileOpen(false);
                  setIsEditProfileOpen(true);
                }}>
                  Edit
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit User Profile</DialogTitle>
          </DialogHeader>
          {selectedProfile && (
            <UserProfileForm 
              profile={selectedProfile} 
              onSuccess={() => setIsEditProfileOpen(false)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserProfiles;
