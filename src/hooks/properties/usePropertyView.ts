
import { useState } from "react";

export type PropertyViewMode = "grid" | "list" | "table";

export function usePropertyView() {
  const [viewMode, setViewMode] = useState<PropertyViewMode>("grid");

  const toggleViewMode = () => {
    setViewMode(prevMode => {
      if (prevMode === "grid") return "list";
      if (prevMode === "list") return "table";
      return "grid";
    });
  };

  return {
    viewMode,
    setViewMode,
    toggleViewMode
  };
}
