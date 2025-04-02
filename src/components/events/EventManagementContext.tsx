
import React, { createContext, useContext, useState } from "react";
import { DateRange } from "react-day-picker";
import { Property } from "@/types/api-responses";

interface EventManagementContextType {
  selectedProperties: string[];
  setSelectedProperties: (properties: string[]) => void;
  selectedPlatforms: string[];
  setSelectedPlatforms: (platforms: string[]) => void;
  selectedEventTypes: string[];
  setSelectedEventTypes: (eventTypes: string[]) => void;
  dateRange: DateRange | undefined;
  setDateRange: (dateRange: DateRange | undefined) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  isAddEventOpen: boolean;
  setIsAddEventOpen: (open: boolean) => void;
  properties: Property[];
}

const EventManagementContext = createContext<EventManagementContextType | undefined>(undefined);

export const EventManagementProvider: React.FC<{ 
  children: React.ReactNode,
  properties: Property[]
}> = ({ children, properties }) => {
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);

  return (
    <EventManagementContext.Provider value={{
      selectedProperties,
      setSelectedProperties,
      selectedPlatforms,
      setSelectedPlatforms,
      selectedEventTypes,
      setSelectedEventTypes,
      dateRange,
      setDateRange,
      searchQuery,
      setSearchQuery,
      showFilters,
      setShowFilters,
      isAddEventOpen,
      setIsAddEventOpen,
      properties
    }}>
      {children}
    </EventManagementContext.Provider>
  );
};

export const useEventManagement = () => {
  const context = useContext(EventManagementContext);
  if (!context) {
    throw new Error("useEventManagement must be used within EventManagementProvider");
  }
  return context;
};
