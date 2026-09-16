"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle theme"
        className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
      >
        ☀️
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
    >
      {resolvedTheme === "dark" ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
}
