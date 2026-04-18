import { 
  Permission, RoleCategory, AdminAccount, 
  PermissionOverride, RbacAuditLog 
} from "./rbac.types";

const CATEGORY_DEFAULTS: Record<RoleCategory, Permission[]> = {
  DOCTORS: [
    'questions.answer',
    'questions.create',
    'content.review',
    'health_intelligence.view'
  ],
  MARKETING: [
    'content.create',
    'content.publish',
    'analytics.view',
    'faqs.manage'
  ],
  IT_SUPPORT: [
    'users.manage',
    'system.logs.view',
    'settings.manage',
    'analytics.view'
  ],
  SUPER_ADMIN: [
    'content.create', 'content.publish', 'content.review', 'content.delete',
    'questions.create', 'questions.answer', 'questionnaires.manage', 'faqs.manage',
    'analytics.view', 'health_intelligence.view', 'users.manage', 'rbac.manage',
    'system.logs.view', 'settings.manage'
  ]
};

class RbacService {
  private accounts: AdminAccount[] = [
    {
      id: "adm-1",
      name: "Super Admin",
      email: "admin@tipsandsteps.com",
      roleCategory: "SUPER_ADMIN",
      status: "active",
      overrides: [],
      lastActive: "Just now",
      joinedDate: "2024-01-01"
    },
    {
      id: "doc-1",
      name: "Dr. Khalid Mansour",
      email: "khalid@medical.tips",
      roleCategory: "DOCTORS",
      status: "active",
      overrides: [],
      lastActive: "5 mins ago",
      joinedDate: "2024-11-15"
    },
    {
      id: "mark-1",
      name: "Sara Ahmed",
      email: "sara@marketing.tips",
      roleCategory: "MARKETING",
      status: "active",
      overrides: [
        {
          permission: 'content.delete',
          action: 'grant',
          grantedBy: "adm-1",
          timestamp: new Date().toISOString(),
          reason: "Marketing Lead needs delete rights"
        }
      ],
      lastActive: "2 hrs ago",
      joinedDate: "2024-12-01"
    }
  ];

  private auditLogs: RbacAuditLog[] = [];

  // Public API
  getAccountsByCategory(category: RoleCategory): AdminAccount[] {
    return this.accounts.filter(acc => acc.roleCategory === category);
  }

  getCategoryDefaults(category: RoleCategory): Permission[] {
    return CATEGORY_DEFAULTS[category] || [];
  }

  hasPermission(accountId: string, permission: Permission): boolean {
    const account = this.accounts.find(acc => acc.id === accountId);
    if (!account) return false;
    if (account.roleCategory === 'SUPER_ADMIN') return true;
    if (account.status !== 'active') return false;

    const defaults = CATEGORY_DEFAULTS[account.roleCategory] || [];
    const overrides = account.overrides;

    // Check Denies first (highest priority)
    const isDenied = overrides.some(o => o.permission === permission && o.action === 'deny');
    if (isDenied) return false;

    // Check Grants
    const isGranted = overrides.some(o => o.permission === permission && o.action === 'grant');
    if (isGranted) return true;

    // Finally check defaults
    return defaults.includes(permission);
  }

  updatePermissionOverride(
    adminId: string, 
    targetAccountId: string, 
    permission: Permission, 
    action: 'grant' | 'deny' | 'reset'
  ) {
    const accountIndex = this.accounts.findIndex(acc => acc.id === targetAccountId);
    if (accountIndex === -1) return;

    const admin = this.accounts.find(acc => acc.id === adminId);
    const target = this.accounts[accountIndex];

    if (action === 'reset') {
      target.overrides = target.overrides.filter(o => o.permission !== permission);
    } else {
      // Remove existing overrides for this permission
      target.overrides = target.overrides.filter(o => o.permission !== permission);
      // Add new one
      target.overrides.push({
        permission,
        action,
        grantedBy: adminId,
        timestamp: new Date().toISOString()
      });
    }

    // Log the change
    this.auditLogs.push({
      id: `audit-${Date.now()}`,
      adminId,
      adminName: admin?.name || "Unknown",
      targetAccountId,
      targetAccountName: target.name,
      changeType: action === 'reset' ? 'permission_reset' : (action === 'grant' ? 'permission_grant' : 'permission_deny'),
      details: `${action} permission ${permission} for ${target.name}`,
      timestamp: new Date().toISOString()
    });
  }

  getAuditLogs(): RbacAuditLog[] {
    return this.auditLogs;
  }
}

export const rbacService = new RbacService();
export const currentUserId = "adm-1"; // Mocking current logged in admin
