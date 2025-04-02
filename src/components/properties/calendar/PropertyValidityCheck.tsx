
import React, { useState } from 'react';
import { AvailabilityResult, checkAvailability, validateDates } from './validity-check/utils';
import { DateSelectionCard } from './validity-check/DateSelectionCard';
import { AvailabilityResultsCard } from './validity-check/AvailabilityResultsCard';

interface PropertyValidityCheckProps {
  propertyId: string;
}

export const PropertyValidityCheck: React.FC<PropertyValidityCheckProps> = ({ propertyId }) => {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [isChecking, setIsChecking] = useState(false);
  const [availabilityResult, setAvailabilityResult] = useState<AvailabilityResult | null>(null);
  const [checkPerformed, setCheckPerformed] = useState(false);

  const handleCheckAvailability = async () => {
    if (!validateDates(startDate, endDate)) {
      return;
    }

    try {
      setIsChecking(true);
      setCheckPerformed(true);
      
      const result = await checkAvailability(propertyId, startDate, endDate);
      setAvailabilityResult(result);
    } catch (error) {
      console.error("Error in handleCheckAvailability:", error);
    } finally {
      setIsChecking(false);
    }
  };

  const clearDates = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setAvailabilityResult(null);
    setCheckPerformed(false);
  };

  return (
    <div className="bg-muted/30 p-6 rounded-xl shadow-sm border">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Check Property Availability</h2>
        <p className="text-muted-foreground mb-8">
          Verify if the property is available for a specific date range before making a booking.
        </p>
        
        <div className="grid gap-8 md:grid-cols-2">
          <DateSelectionCard
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            onCheckAvailability={handleCheckAvailability}
            onClearDates={clearDates}
            isChecking={isChecking}
          />

          <AvailabilityResultsCard 
            isChecking={isChecking}
            checkPerformed={checkPerformed}
            availabilityResult={availabilityResult}
            startDate={startDate}
            endDate={endDate}
          />
        </div>
      </div>
    </div>
  );
}
