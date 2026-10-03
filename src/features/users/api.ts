import { api } from "@/lib/api";
import { ActionResponse, Paginated } from "@/types/common";
import { UserCreateDto, UserQuery, UserRecord, UserUpdateDto } from "./types";

export const getUsers = async (params: UserQuery) =>
  (await api.get<Paginated<UserRecord>>("/users", { params })).data;

export const createUser = async (dto: UserCreateDto) =>
  (await api.post<UserRecord>("/users", dto)).data;

export const updateUser = async ({
  userId,
  ...dto
}: UserUpdateDto & { userId: string }) =>
  (await api.patch<UserRecord>(`/users/${userId}`, dto)).data;

export const deleteUser = async (userId: string) =>
  (await api.delete<ActionResponse>(`/users/${userId}`)).data;

export const restoreUser = async (userId: string) =>
  (await api.post<ActionResponse>(`/users/${userId}/restore`)).data;
