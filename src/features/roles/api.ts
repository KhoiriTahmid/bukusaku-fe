import { api } from "@/lib/api";
import { ActionResponse, Paginated } from "@/types/common";
import { Role, RoleDto, RoleQuery } from "./types";

export const getRoles = async (params: RoleQuery) =>
  (await api.get<Paginated<Role>>("/roles", { params })).data;

export const createRole = async (dto: RoleDto) =>
  (await api.post<Role>("/roles", dto)).data;

export const updateRole = async ({
  roleId,
  ...dto
}: Partial<RoleDto> & { roleId: string }) =>
  (await api.patch<Role>(`/roles/${roleId}`, dto)).data;

export const deleteRole = async (roleId: string) =>
  (await api.delete<ActionResponse>(`/roles/${roleId}`)).data;

export const restoreRole = async (roleId: string) =>
  (await api.post<ActionResponse>(`/roles/${roleId}/restore`)).data;
