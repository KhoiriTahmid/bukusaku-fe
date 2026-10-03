// Named UserRecord so it doesn't clash with the logged-in `User` in AuthProvider
export interface UserRecord {
  userId: string;
  roleId: string;
  role?: { roleId: string; name: string } | null;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface UserQuery {
  limit?: number;
  offset?: number;
  search?: string;
  roleId?: string;
  isDeleted?: "true";
}

export interface UserCreateDto {
  roleId: string;
  name: string;
  email: string;
  password: string;
}

export type UserUpdateDto = Partial<UserCreateDto>;
