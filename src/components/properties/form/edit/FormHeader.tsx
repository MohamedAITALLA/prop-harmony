
import React from "react";
import { House } from "lucide-react";
import { CardHeader, CardTitle } from "@/components/ui/card";

export function FormHeader() {
  return (
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <House className="h-5 w-5" /> Edit Property
      </CardTitle>
    </CardHeader>
  );
}
