import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createTransaction,
  deleteTransaction,
  getTransactions,
  updateTransaction,
} from "./api";
import { TransactionQuery } from "./type";

const KEY = ["transactions"];

export const useTransactions = (params: TransactionQuery) =>
  useQuery({
    queryKey: [...KEY, params],
    queryFn: () => getTransactions(params),
    placeholderData: keepPreviousData, // tabel tidak berkedip saat pindah halaman
    enabled: !!params.userId, // tunggu user siap sebelum fetch
  });

const useInvalidatingMutation = <TVars, TData>(
  fn: (v: TVars) => Promise<TData>,
) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
};

export const useCreateTransaction = () =>
  useInvalidatingMutation(createTransaction);
export const useUpdateTransaction = () =>
  useInvalidatingMutation(updateTransaction);
export const useDeleteTransaction = () =>
  useInvalidatingMutation(deleteTransaction);
