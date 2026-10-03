import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getSummary } from "./api";

export const useSummary = (category?: string) =>
  useQuery({
    queryKey: ["transactions", "summary", category ?? "all"],
    queryFn: () => getSummary(category),
    placeholderData: keepPreviousData,
  });
