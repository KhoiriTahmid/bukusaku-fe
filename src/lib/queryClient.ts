import { QueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (count, error) => {
        const status = (error as AxiosError).response?.status;
        if (status === 401 || status === 403) return false;
        return count < 2;
      },
    },
  },
});
