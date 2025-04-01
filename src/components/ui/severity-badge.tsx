
import { Badge } from "@/components/ui/badge";
import { NotificationSeverity } from "@/types/enums";

interface SeverityBadgeProps {
  severity: NotificationSeverity | string;
}

export function SeverityBadge({ severity }: SeverityBadgeProps) {
  // Map severities to appropriate variants
  const getVariant = () => {
    switch (severity) {
      case NotificationSeverity.CRITICAL:
        return "destructive";
      case NotificationSeverity.WARNING:
        return "secondary"; // Using a compatible variant
      case NotificationSeverity.INFO:
        return "default";
      default:
        return "secondary";
    }
  };

  // Get appropriate label
  const getLabel = () => {
    switch (severity) {
      case NotificationSeverity.CRITICAL:
        return "Critical";
      case NotificationSeverity.WARNING:
        return "Warning";
      case NotificationSeverity.INFO:
        return "Info";
      default:
        return severity;
    }
  };

  return (
    <Badge variant={getVariant()}>
      {getLabel()}
    </Badge>
  );
}
