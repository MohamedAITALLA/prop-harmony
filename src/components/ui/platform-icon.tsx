
import React from "react";
import { cn } from "@/lib/utils";
import { Home, Laptop, Globe, Building, Map, Store, HelpCircle } from "lucide-react";

export interface PlatformIconProps extends React.HTMLAttributes<HTMLDivElement> {
  platform: string;
  size?: number;
}

export function PlatformIcon({ platform, size = 24, className, ...props }: PlatformIconProps) {
  const getIcon = () => {
    const iconProps = { size, strokeWidth: 1.5 };
    
    switch (platform.toLowerCase()) {
      case "airbnb":
        return <Home {...iconProps} color="#FF5A5F" />;
      case "booking.com":
        return <Globe {...iconProps} color="#003580" />;
      case "vrbo":
      case "homeaway":
        return <Building {...iconProps} color="#3D67FF" />;
      case "expedia":
        return <Map {...iconProps} color="#00355F" />;
      case "tripadvisor":
        return <Laptop {...iconProps} color="#00AF87" />;
      case "direct":
        return <Store {...iconProps} color="#000000" />;
      default:
        return <HelpCircle {...iconProps} />;
    }
  };
  
  return (
    <div className={cn("inline-flex items-center", className)} {...props}>
      {getIcon()}
    </div>
  );
}
