"use client";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

export function usePolling<T>(
  queryKey: unknown[],
  queryFn: () => Promise<T>,
  intervalMs: number,
  enabled: boolean = true
): UseQueryResult<T> {
  return useQuery({
    queryKey,
    queryFn,
    refetchInterval: enabled ? intervalMs : false,
    enabled,
    structuralSharing: true,
  });
}
