type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  loading?: boolean;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-slate-900 text-white hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200",
  secondary: "border border-slate-300 bg-white text-slate-700 hover:border-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200",
  danger: "border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200",
  ghost: "text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white",
};

export function Button({ variant = "primary", loading = false, children, className = "", disabled, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition ${variantClasses[variant]} ${className}`.trim()}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}
