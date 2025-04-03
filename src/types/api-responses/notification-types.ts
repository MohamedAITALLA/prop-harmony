
// Notification related types
import { NotificationType, NotificationSeverity } from "@/types/enums";

export interface Notification {
  _id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  severity: NotificationSeverity;
  read: boolean;
  created_at: string;
  updated_at: string;
  related_entity_id?: string;
  related_entity_type?: string;
}

export interface NotificationsResponse {
  success: boolean;
  data: Notification[];
  meta: {
    total: number;
    unread: number;
  };
  message: string;
  timestamp: string;
}
