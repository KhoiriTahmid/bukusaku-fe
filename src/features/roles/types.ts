export type PermissionMap = Record<string, boolean>;

export interface Role {
  roleId: string;
  name: string;
  description: string | null;
  permissions: PermissionMap | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface RoleQuery {
  limit?: number;
  offset?: number;
  search?: string;
  isDeleted?: "true";
}

export interface RoleDto {
  name: string;
  description?: string;
  permissions?: PermissionMap;
}
