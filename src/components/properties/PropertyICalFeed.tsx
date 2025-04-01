
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyableField } from "@/components/ui/copyable-field";
import { propertyService } from "@/services/api-service";

interface PropertyICalFeedProps {
  propertyId: string;
}

export function PropertyICalFeed({ propertyId }: PropertyICalFeedProps) {
  const feedUrl = propertyService.getICalFeedUrl(propertyId);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Property iCal Feed</CardTitle>
        <CardDescription>
          Share this iCal feed with other platforms to export your calendar
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CopyableField 
          value={feedUrl}
          description="Copy this URL and add it to any platform that supports iCal importing"
        />
      </CardContent>
    </Card>
  );
}
