export function Loader({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700 dark:border-slate-700 dark:border-t-slate-300" />
      {label}
    </div>
  );
}
