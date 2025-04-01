
import React from 'react';
import { Badge } from "@/components/ui/badge";

interface RoleBadgeProps {
  value: string;
}

const RoleBadge = ({ value }: RoleBadgeProps) => {
  const variant = value === 'admin' ? 'destructive' : 'secondary';
  
  return (
    <Badge variant={variant} className="capitalize">
      {value}
    </Badge>
  );
};

export default RoleBadge;
