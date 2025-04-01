
import React from "react";
import { PlatformIcon } from "@/components/ui/platform-icon";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PlatformsListProps {
  platforms: string[];
}

export function PlatformsList({ platforms }: PlatformsListProps) {
  if (!platforms || platforms.length === 0) {
    return <span className="text-muted-foreground text-sm">None</span>;
  }

  // Show max 3 platforms in the list, the rest are shown in the tooltip
  const displayPlatforms = platforms.slice(0, 3);
  const remainingCount = platforms.length - displayPlatforms.length;

  return (
    <div className="flex items-center gap-2">
      {displayPlatforms.map((platform, index) => (
        <TooltipProvider key={index}>
          <Tooltip>
            <TooltipTrigger>
              <PlatformIcon platform={platform} size={20} />
            </TooltipTrigger>
            <TooltipContent>
              <p className="capitalize">{platform}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
      
      {remainingCount > 0 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="rounded-full bg-muted w-6 h-6 flex items-center justify-center text-xs">
                +{remainingCount}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="space-y-1">
                {platforms.slice(3).map((platform, index) => (
                  <p key={index} className="capitalize">{platform}</p>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}
