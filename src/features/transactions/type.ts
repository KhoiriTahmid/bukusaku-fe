export type TransactionType = "INCOME" | "EXPENSE";

export interface Transaction {
  transactionId: string;
  userId: string;
  type: TransactionType;
  category: string;
  amount: string; // response dari BE berupa string desimal
  description: string | null;
  transactionDate: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface Paginated<T> {
  total: number;
  limit: number;
  offset: number;
  currentPage: number;
  totalPages: number;
  results: T[];
}

export interface TransactionQuery {
  limit?: number;
  offset?: number;
  search?: string;
  userId?: string;
  type?: TransactionType;
  category?: string;
}

// Sesuai CreateTransactionRequest
export interface CreateTransactionDto {
  userId: string;
  type: TransactionType;
  category: string;
  amount: number;
  description?: string;
  transactionDate: string;
}

// Sesuai UpdateTransactionRequest (userId tidak bisa diubah)
export type UpdateTransactionDto = Partial<
  Omit<CreateTransactionDto, "userId">
>;
