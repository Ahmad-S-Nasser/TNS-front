import {
  LayoutDashboard,
  Users,
  FileText,
  BarChart3,
  Shield,
  Settings,
  ClipboardList,
  HeartPulse,
  Megaphone,
  Wrench,
  LogOut,
  MessageSquare,
  HelpCircle,
  TrendingUp,
  BrainCircuit,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { rbacService, currentUserId } from "@/rbac/rbac.service";
import { Permission } from "@/rbac/rbac.types";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { useI18n } from "@/i18n/i18n.context";

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { t, isRTL } = useI18n();

  const mainNav = [
    { titleKey: "nav_dashboard", url: "/", icon: LayoutDashboard },
    { titleKey: "nav_users", url: "/users", icon: Users, permission: 'users.manage' as Permission },
    { titleKey: "nav_questions", url: "/questions", icon: MessageSquare, permission: 'questions.answer' as Permission },
    { titleKey: "nav_growthMatrix", url: "/growth-matrix", icon: TrendingUp, permission: 'analytics.view' as Permission },
    { titleKey: "nav_content", url: "/content", icon: FileText, permission: 'analytics.view' as Permission },
    { titleKey: "nav_analytics", url: "/analytics", icon: BarChart3, permission: 'analytics.view' as Permission },
    { titleKey: "nav_healthIntelligence", url: "/health-intelligence", icon: BrainCircuit, permission: 'health_intelligence.view' as Permission },
  ] as const;


  const systemNav = [
    { titleKey: "nav_auditLogs", url: "/audit-logs", icon: ClipboardList, permission: 'system.logs.view' as Permission },
    { titleKey: "nav_support", url: "/support", icon: HelpCircle },
    { titleKey: "nav_settings", url: "/settings", icon: Settings, permission: 'settings.manage' as Permission },
    { titleKey: "nav_roles", url: "/roles", icon: Shield, permission: 'rbac.manage' as Permission },
  ] as const;

  const filterNav = (items: any[]) => items.filter(item => 
    !item.permission || rbacService.hasPermission(currentUserId, item.permission)
  );

  return (
    <Sidebar collapsible="icon" className="border-r-0" side={isRTL ? "right" : "left"}>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary">
            <HeartPulse className="h-5 w-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="animate-fade-in">
              <h1 className="text-sm font-bold tracking-tight text-sidebar-foreground">
                Tips & Steps
              </h1>
              <p className="text-[10px] text-sidebar-foreground/60 font-medium uppercase tracking-wider">
                {isRTL ? "لوحة الإدارة" : "Admin Panel"}
              </p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {/* Main */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50 text-[10px] uppercase tracking-widest font-semibold">
            {t("nav_main")}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filterNav([...mainNav]).map((item) => (
                <SidebarMenuItem key={item.titleKey}>
                  <SidebarMenuButton asChild tooltip={t(item.titleKey)}>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{t(item.titleKey)}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>


        {/* System */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50 text-[10px] uppercase tracking-widest font-semibold">
            {t("nav_system")}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filterNav([...systemNav]).map((item) => (
                <SidebarMenuItem key={item.titleKey}>
                  <SidebarMenuButton asChild tooltip={t(item.titleKey)}>
                    <NavLink
                      to={item.url}
                      className="text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{t(item.titleKey)}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border/20">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm border border-white/20">
              EG
            </div>
            {!collapsed && (
              <div className="animate-fade-in overflow-hidden">
                <p className="text-sm font-bold text-sidebar-foreground truncate">
                  Eman Gado
                </p>
                <div className="flex">
                  <span className="text-[9px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-1.5 py-0.5 rounded-md border border-primary/20">
                    {t("header_superAdmin")}
                  </span>
                </div>
              </div>
            )}
          </div>
          {!collapsed && (
            <button className="text-sidebar-foreground/40 hover:text-sidebar-foreground transition-colors p-1 rounded-md hover:bg-sidebar-accent">
              <LogOut className="h-4 w-4" />
            </button>
          )}
          {collapsed && (
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Logout">
                  <LogOut className="h-4 w-4" />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
