import { forwardRef, type InputHTMLAttributes } from "react";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className = "", ...props }, ref) {
    return (
      <input
        ref={ref}
        {...props}
        className={[
          "min-h-10 w-full rounded-lg border border-growth-line bg-white px-3 text-sm text-growth-ink",
          "placeholder:text-slate-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100",
          "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400",
          className
        ].join(" ")}
      />
    );
  }
);
