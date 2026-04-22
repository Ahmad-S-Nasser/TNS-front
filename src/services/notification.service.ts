import { Notification } from "../types/notifications";

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    category: "health",
    titleKey: "notif_title_shortage",
    descriptionKey: "notif_desc_shortage",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    isRead: false,
    priority: "high",
    metadata: { region: "Cairo", value: "Polio Vaccine" }
  },
  {
    id: "2",
    category: "user",
    titleKey: "notif_title_question",
    descriptionKey: "notif_desc_question",
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    isRead: false,
    priority: "medium",
    metadata: { userName: "Marwa A." }
  },
  {
    id: "3",
    category: "system",
    titleKey: "notif_title_backup",
    descriptionKey: "notif_desc_backup",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    isRead: true,
    priority: "low"
  }
];

class NotificationService {
  private notifications: Notification[] = [...MOCK_NOTIFICATIONS];
  private listeners: (() => void)[] = [];

  getNotifications() {
    return [...this.notifications].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  getUnreadCount() {
    return this.notifications.filter(n => !n.isRead).length;
  }

  markAsRead(id: string) {
    this.notifications = this.notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    );
    this.notify();
  }

  markAllAsRead() {
    this.notifications = this.notifications.map(n => ({ ...n, isRead: true }));
    this.notify();
  }

  clearAll() {
    this.notifications = [];
    this.notify();
  }

  addNotification(notification: Omit<Notification, "id" | "timestamp" | "isRead">) {
    const newNotif: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      isRead: false
    };
    this.notifications.unshift(newNotif);
    this.notify();
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }
}

export const notificationService = new NotificationService();
