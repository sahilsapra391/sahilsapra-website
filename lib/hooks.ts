"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

// False during SSR and hydration, true after. Lets a component render
// client-only output (portals, theme-dependent labels) without a
// setState-in-effect round trip.
export function useMounted(): boolean {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}

// Live matchMedia result. The server snapshot is false, so the first client
// render matches the server HTML and updates right after hydration.
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}
