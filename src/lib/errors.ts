import { AxiosError } from "axios";

export const getErrorMessage = (
  e: unknown,
  fallback = "Something went wrong",
) => {
  const m = (e as AxiosError<{ message?: string | string[] }>).response?.data
    ?.message;
  return Array.isArray(m) ? m.join(", ") : (m ?? fallback);
};
