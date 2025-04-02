
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { StatusBadge } from "@/components/ui/status-badge";
import { adminUserService } from '@/services/api-service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface StatusToggleProps {
  userId: string;
  isActive: boolean;
  onToggle: () => void;
}

export default function StatusToggle({ userId, isActive, onToggle }: StatusToggleProps) {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      try {
        const result = await adminUserService.updateUser(id, { is_active: isActive });
        return result;
      } catch (error) {
        console.error("Failed to update user status:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      const message = data?.message || 'User status updated successfully';
      toast.success(message);
      queryClient.invalidateQueries({ queryKey: ['users'] });
      onToggle();
    },
    onError: (error) => {
      console.error("Error toggling user status:", error);
      toast.error("Failed to update user status");
    }
  });

  const handleToggle = (checked: boolean) => {
    mutate({ id: userId, isActive: checked });
  };

  return (
    <div className="flex items-center gap-2">
      <Switch 
        checked={isActive} 
        onCheckedChange={handleToggle}
        disabled={isPending}
      />
      <StatusBadge 
        status={isActive ? 'active' : 'inactive'} 
        size="sm"
      />
    </div>
  );
}
