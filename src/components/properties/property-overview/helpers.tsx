
import React from "react";

/**
 * Renders an item with an icon and label/value pair
 */
export const renderIconItem = (label: string, value: React.ReactNode, icon: React.ReactNode) => {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/30">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
};

/**
 * Renders an amenity item with icon and status
 */
export const renderAmenity = (name: string, value: boolean, icon: React.ReactNode) => {
  return (
    <div className={`
      flex items-center gap-3 p-3 rounded-lg transition-all
      ${value ? "bg-primary/10" : "bg-muted/30 opacity-60"}
    `}>
      <div className={`
        rounded-full p-2
        ${value ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}
      `}>
        {icon}
      </div>
      <span className={value ? "font-medium" : ""}>{name}</span>
      {value ? (
        <span className="ml-auto text-green-600 text-sm">✓</span>
      ) : (
        <span className="ml-auto text-gray-400 text-sm">✗</span>
      )}
    </div>
  );
};
