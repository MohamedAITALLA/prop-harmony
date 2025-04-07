
import React, { ReactNode } from "react";
import { Home } from "lucide-react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface FormHeaderProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
}

export function FormHeader({ 
  title = "Edit Property", 
  description = "Update your property details, amenities, and policies",
  icon = <Home className="h-5 w-5 text-primary" />
}: FormHeaderProps) {
  return (
    <CardHeader className="bg-primary/5 border-b">
      <CardTitle className="flex items-center gap-2">
        <div className="bg-primary/10 p-1.5 rounded-md">
          {icon}
        </div>
        <span>{title}</span>
      </CardTitle>
      <CardDescription>
        {description}
      </CardDescription>
    </CardHeader>
  );
}
