export type NotificationCategory = "health" | "user" | "system";
export type NotificationPriority = "high" | "medium" | "low";

export interface Notification {
  id: string;
  category: NotificationCategory;
  titleKey: string;
  descriptionKey: string;
  timestamp: string;
  isRead: boolean;
  priority: NotificationPriority;
  metadata?: {
    region?: string;
    userName?: string;
    value?: string;
  };
}
