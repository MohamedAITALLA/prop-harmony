
import React, { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FormHeader } from "./FormHeader";

interface FormContainerProps {
  children: ReactNode;
  title?: string;
  description?: string;
  icon?: ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
}

export function FormContainer({ 
  children, 
  title,
  description,
  icon,
  className = "",
  headerClassName = "",
  contentClassName = "p-6"
}: FormContainerProps) {
  return (
    <Card className={`shadow-md border-primary/10 ${className}`}>
      <FormHeader 
        title={title} 
        description={description} 
        icon={icon} 
      />
      <CardContent className={contentClassName}>
        {children}
      </CardContent>
    </Card>
  );
}
