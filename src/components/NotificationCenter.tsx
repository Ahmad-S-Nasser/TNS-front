import React, { useEffect, useState } from "react";
import { 
  Popover, PopoverContent, PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { 
  Bell, Check, Trash2, 
  Activity, MessageSquare, ShieldCheck, 
  CircleDot, Clock 
} from "lucide-react";
import { notificationService } from "@/services/notification.service";
import { Notification } from "@/types/notifications";
import { useI18n } from "@/i18n/i18n.context";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export function NotificationCenter() {
  const { t, isRTL } = useI18n();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const update = () => {
      setNotifications(notificationService.getNotifications());
      setUnreadCount(notificationService.getUnreadCount());
    };

    update();
    
    // Simulation: Add a new alert after 5 seconds to show dynamic badge
    const timer = setTimeout(() => {
      notificationService.addNotification({
        category: "health",
        titleKey: "notif_title_shortage",
        descriptionKey: "notif_desc_shortage",
        priority: "high",
        metadata: { region: "Alexandria", value: "MMR Vaccine" }
      });
    }, 5000);

    const sub = notificationService.subscribe(update);
    return () => {
      clearTimeout(timer);
      sub();
    };
  }, []);

  const getIcon = (category: string) => {
    switch (category) {
      case "health" : return <Activity className="h-4 w-4 text-red-500" />;
      case "user"   : return <MessageSquare className="h-4 w-4 text-teal-500" />;
      case "system" : return <ShieldCheck className="h-4 w-4 text-emerald-500" />;
      default       : return <CircleDot className="h-4 w-4 text-slate-400" />;
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-accent text-[10px] font-bold flex items-center justify-center text-accent-foreground animate-in zoom-in duration-300">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        align={isRTL ? "start" : "end"} 
        className="w-[380px] p-0 rounded-3xl overflow-hidden border-none shadow-2xl"
      >
        <div className="bg-white p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-[#0f172a] uppercase tracking-widest flex items-center gap-2">
              {t("notifications")}
              {unreadCount > 0 && <Badge variant="secondary" className="rounded-full px-2 h-5 text-[10px] font-black">{unreadCount}</Badge>}
            </h3>
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => notificationService.markAllAsRead()}
                className="h-8 px-2 text-[10px] font-bold text-teal-600 hover:text-teal-700 hover:bg-teal-50"
              >
                <Check className="h-3 w-3 mr-1" />
                {t("markAllRead")}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => notificationService.clearAll()}
                className="h-8 w-8 p-0 text-slate-300 hover:text-red-500 hover:bg-red-50"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          <Separator className="bg-slate-50" />

          <ScrollArea className="h-[400px]">
            {notifications.length === 0 ? (
              <div className="h-[300px] flex flex-col items-center justify-center text-center p-8 space-y-3">
                 <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-200">
                    <Bell className="h-6 w-6" />
                 </div>
                 <p className="text-xs font-bold text-slate-400">{t("noNotifications")}</p>
              </div>
            ) : (
              <div className="space-y-1 py-1">
                {notifications.map((notif) => (
                  <div 
                    key={notif.id}
                    onClick={() => notificationService.markAsRead(notif.id)}
                    className={`group relative p-4 flex gap-4 transition-all cursor-pointer hover:bg-slate-50/80 ${!notif.isRead ? "bg-teal-50/30" : ""}`}
                  >
                    {!notif.isRead && (
                      <div className="absolute left-1 top-1/2 -translate-y-1/2 h-8 w-1 bg-teal-500 rounded-full" />
                    )}
                    
                    <div className={`h-10 w-10 shrink-0 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                      notif.isRead ? "bg-slate-50" : "bg-white shadow-sm"
                    }`}>
                      {getIcon(notif.category)}
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-start">
                        <h4 className={`text-xs ${notif.isRead ? "font-bold text-slate-600" : "font-black text-[#0f172a]"}`}>
                          {t(notif.titleKey as any)}
                        </h4>
                        <span className="text-[9px] font-bold text-slate-400 whitespace-nowrap flex items-center gap-1">
                          <Clock className="h-2.5 w-2.5" />
                          {formatTime(notif.timestamp)}
                        </span>
                      </div>
                      <p className={`text-[11px] leading-relaxed ${notif.isRead ? "text-slate-400" : "text-slate-500"}`}>
                        {t(notif.descriptionKey as any)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
}
