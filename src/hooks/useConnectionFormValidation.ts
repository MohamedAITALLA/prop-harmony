
import { useState } from 'react';
import { ICalConnection } from "@/types/api-responses";

export function useConnectionFormValidation() {
  const [errors, setErrors] = useState<{ical_url?: string}>({});

  const validateForm = (connection: ICalConnection) => {
    const newErrors: {ical_url?: string} = {};
    let isValid = true;
    
    if (!connection?.ical_url || !connection.ical_url.trim()) {
      newErrors.ical_url = "iCal URL is required";
      isValid = false;
    } else if (!connection.ical_url.startsWith('http')) {
      newErrors.ical_url = "URL must start with http:// or https://";
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  return {
    errors,
    setErrors,
    validateForm
  };
}
