
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Edit, ArrowUp, ArrowDown, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { adminUserService } from '@/services/api-service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { User } from '@/types/api-responses';

interface ActionMenuProps {
  user: User;
  onEdit: (user: User) => void;
  onView: (user: User) => void;
}

const ActionMenu = ({ user, onEdit, onView }: ActionMenuProps) => {
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const queryClient = useQueryClient();
  
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return adminUserService.deleteUser(id);
    },
    onSuccess: () => {
      toast.success('User deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setConfirmDelete(false);
    },
  });
  
  const promoteMutation = useMutation({
    mutationFn: async (id: string) => {
      return adminUserService.promoteUser(id);
    },
    onSuccess: () => {
      toast.success('User promoted to admin');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
  
  const demoteMutation = useMutation({
    mutationFn: async (id: string) => {
      return adminUserService.demoteUser(id);
    },
    onSuccess: () => {
      toast.success('User demoted from admin');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

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
          <DropdownMenuItem onClick={() => onView(user)}>
            <Eye className="mr-2 h-4 w-4" />
            View
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onEdit(user)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          
          {user.role !== 'admin' && (
            <DropdownMenuItem 
              onClick={() => promoteMutation.mutate(user.id)}
              disabled={promoteMutation.isPending}
            >
              <ArrowUp className="mr-2 h-4 w-4" />
              Promote to Admin
            </DropdownMenuItem>
          )}
          
          {user.role === 'admin' && (
            <DropdownMenuItem 
              onClick={() => demoteMutation.mutate(user.id)}
              disabled={demoteMutation.isPending}
            >
              <ArrowDown className="mr-2 h-4 w-4" />
              Demote from Admin
            </DropdownMenuItem>
          )}
          
          <DropdownMenuItem 
            className="text-red-600 focus:text-red-600"
            onClick={() => setConfirmDelete(true)}
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setConfirmDelete(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => deleteMutation.mutate(user.id)}
              disabled={deleteMutation.isPending}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ActionMenu;
