
import React from "react";
import { PropertyType } from "@/types/enums";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { House } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./PropertyFormSchema";

interface BasicInfoSectionProps {
  form: UseFormReturn<FormValues>;
}

export function BasicInfoSection({ form }: BasicInfoSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium flex items-center gap-2">
        <House className="h-4 w-4" /> Basic Information
      </h3>
      
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Property Name</FormLabel>
            <FormControl>
              <Input placeholder="Beach Villa" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="property_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Property Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a property type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {Object.values(PropertyType).map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Describe your property..." 
                className="min-h-[100px]" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
