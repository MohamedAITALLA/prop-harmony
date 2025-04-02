
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Edit, RefreshCw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { adminProfileService } from '@/services/api-service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { UserProfile } from '@/types/api-responses';
import { getMongoId } from '@/lib/mongo-helpers';

interface ProfileActionMenuProps {
  profile: UserProfile;
  onEdit: (profile: UserProfile) => void;
  onView: (profile: UserProfile) => void;
}

const ProfileActionMenu = ({ profile, onEdit, onView }: ProfileActionMenuProps) => {
  const [confirmReset, setConfirmReset] = React.useState(false);
  const queryClient = useQueryClient();
  
  const resetMutation = useMutation({
    mutationFn: async (userId: string) => {
      return adminProfileService.resetUserProfile(userId);
    },
    onSuccess: (data) => {
      toast.success(data?.data?.message || 'User profile reset successfully');
      queryClient.invalidateQueries({ queryKey: ['userProfiles'] });
      setConfirmReset(false);
    },
  });

  const userId = profile.user_id;
  
  if (!userId) {
    console.error("User ID is missing in ProfileActionMenu component", profile);
    return null;
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onView(profile)}>
            <Eye className="mr-2 h-4 w-4" />
            View
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onEdit(profile)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setConfirmReset(true)}
            className="text-orange-600 focus:text-orange-600"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Dialog open={confirmReset} onOpenChange={setConfirmReset}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset User Profile</DialogTitle>
            <DialogDescription>
              Are you sure you want to reset this user's profile to default settings? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setConfirmReset(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => resetMutation.mutate(userId)}
              disabled={resetMutation.isPending}
            >
              Reset Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProfileActionMenu;
