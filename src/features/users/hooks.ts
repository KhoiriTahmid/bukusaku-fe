import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useInvalidatingMutation } from "@/lib/mutation";
import {
  createUser,
  deleteUser,
  getUsers,
  restoreUser,
  updateUser,
} from "./api";
import { UserQuery } from "./types";

const KEY = ["users"];

export const useUsers = (params: UserQuery) =>
  useQuery({
    queryKey: [...KEY, params],
    queryFn: () => getUsers(params),
    placeholderData: keepPreviousData,
  });

export const useCreateUser = () => useInvalidatingMutation(createUser, KEY);
export const useUpdateUser = () => useInvalidatingMutation(updateUser, KEY);
export const useDeleteUser = () => useInvalidatingMutation(deleteUser, KEY);
export const useRestoreUser = () => useInvalidatingMutation(restoreUser, KEY);
