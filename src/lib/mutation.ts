import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useInvalidatingMutation = <TVars, TData>(
  fn: (v: TVars) => Promise<TData>,
  key: readonly unknown[],
) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });
};
