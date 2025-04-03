
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../PropertyFormSchema";

interface CheckInOutFieldProps {
  form: UseFormReturn<FormValues>;
  name: "checkInTime" | "checkOutTime";
  label: string;
}

export function CheckInOutField({ form, name, label }: CheckInOutFieldProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input type="time" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
