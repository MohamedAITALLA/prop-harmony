
import React, { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FormHeader } from "./FormHeader";

interface FormContainerProps {
  children: ReactNode;
}

export function FormContainer({ children }: FormContainerProps) {
  return (
    <Card>
      <FormHeader />
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}
