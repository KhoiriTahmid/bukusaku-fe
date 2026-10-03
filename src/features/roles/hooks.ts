import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useInvalidatingMutation } from "@/lib/mutation";
import {
  createRole,
  deleteRole,
  getRoles,
  restoreRole,
  updateRole,
} from "./api";
import { RoleQuery } from "./types";

const KEY = ["roles"];

export const useRoles = (params: RoleQuery, enabled = true) =>
  useQuery({
    queryKey: [...KEY, params],
    queryFn: () => getRoles(params),
    placeholderData: keepPreviousData,
    enabled,
  });

export const useCreateRole = () => useInvalidatingMutation(createRole, KEY);
export const useUpdateRole = () => useInvalidatingMutation(updateRole, KEY);
export const useDeleteRole = () => useInvalidatingMutation(deleteRole, KEY);
export const useRestoreRole = () => useInvalidatingMutation(restoreRole, KEY);
