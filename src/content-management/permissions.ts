// ─── CMS Permissions ──────────────────────────────────────────────────────────
// Refactored to use Dynamic RBAC resolver.

import type { CMSSection, ContentRole } from "./cms.types";
import { rbacService, currentUserId } from "@/rbac/rbac.service";
import { Permission } from "@/rbac/rbac.types";

export interface SectionPermissions {
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canApprove: boolean;
  canPublish: boolean;
  canExport: boolean;
}

// ─── Mapping Logic ───
// Maps the old section-based actions to the new atomic permissions.

function mapActionToPermission(action: keyof SectionPermissions, section: CMSSection): Permission {
  if (section === 'questionnaires') return 'questionnaires.manage';
  if (section === 'faqs') return 'faqs.manage';
  
  switch(action) {
    case 'canCreate': return 'content.create';
    case 'canApprove': return 'content.review';   // Medical review (Doctors)
    case 'canPublish': return 'content.publish'; // Final publishing (Reviewers)
    case 'canDelete': return 'content.delete';
    case 'canExport': return 'analytics.view';
    case 'canView': 
    default: return 'analytics.view'; // Base viewing rights
  }
}

// ─── Public API ───

export function getPermissions(role: ContentRole, section: CMSSection): SectionPermissions {
  // role is no longer the primary driver, accountId is.
  // We use currentUserId for now as the source of truth.
  
  return {
    canView: rbacService.hasPermission(currentUserId, mapActionToPermission('canView', section)),
    canCreate: rbacService.hasPermission(currentUserId, mapActionToPermission('canCreate', section)),
    canEdit: rbacService.hasPermission(currentUserId, mapActionToPermission('canCreate', section)), // Map edit to create for now
    canDelete: rbacService.hasPermission(currentUserId, mapActionToPermission('canDelete', section)),
    canApprove: rbacService.hasPermission(currentUserId, mapActionToPermission('canApprove', section)),
    canPublish: rbacService.hasPermission(currentUserId, mapActionToPermission('canPublish', section)),
    canExport: rbacService.hasPermission(currentUserId, mapActionToPermission('canExport', section)),
  };
}

// Simulated current user role — maintained for legacy compat
export const CURRENT_USER_ROLE: ContentRole = "SUPER_ADMIN";

export function can(action: keyof SectionPermissions, section: CMSSection): boolean {
  return rbacService.hasPermission(currentUserId, mapActionToPermission(action, section));
}

export function getCurrentUserRole(): string {
  // This is a mock: in a real app, you'd get this from the auth context
  return rbacService.getAccountsByCategory("SUPER_ADMIN").find(a => a.id === currentUserId)?.roleCategory 
    || rbacService.getAccountsByCategory("DOCTOR").find(a => a.id === currentUserId)?.roleCategory
    || rbacService.getAccountsByCategory("CONTENT_REVIEWER").find(a => a.id === currentUserId)?.roleCategory
    || rbacService.getAccountsByCategory("MARKETING").find(a => a.id === currentUserId)?.roleCategory
    || "MARKETING"; // Default fallback
}

export function getAccessibleSections(): CMSSection[] {
  const all: CMSSection[] = [
    "behavioral", "psychological", "nutrition", "sexual-education",
    "educational-games", "hospitals", "health-units", "emergency",
    "vaccines", "questionnaires", "faqs",
  ];
  return all.filter(s => can('canView', s));
}
