
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../PropertyFormSchema";

// Ensure values are integers
export const ensureInteger = (value: string): number => {
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? 0 : parsed;
};

export const handleIncrement = (form: UseFormReturn<FormValues>, field: keyof FormValues) => {
  const currentValue = form.getValues(field);
  
  // For all capacity fields, use whole number increments
  const current = parseInt(String(currentValue)) || 0;
  form.setValue(field, current + 1);
};

export const handleDecrement = (form: UseFormReturn<FormValues>, field: keyof FormValues) => {
  const currentValue = form.getValues(field);
  
  // For all capacity fields, use whole number decrements
  const current = parseInt(String(currentValue)) || 0;
  const newValue = Math.max(0, current - 1);
  form.setValue(field, newValue);
};

// Special case for accommodates which has a minimum of 1
export const handleAccommodatesDecrement = (form: UseFormReturn<FormValues>) => {
  const currentValue = form.getValues('accommodates');
  const current = ensureInteger(String(currentValue));
  const newValue = Math.max(1, current - 1); // Ensure at least 1
  form.setValue('accommodates', newValue);
};

