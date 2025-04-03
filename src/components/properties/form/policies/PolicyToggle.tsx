
import React from "react";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../PropertyFormSchema";
import { ShieldCheck, ShieldX } from "lucide-react";

interface PolicyToggleProps {
  form: UseFormReturn<FormValues>;
  name: "petsAllowed" | "smokingAllowed";
  label: string;
}

export function PolicyToggle({ form, name, label }: PolicyToggleProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between space-x-3 space-y-0 rounded-md border p-4 transition-colors hover:bg-muted/50">
          <div className="space-y-0.5">
            <FormLabel className="flex items-center gap-2">
              {field.value ? 
                <ShieldCheck className="h-4 w-4 text-green-500" /> : 
                <ShieldX className="h-4 w-4 text-red-500" />
              }
              {label}
            </FormLabel>
          </div>
          <FormControl>
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
              className={field.value ? "bg-green-500" : ""}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
