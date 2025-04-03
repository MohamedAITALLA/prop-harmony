
import React from "react";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../PropertyFormSchema";

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
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
          <FormLabel className="font-normal">{label}</FormLabel>
          <FormControl>
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
