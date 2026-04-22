export type Permission = 
  | 'content.create'
  | 'content.publish'
  | 'content.review'
  | 'content.delete'
  | 'questions.create'
  | 'questions.answer'
  | 'questionnaires.manage'
  | 'faqs.manage'
  | 'analytics.view'
  | 'health_intelligence.view'
  | 'users.manage'
  | 'rbac.manage'
  | 'system.logs.view'
  | 'settings.manage';

export type RoleCategory = 'DOCTORS' | 'MARKETING' | 'IT_SUPPORT' | 'SUPER_ADMIN';

export type AccountStatus = 'active' | 'suspended' | 'deactivated';

export interface PermissionOverride {
  permission: Permission;
  action: 'grant' | 'deny';
  reason?: string;
  grantedBy: string;
  timestamp: string;
}

export interface AdminAccount {
  id: string;
  name: string;
  email: string;
  roleCategory: RoleCategory;
  status: AccountStatus;
  overrides: PermissionOverride[];
  lastActive: string;
  joinedDate: string;
}

export interface RbacAuditLog {
  id: string;
  adminId: string;
  adminName: string;
  targetAccountId: string;
  targetAccountName: string;
  changeType: 'permission_grant' | 'permission_deny' | 'permission_reset' | 'role_change' | 'status_change';
  details: string;
  timestamp: string;
}
