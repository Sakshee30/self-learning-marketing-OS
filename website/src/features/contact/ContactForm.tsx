"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  loadPublishedContactForm,
  type PublishedContactForm,
  type PublishedFormField
} from "@/src/features/contact/published-contact-form";
import {
  submitContactRequest,
  type ContactRequestFields,
  type ContactSubmissionResult,
  type ContactValidationIssue
} from "@/src/features/contact/submit-contact-request";

type SubmissionState =
  | { kind: "idle"; message: "" }
  | { kind: "submitting"; message: string }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };

type FormState =
  | { kind: "loading" }
  | { kind: "published"; form: PublishedContactForm }
  | { kind: "fallback"; reason: "unconfigured" }
  | { kind: "error"; message: string };

type ContactFormProps = {
  formId?: string;
  sourcePath?: string;
  submitLabel?: string;
  allowLocalFallback?: boolean;
};

const fallbackForm: PublishedContactForm = {
  formId: "local-fallback",
  formVersionId: "local-fallback",
  version: 0,
  sourceRevision: null,
  publishedAt: "",
  schema: {
    name: "Request access",
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "email", label: "Work email", type: "email", required: true },
      { name: "company", label: "Company", type: "text", required: false },
      {
        name: "goal",
        label: "What marketing outcome are you trying to improve?",
        type: "textarea",
        required: true
      }
    ]
  }
};

function messageFor(result: ContactSubmissionResult): SubmissionState {
  switch (result.kind) {
    case "accepted":
      return {
        kind: "success",
        message:
          "Your submission was accepted by the Website API. Downstream delivery continues asynchronously."
      };
    case "unconfigured":
      return {
        kind: "error",
        message:
          "This deployment has not connected the GrowthOS Website API yet. No information was sent."
      };
    case "misconfigured":
      return {
        kind: "error",
        message:
          "This deployment has an incomplete form-service configuration. No confirmed submission was recorded."
      };
    case "rejected":
      return {
        kind: "error",
        message:
          result.status >= 500
            ? "The form service could not accept the submission. No success has been recorded."
            : "Some information does not match the published form you opened. Review the highlighted fields and try again."
      };
    case "timeout":
      return {
        kind: "error",
        message:
          "The form service did not confirm acceptance in time. The website is not treating this submission as successful."
      };
    case "unavailable":
      return {
        kind: "error",
        message:
          "The form service could not be reached. The website is not treating this submission as successful."
      };
  }
}

function autocompleteFor(field: PublishedFormField): string | undefined {
  const normalized = field.name.toLowerCase();
  if (field.type === "email" || normalized.includes("email")) return "email";
  if (normalized === "name" || normalized.endsWith("name")) return "name";
  if (normalized.includes("company") || normalized.includes("organization")) return "organization";
  return undefined;
}

function valueFromFormData(field: PublishedFormField, data: FormData) {
  if (field.type === "checkbox") {
    return data.get(field.name) === "on";
  }
  return String(data.get(field.name) ?? "").trim();
}

function fieldsFromForm(form: HTMLFormElement, fields: PublishedFormField[]): ContactRequestFields {
  const data = new FormData(form);
  return Object.fromEntries(fields.map((field) => [field.name, valueFromFormData(field, data)]));
}

function issuesByField(issues: ContactValidationIssue[] | undefined) {
  return new Map((issues ?? []).map((issue) => [issue.field, issue.message]));
}

export function ContactForm({
  formId,
  sourcePath = "/contact",
  submitLabel = "Request access",
  allowLocalFallback = true
}: ContactFormProps = {}) {
  const [formState, setFormState] = useState<FormState>({ kind: "loading" });
  const [state, setState] = useState<SubmissionState>({ kind: "idle", message: "" });
  const [fieldIssues, setFieldIssues] = useState<ContactValidationIssue[]>([]);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setFormState({ kind: "loading" });

    loadPublishedContactForm(formId).then((result) => {
      if (cancelled) return;

      switch (result.kind) {
        case "loaded":
          setFormState({ kind: "published", form: result.form });
          return;
        case "unconfigured":
          if (allowLocalFallback && !formId) {
            setFormState({ kind: "fallback", reason: "unconfigured" });
          } else {
            setFormState({ kind: "error", message: "The Website API is not configured for this form." });
          }
          return;
        case "misconfigured":
          setFormState({ kind: "error", message: "The website form configuration is incomplete." });
          return;
        case "not_found":
          setFormState({ kind: "error", message: "This published form is not currently available." });
          return;
        case "timeout":
          setFormState({ kind: "error", message: "The published form configuration did not load in time." });
          return;
        case "unavailable":
          setFormState({ kind: "error", message: "The published form service is temporarily unavailable." });
          return;
        case "invalid_response":
          setFormState({ kind: "error", message: "The published form configuration could not be verified." });
          return;
        case "rejected":
          setFormState({
            kind: "error",
            message:
              result.status >= 500
                ? "The form service could not load the published configuration."
                : "The form service rejected the published-form request."
          });
      }
    });

    return () => {
      cancelled = true;
    };
  }, [allowLocalFallback, formId, reloadKey]);

  const activeForm =
    formState.kind === "published"
      ? formState.form
      : formState.kind === "fallback"
        ? fallbackForm
        : null;
  const issueMap = useMemo(() => issuesByField(fieldIssues), [fieldIssues]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state.kind === "submitting" || !activeForm) return;

    const form = event.currentTarget;
    setFieldIssues([]);
    setState({ kind: "submitting", message: "Submitting…" });

    const result = await submitContactRequest(
      fieldsFromForm(form, activeForm.schema.fields),
      formState.kind === "published" ? activeForm.formVersionId : undefined,
      formId,
      sourcePath
    );

    if (result.kind === "rejected" && result.issues) {
      setFieldIssues(result.issues);
    }

    const nextState = messageFor(result);
    if (nextState.kind === "success") {
      form.reset();
    }
    setState(nextState);
  }

  if (formState.kind === "loading") {
    return (
      <div className="contact-form-state" role="status" aria-live="polite">
        <span className="form-loading-dot" aria-hidden="true" />
        Loading the published form…
      </div>
    );
  }

  if (formState.kind === "error") {
    return (
      <div className="contact-form-state contact-form-state-error" role="alert">
        <strong>Form unavailable</strong>
        <span>{formState.message}</span>
        <button
          className="button button-secondary button-small"
          type="button"
          onClick={() => setReloadKey((key) => key + 1)}
        >
          Try again
        </button>
      </div>
    );
  }

  if (!activeForm) return null;

  const submitting = state.kind === "submitting";

  return (
    <form className="contact-form" onSubmit={submit} aria-busy={submitting}>
      <div className="published-form-meta" aria-live="polite">
        <span>
          {formState.kind === "published"
            ? `CMS-managed form · Version ${activeForm.version}`
            : "Preview form · Website API not connected"}
        </span>
        {activeForm.schema.name ? <strong>{activeForm.schema.name}</strong> : null}
      </div>

      <div className="dynamic-field-grid">
        {activeForm.schema.fields.map((field) => {
          const error = issueMap.get(field.name);
          const describedBy = error ? `${field.name}-error` : undefined;
          const fieldClass = `dynamic-field dynamic-field-${field.type}`;

          if (field.type === "checkbox") {
            return (
              <label className={`${fieldClass} checkbox-field`} key={field.name}>
                <input
                  name={field.name}
                  type="checkbox"
                  required={field.required}
                  disabled={submitting}
                  aria-invalid={Boolean(error)}
                  aria-describedby={describedBy}
                />
                <span>
                  {field.label}
                  {field.required ? <em aria-hidden="true"> *</em> : null}
                  {error ? (
                    <small id={describedBy} className="field-error">
                      {error}
                    </small>
                  ) : null}
                </span>
              </label>
            );
          }

          return (
            <label className={fieldClass} key={field.name}>
              <span>
                {field.label}
                {field.required ? <em aria-hidden="true"> *</em> : null}
              </span>

              {field.type === "textarea" ? (
                <textarea
                  name={field.name}
                  required={field.required}
                  rows={5}
                  disabled={submitting}
                  aria-invalid={Boolean(error)}
                  aria-describedby={describedBy}
                />
              ) : field.type === "select" ? (
                <select
                  name={field.name}
                  required={field.required}
                  disabled={submitting}
                  aria-invalid={Boolean(error)}
                  aria-describedby={describedBy}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select an option
                  </option>
                  {(field.options ?? []).map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  autoComplete={autocompleteFor(field)}
                  inputMode={field.type === "email" ? "email" : undefined}
                  name={field.name}
                  required={field.required}
                  type={field.type}
                  disabled={submitting}
                  aria-invalid={Boolean(error)}
                  aria-describedby={describedBy}
                />
              )}

              {error ? (
                <small id={describedBy} className="field-error">
                  {error}
                </small>
              ) : null}
            </label>
          );
        })}
      </div>

      <button className="button button-primary" disabled={submitting} type="submit">
        {submitting ? "Submitting…" : submitLabel}
        <span aria-hidden="true">↗</span>
      </button>

      <p className={`form-status form-status-${state.kind}`} aria-live="polite">
        {state.message}
      </p>
    </form>
  );
}
