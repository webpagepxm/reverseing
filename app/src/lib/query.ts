"use client";

import { useSearchParams } from "next/navigation";

export function useQuery() {
  const params = useSearchParams();
  return {
    params,
    update(changes: Record<string, string | null>, replace = false) {
      const url = new URL(window.location.href);
      for (const [key, value] of Object.entries(changes)) {
        if (value === null) url.searchParams.delete(key);
        else url.searchParams.set(key, value);
      }
      if (url.href !== window.location.href) {
        if (replace) window.history.replaceState(null, "", url);
        else window.history.pushState(null, "", url);
      }
    },
  };
}
