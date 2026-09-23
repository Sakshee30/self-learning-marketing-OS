import { useId, type ReactNode } from "react";

type FieldIds = {
  inputId: string;
  descriptionId?: string | undefined;
  errorId?: string | undefined;
};

export function FormField({
  label,
  description,
  error,
  required,
  children
}: {
  label: string;
  description?: string | undefined;
  error?: string | undefined;
  required?: boolean | undefined;
  children: (ids: FieldIds) => ReactNode;
}) {
  const inputId = useId();
  const descriptionId = description ? `${inputId}-description` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className="grid gap-1.5">
      <label htmlFor={inputId} className="text-xs font-semibold text-slate-700">
        {label}{required ? <span aria-hidden="true"> *</span> : null}
      </label>
      {children({ inputId, descriptionId, errorId })}
      {description ? <p id={descriptionId} className="m-0 text-xs text-slate-500">{description}</p> : null}
      {error ? <p id={errorId} role="alert" className="m-0 text-xs font-semibold text-red-600">{error}</p> : null}
    </div>
  );
}
