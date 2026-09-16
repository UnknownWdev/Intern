type ErrorMessageProps = {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function ErrorMessage({ message, actionLabel, onAction }: ErrorMessageProps) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100">
      <p className="font-medium">{message}</p>
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-3 rounded-full bg-amber-700 px-4 py-2 text-xs font-medium text-white"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
