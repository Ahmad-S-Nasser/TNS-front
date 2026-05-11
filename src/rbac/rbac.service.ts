// ─── RBAC Service Layer ───────────────────────────────────────────────────────
// Real API implementation — calls /admin/users/* via the YARP Gateway.
// Falls back to local mock data if the API is unavailable (offline dev).

import {
  Permission, RoleCategory, AdminAccount,
  PermissionOverride, RbacAuditLog
} from "./rbac.types";
import { apiGet, apiPost, apiPatch, apiDelete } from "@/lib/api-client";

// ─── Role Permission Defaults (client-side reference) ────────────────────────
// These are used for UI rendering only. The backend is the source of truth.

export const CATEGORY_DEFAULTS: Record<RoleCategory, Permission[]> = {
  DOCTOR: [
    'questions.answer',
    'questions.create',
    'content.review',
    'health_intelligence.view'
  ],
  MARKETING: [
    'content.create',
    'analytics.view',
    'faqs.manage'
  ],
  CONTENT_REVIEWER: [
    'content.review',
    'content.publish',
    'content.approve',
    'analytics.view'
  ],
  IT_SUPPORT: [
    'users.manage',
    'system.logs.view',
    'settings.manage',
    'analytics.view'
  ],
  SUPER_ADMIN: [
    'content.create', 'content.publish', 'content.review', 'content.delete', 'content.approve',
    'questions.create', 'questions.answer', 'questionnaires.manage', 'faqs.manage',
    'analytics.view', 'health_intelligence.view', 'users.manage', 'rbac.manage',
    'system.logs.view', 'settings.manage'
  ]
};

// ─── API Functions ────────────────────────────────────────────────────────────

export async function fetchAdminAccounts(): Promise<AdminAccount[]> {
  const users = await apiGet<any[]>("/admin/users");
  return users.map(u => ({
    id: u.id,
    name: `${u.firstName} ${u.lastName}`,
    email: u.email,
    roleCategory: (u.roleCategory || 'DOCTOR').toUpperCase() as RoleCategory,
    status: u.accountStatus.toLowerCase() as any,
    overrides: u.overrides || [],
    lastActive: u.lastActive || u.createdAt,
    joinedDate: u.createdAt
  }));
}

export async function fetchAdminAccount(id: string): Promise<AdminAccount> {
  return apiGet<AdminAccount>(`/admin/users/${id}`);
}

export async function createAdminAccount(
  data: Omit<AdminAccount, "id" | "overrides" | "lastActive" | "joinedDate">
): Promise<AdminAccount> {
  return apiPost<AdminAccount>("/admin/users", data);
}

export async function updateAdminAccountStatus(
  id: string,
  status: "active" | "inactive" | "suspended"
): Promise<AdminAccount> {
  return apiPatch<AdminAccount>(`/admin/users/${id}`, { status });
}

export async function bulkUpdatePermissions(
  userId: string,
  overrides: Omit<PermissionOverride, "grantedBy" | "timestamp">[]
): Promise<void> {
  await apiPatch(`/admin/users/${userId}/permissions`, overrides);
}

export async function updatePermissionOverride(
  targetAccountId: string,
  permission: Permission,
  action: "grant" | "deny" | "reset"
): Promise<AdminAccount> {
  return apiPatch<AdminAccount>(`/admin/users/${targetAccountId}/permissions`, {
    permission,
    action,
  });
}

export async function deleteAdminAccount(id: string): Promise<void> {
  return apiDelete(`/admin/users/${id}`);
}

export async function fetchAuditLogs(page = 1, limit = 50): Promise<{ items: RbacAuditLog[]; total: number }> {
  return apiGet(`/admin/analytics/audit-logs?page=${page}&limit=${limit}`);
}

// ─── Client-side helpers ──────────────────────────────────────────────────────

export function getCategoryDefaults(category: RoleCategory): Permission[] {
  return CATEGORY_DEFAULTS[category] ?? [];
}

export function computeHasPermission(
  account: AdminAccount, 
  permission: Permission, 
  allDefaults?: Record<RoleCategory, Permission[]>
): boolean {
  if (account.roleCategory === "SUPER_ADMIN") return true;
  if (account.status !== "active") return false;

  const defaults = (allDefaults || CATEGORY_DEFAULTS)[account.roleCategory] ?? [];
  const overrides = account.overrides ?? [];

  if (overrides.some((o) => o.permission === permission && o.action === "deny")) return false;
  if (overrides.some((o) => o.permission === permission && o.action === "grant")) return true;
  return defaults.includes(permission);
}

export async function fetchRoleDefaults(): Promise<Record<RoleCategory, Permission[]>> {
  const data = await apiGet<any[]>("/admin/rbac/defaults");
  const result: any = {};
  data.forEach(d => {
    result[d.category.toUpperCase()] = d.permissions;
  });
  return result;
}

export async function saveCategoryDefaults(category: RoleCategory, permissions: Permission[]): Promise<void> {
  await apiPatch(`/admin/rbac/defaults/${category.toLowerCase()}`, permissions);
}

// ─── Legacy class wrapper (backward-compatible) ───────────────────────────────
// Keeps existing components working until they are migrated to React Query hooks.

class RbacServiceCompat {
  private _defaults: Record<RoleCategory, Permission[]> = CATEGORY_DEFAULTS;

  async loadInitialData() {
     try {
       this._defaults = await fetchRoleDefaults();
     } catch (e) {
       console.warn("Failed to load DB roles, using fallback", e);
     }
  }

  getCategoryDefaults(category: RoleCategory): Permission[] {
    return this._defaults[category] ?? [];
  }

  hasPermission(account: AdminAccount | string, permission: Permission): boolean {
    if (typeof account === 'string') return true; 
    return computeHasPermission(account, permission, this._defaults);
  }

  async getAccountsByCategory(category: RoleCategory): Promise<AdminAccount[]> {
    const all = await fetchAdminAccounts();
    return all.filter(a => a.roleCategory === category);
  }

  async saveAccountOverrides(userId: string, overrides: any[]): Promise<void> {
    await bulkUpdatePermissions(userId, overrides);
  }

  async updateGlobalPolicy(category: RoleCategory, permissions: Permission[]): Promise<void> {
    await saveCategoryDefaults(category, permissions);
    this._defaults[category] = permissions;
  }
}

export const rbacService = new RbacServiceCompat();
export const currentUserId = ""; // Will be populated from auth context
