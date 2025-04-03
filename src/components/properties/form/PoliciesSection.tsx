
import React from "react";
import { Clock } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./PropertyFormSchema";
import { CheckInOutField } from "./policies/CheckInOutField";
import { MinimumStayField } from "./policies/MinimumStayField";
import { PolicyToggle } from "./policies/PolicyToggle";

interface PoliciesSectionProps {
  form: UseFormReturn<FormValues>;
}

export function PoliciesSection({ form }: PoliciesSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium flex items-center gap-2">
        <Clock className="h-4 w-4" /> Policies & Rules
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <CheckInOutField 
          form={form} 
          name="checkInTime" 
          label="Check-in Time" 
        />
        <CheckInOutField 
          form={form} 
          name="checkOutTime" 
          label="Check-out Time" 
        />
      </div>

      <MinimumStayField form={form} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
        <PolicyToggle 
          form={form} 
          name="petsAllowed" 
          label="Pets Allowed" 
        />
        <PolicyToggle 
          form={form} 
          name="smokingAllowed" 
          label="Smoking Allowed" 
        />
      </div>
    </div>
  );
}
