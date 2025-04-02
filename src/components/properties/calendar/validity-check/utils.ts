
import { toast } from 'sonner';
import calendarService from '@/services/calendar-service';
import { format } from 'date-fns';

export interface AvailabilityResult {
  property_id: string;
  start_date: string;
  end_date: string;
  is_available: boolean;
  conflicting_events?: any[];
  duration_days?: number;
}

export const validateDates = (startDate: Date | undefined, endDate: Date | undefined): boolean => {
  if (!startDate || !endDate) {
    toast.error("Please select both start and end dates");
    return false;
  }

  if (startDate > endDate) {
    toast.error("Start date cannot be after end date");
    return false;
  }

  return true;
};

export const checkAvailability = async (
  propertyId: string,
  startDate: Date | undefined,
  endDate: Date | undefined
): Promise<AvailabilityResult | null> => {
  if (!startDate || !endDate) return null;

  try {
    const formattedStartDate = format(startDate, 'yyyy-MM-dd');
    const formattedEndDate = format(endDate, 'yyyy-MM-dd');
    
    const response = await calendarService.checkAvailability(
      propertyId, 
      formattedStartDate, 
      formattedEndDate
    );
    
    const result = response.data;
    
    if (result?.is_available) {
      toast.success("The property is available for the selected dates!");
    } else {
      toast.error("The property is not available for the selected dates.");
    }
    
    return result;
  } catch (error) {
    console.error("Error checking availability:", error);
    toast.error("Failed to check availability. Please try again.");
    return null;
  }
};
