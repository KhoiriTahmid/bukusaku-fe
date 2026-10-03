import { api } from "@/lib/api";

export interface DashboardSummary {
  balance: number;
  currentMonth: { income: number; expense: number };
  previousMonth: { income: number; expense: number };
  monthly: { month: string; income: number; expense: number }[];
}

export const getSummary = async (category?: string) =>
  (
    await api.get<DashboardSummary>("/transactions/summary", {
      params: { category },
    })
  ).data;
