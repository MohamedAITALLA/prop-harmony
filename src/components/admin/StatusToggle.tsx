
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { StatusBadge } from "@/components/ui/status-badge";
import { adminUserService } from '@/services/api-service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getMongoId } from '@/lib/mongo-helpers';

interface StatusToggleProps {
  value: boolean;
  userId: string;
}

const StatusToggle = ({ value, userId }: StatusToggleProps) => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      return adminUserService.updateUser(id, { is_active: isActive });
    },
    onSuccess: (data) => {
      toast.success(data.message || 'User status updated successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const handleToggle = (checked: boolean) => {
    mutate({ id: userId, isActive: checked });
  };

  return (
    <div className="flex items-center gap-2">
      <Switch 
        checked={value} 
        onCheckedChange={handleToggle}
        disabled={isPending}
      />
      <StatusBadge 
        status={value ? 'active' : 'inactive'} 
        size="sm"
      />
    </div>
  );
};

export default StatusToggle;
