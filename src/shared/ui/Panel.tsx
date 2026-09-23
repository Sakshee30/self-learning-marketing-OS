import type { HTMLAttributes, ReactNode } from "react";

export function Panel({
  children,
  className = "",
  ...props
}: HTMLAttributes<HTMLElement> & { children: ReactNode }) {
  return (
    <section
      {...props}
      className={`rounded-xl border border-growth-line bg-white shadow-sm ${className}`}
    >
      {children}
    </section>
  );
}
