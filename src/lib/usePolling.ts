import { useEffect, useRef } from "react";

/**
 * Runs `callback` immediately, then every `intervalMs`, until the component
 * unmounts or a dependency changes. No WebSocket/SSE infra exists on the
 * backend for this feature yet, so polling is the simplest reliable option.
 *
 * Also re-runs immediately whenever the tab regains focus/visibility.
 * Browsers throttle (or fully suspend) setInterval in backgrounded tabs, so a
 * tab left open and unfocused for a while can silently stop polling and keep
 * showing a stale snapshot — e.g. a conversation that was reset/rewound on
 * the backend while this tab sat in the background still shows the old
 * messages until something forces a re-fetch. Visibility changes are that
 * trigger.
 */
export function usePolling(callback: () => void | Promise<void>, intervalMs: number, deps: unknown[] = []) {
  const savedCallback = useRef(callback);
  savedCallback.current = callback;

  useEffect(() => {
    savedCallback.current();
    const id = setInterval(() => {
      savedCallback.current();
    }, intervalMs);

    const handleVisibility = () => {
      if (document.visibilityState === "visible") savedCallback.current();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("focus", handleVisibility);

    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("focus", handleVisibility);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
