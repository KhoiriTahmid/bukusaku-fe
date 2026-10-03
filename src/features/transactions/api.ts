import { api } from "@/lib/api";
import {
  CreateTransactionDto,
  Paginated,
  Transaction,
  TransactionQuery,
  UpdateTransactionDto,
} from "./type";

export const getTransactions = async (params: TransactionQuery) =>
  (await api.get<Paginated<Transaction>>("/transactions", { params })).data;

export const createTransaction = async (dto: CreateTransactionDto) =>
  (await api.post<Transaction>("/transactions", dto)).data;

export const updateTransaction = async ({
  transactionId,
  ...dto
}: UpdateTransactionDto & { transactionId: string }) =>
  (await api.patch<Transaction>(`/transactions/${transactionId}`, dto)).data;

// Default-nya soft delete. Untuk hapus permanen: { params: { forceDelete: true } }
export const deleteTransaction = async (transactionId: string) =>
  (
    await api.delete<{ isSuccess: boolean; message: string }>(
      `/transactions/${transactionId}`,
    )
  ).data;
