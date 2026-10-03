import { api } from "@/lib/api";

export type MatchMode = "SENSITIVE" | "INSENSITIVE";

export interface MatchResult {
  total: number;
  matched: number;
  percentage: number;
  details: { char: string; matched: boolean }[];
}

export const checkMatch = async (body: {
  input1: string;
  input2: string;
  mode: MatchMode;
}) => (await api.post<MatchResult>("/character-match", body)).data;
