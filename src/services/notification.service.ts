// ─── Notification Service ─────────────────────────────────────────────────────
// Fetches notifications from /admin/notifications (via YARP Gateway).
// Falls back to empty list gracefully when backend is unavailable.

import { Notification } from "../types/notifications";
import { apiGet, apiPatch, apiDelete } from "@/lib/api-client";

// ─── API calls ────────────────────────────────────────────────────────────────

export async function fetchNotifications(): Promise<Notification[]> {
  return apiGet<Notification[]>("/admin/notifications");
}

export async function markNotificationRead(id: string): Promise<void> {
  return apiPatch(`/admin/notifications/${id}/read`);
}

export async function markAllNotificationsRead(): Promise<void> {
  return apiPatch("/admin/notifications/read-all");
}

export async function deleteNotification(id: string): Promise<void> {
  return apiDelete(`/admin/notifications/${id}`);
}

// ─── Legacy reactive service (backward-compatible) ────────────────────────────
// Used by components that subscribe to the notification service directly.
// New components should use the useNotifications hook instead.

class NotificationService {
  private notifications: Notification[] = [];
  private listeners: (() => void)[] = [];
  private loaded = false;

  async load() {
    if (this.loaded) return;
    try {
      this.notifications = await fetchNotifications();
      this.loaded = true;
      this.notify();
    } catch {
      // Backend not available — start empty
      this.loaded = true;
    }
  }

  getNotifications() {
    return [...this.notifications].sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  getUnreadCount() {
    return this.notifications.filter(n => !n.isRead).length;
  }

  async markAsRead(id: string) {
    try {
      await markNotificationRead(id);
    } catch { /* optimistic update below */ }
    this.notifications = this.notifications.map(n =>
      n.id === id ? { ...n, isRead: true } : n
    );
    this.notify();
  }

  async markAllAsRead() {
    try {
      await markAllNotificationsRead();
    } catch { /* optimistic */ }
    this.notifications = this.notifications.map(n => ({ ...n, isRead: true }));
    this.notify();
  }

  async clearAll() {
    this.notifications = [];
    this.notify();
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    // Trigger initial load when first subscriber attaches
    this.load();
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }
}

export const notificationService = new NotificationService();
