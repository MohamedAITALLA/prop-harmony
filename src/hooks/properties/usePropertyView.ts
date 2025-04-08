
import { useState } from "react";

export type PropertyViewMode = "grid" | "table";

export function usePropertyView() {
  const [viewMode, setViewMode] = useState<PropertyViewMode>("grid");

  const toggleViewMode = () => {
    setViewMode(prevMode => prevMode === "grid" ? "table" : "grid");
  };

  return {
    viewMode,
    setViewMode,
    toggleViewMode
  };
}
