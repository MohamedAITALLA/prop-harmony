
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
      return adminUserService.updateUser(id, { is_active: isActive });
    },
    onSuccess: (data) => {
      toast.success(data?.data?.message || 'User status updated successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const handleToggle = (checked: boolean) => {
    mutate({ id: userId, isActive: checked });
    onToggle();
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
