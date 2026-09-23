import { forwardRef, type SelectHTMLAttributes } from "react";

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className = "", children, ...props }, ref) {
    return (
      <select
        ref={ref}
        {...props}
        className={[
          "min-h-10 w-full rounded-lg border border-growth-line bg-white px-3 text-sm text-growth-ink",
          "focus:border-violet-400 focus:ring-2 focus:ring-violet-100 disabled:bg-slate-50",
          className
        ].join(" ")}
      >
        {children}
      </select>
    );
  }
);
