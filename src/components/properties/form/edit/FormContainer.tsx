
import React, { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FormHeader } from "./FormHeader";

interface FormContainerProps {
  children: ReactNode;
}

export function FormContainer({ children }: FormContainerProps) {
  return (
    <Card className="shadow-md border-primary/10">
      <FormHeader />
      <CardContent className="p-6">
        {children}
      </CardContent>
    </Card>
  );
}
