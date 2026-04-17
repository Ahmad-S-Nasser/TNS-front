// ─── CMS Permissions ──────────────────────────────────────────────────────────
// Role-Based Access Control for each CMS section.

import type { CMSSection, ContentRole } from "./cms.types";

export interface SectionPermissions {
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canApprove: boolean;
  canPublish: boolean;
  canExport: boolean;
}

type RolePermissionMatrix = Record<ContentRole, SectionPermissions>;

// ─── Educational Content Permissions ─────────────────────────────────────────
// Sections: behavioral, psychological, nutrition, educational-games

const educationalPermissions: RolePermissionMatrix = {
  SUPER_ADMIN:  { canView: true,  canCreate: true,  canEdit: true,  canDelete: true,  canApprove: true,  canPublish: true,  canExport: true  },
  MANAGER:      { canView: true,  canCreate: false, canEdit: false, canDelete: false, canApprove: true,  canPublish: true,  canExport: true  },
  MARKETING:    { canView: true,  canCreate: true,  canEdit: true,  canDelete: false, canApprove: false, canPublish: false, canExport: false },
  DOCTOR:       { canView: true,  canCreate: false, canEdit: false, canDelete: false, canApprove: true,  canPublish: false, canExport: false },
  IT_SUPPORT:   { canView: true,  canCreate: false, canEdit: false, canDelete: false, canApprove: false, canPublish: false, canExport: false },
};

// ─── Medical Content Permissions ──────────────────────────────────────────────
// Sections: sexual-education (requires professional review)

const medicalPermissions: RolePermissionMatrix = {
  SUPER_ADMIN:  { canView: true,  canCreate: true,  canEdit: true,  canDelete: true,  canApprove: true,  canPublish: true,  canExport: true  },
  MANAGER:      { canView: true,  canCreate: false, canEdit: false, canDelete: false, canApprove: true,  canPublish: true,  canExport: true  },
  MARKETING:    { canView: false, canCreate: false, canEdit: false, canDelete: false, canApprove: false, canPublish: false, canExport: false },
  DOCTOR:       { canView: true,  canCreate: true,  canEdit: true,  canDelete: false, canApprove: true,  canPublish: false, canExport: false },
  IT_SUPPORT:   { canView: true,  canCreate: false, canEdit: false, canDelete: false, canApprove: false, canPublish: false, canExport: false },
};

// ─── Service/Location Content Permissions ────────────────────────────────────
// Sections: hospitals, health-units

const servicePermissions: RolePermissionMatrix = {
  SUPER_ADMIN:  { canView: true,  canCreate: true,  canEdit: true,  canDelete: true,  canApprove: true,  canPublish: true,  canExport: true  },
  MANAGER:      { canView: true,  canCreate: true,  canEdit: true,  canDelete: false, canApprove: true,  canPublish: true,  canExport: true  },
  MARKETING:    { canView: true,  canCreate: false, canEdit: false, canDelete: false, canApprove: false, canPublish: false, canExport: false },
  DOCTOR:       { canView: true,  canCreate: false, canEdit: false, canDelete: false, canApprove: false, canPublish: false, canExport: false },
  IT_SUPPORT:   { canView: true,  canCreate: false, canEdit: false, canDelete: false, canApprove: false, canPublish: false, canExport: false },
};

// ─── Emergency Content Permissions ───────────────────────────────────────────
// Section: emergency — only admin-level roles can manage

const emergencyPermissions: RolePermissionMatrix = {
  SUPER_ADMIN:  { canView: true,  canCreate: true,  canEdit: true,  canDelete: true,  canApprove: true,  canPublish: true,  canExport: true  },
  MANAGER:      { canView: true,  canCreate: false, canEdit: false, canDelete: false, canApprove: true,  canPublish: true,  canExport: true  },
  MARKETING:    { canView: false, canCreate: false, canEdit: false, canDelete: false, canApprove: false, canPublish: false, canExport: false },
  IT_SUPPORT:   { canView: true,  canCreate: false, canEdit: false, canDelete: false, canApprove: false, canPublish: false, canExport: false },
};

// ─── Vaccine Content Permissions ─────────────────────────────────────────────
// Section: vaccines — Doctors and Admins can publish, Marketing can draft

const vaccinePermissions: RolePermissionMatrix = {
  SUPER_ADMIN:  { canView: true,  canCreate: true,  canEdit: true,  canDelete: true,  canApprove: true,  canPublish: true,  canExport: true  },
  MANAGER:      { canView: true,  canCreate: false, canEdit: false, canDelete: false, canApprove: true,  canPublish: true,  canExport: true  },
  MARKETING:    { canView: true,  canCreate: true,  canEdit: true,  canDelete: false, canApprove: false, canPublish: false, canExport: false },
  DOCTOR:       { canView: true,  canCreate: true,  canEdit: true,  canDelete: false, canApprove: true,  canPublish: true,  canExport: true  },
  IT_SUPPORT:   { canView: true,  canCreate: false, canEdit: false, canDelete: false, canApprove: false, canPublish: false, canExport: false },
};

// ─── Section → Permission Matrix Map ─────────────────────────────────────────

const sectionPermissionMap: Record<CMSSection, RolePermissionMatrix> = {
  "behavioral":        educationalPermissions,
  "psychological":     educationalPermissions,
  "nutrition":         educationalPermissions,
  "educational-games": educationalPermissions,
  "sexual-education":  medicalPermissions,
  "hospitals":         servicePermissions,
  "health-units":      servicePermissions,
  "emergency":         emergencyPermissions,
  "vaccines":          vaccinePermissions,
};

// ─── Public API ───────────────────────────────────────────────────────────────

export function getPermissions(role: ContentRole, section: CMSSection): SectionPermissions {
  return sectionPermissionMap[section][role];
}

// Simulated current user role — replace with auth context when backend is ready
export const CURRENT_USER_ROLE: ContentRole = "SUPER_ADMIN";

export function can(action: keyof SectionPermissions, section: CMSSection, role: ContentRole = CURRENT_USER_ROLE): boolean {
  return getPermissions(role, section)[action];
}

export function getAccessibleSections(role: ContentRole = CURRENT_USER_ROLE): CMSSection[] {
  const all: CMSSection[] = [
    "behavioral", "psychological", "nutrition", "sexual-education",
    "educational-games", "hospitals", "health-units", "emergency",
    "vaccines",
  ];
  return all.filter(s => getPermissions(role, s).canView);
}
