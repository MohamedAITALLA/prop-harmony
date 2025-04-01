
import React from 'react';
import { Badge } from "@/components/ui/badge";

interface RoleBadgeProps {
  role: string;
}

export default function RoleBadge({ role }: RoleBadgeProps) {
  const variant = role === 'admin' ? 'destructive' : 'secondary';
  
  return (
    <Badge variant={variant as any} className="capitalize">
      {role}
    </Badge>
  );
}
