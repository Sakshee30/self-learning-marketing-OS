import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-growth-accent text-white border-transparent shadow-sm hover:brightness-95 focus-visible:outline-growth-accent",
  secondary:
    "bg-white text-growth-ink border-growth-line hover:border-slate-300 focus-visible:outline-growth-accent",
  ghost:
    "bg-transparent text-growth-muted border-transparent hover:bg-white focus-visible:outline-growth-accent",
  danger:
    "bg-red-50 text-growth-danger border-red-100 hover:bg-red-100 focus-visible:outline-growth-danger"
};

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
}) {
  return (
    <button
      {...props}
      className={[
        "inline-flex min-h-9 items-center justify-center gap-2 rounded-lg border px-3.5 text-xs font-semibold",
        "transition disabled:pointer-events-none disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
        variants[variant],
        className
      ].join(" ")}
    >
      {children}
    </button>
  );
}
