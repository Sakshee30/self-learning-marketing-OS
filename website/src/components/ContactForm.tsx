"use client";

import { FormEvent, useState } from "react";

type SubmissionState =
  | { kind: "idle"; message: "" }
  | { kind: "submitting"; message: string }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };

export function ContactForm() {
  const [state, setState] = useState<SubmissionState>({ kind: "idle", message: "" });

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const apiBaseUrl = process.env.NEXT_PUBLIC_MARKETING_API_BASE_URL;
    const formId = process.env.NEXT_PUBLIC_CONTACT_FORM_ID;

    if (!apiBaseUrl || !formId) {
      setState({
        kind: "error",
        message:
          "This deployment has not connected the GrowthOS Website API yet. No information was sent."
      });
      return;
    }

    const form = event.currentTarget;
    const fields = new FormData(form);

    setState({ kind: "submitting", message: "Submitting your request…" });

    try {
      const response = await fetch(
        `${apiBaseUrl.replace(/\/$/, "")}/v1/forms/${encodeURIComponent(formId)}/submissions`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json"
          },
          body: JSON.stringify({
            fields: {
              name: fields.get("name"),
              email: fields.get("email"),
              company: fields.get("company"),
              goal: fields.get("goal")
            },
            source: {
              path: "/contact"
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Submission rejected with status ${response.status}`);
      }

      form.reset();
      setState({
        kind: "success",
        message: "Your request was accepted. The team can now follow up through the configured workflow."
      });
    } catch {
      setState({
        kind: "error",
        message:
          "We could not confirm that your request was accepted. Please try again after the contact service is available."
      });
    }
  }

  return (
    <form className="contact-form" onSubmit={submit}>
      <div className="field-grid">
        <label>
          <span>Name</span>
          <input autoComplete="name" name="name" required />
        </label>
        <label>
          <span>Work email</span>
          <input autoComplete="email" inputMode="email" name="email" required type="email" />
        </label>
      </div>

      <label>
        <span>Company</span>
        <input autoComplete="organization" name="company" />
      </label>

      <label>
        <span>What marketing outcome are you trying to improve?</span>
        <textarea
          name="goal"
          required
          rows={5}
          placeholder="For example: improve qualified pipeline while keeping CAC inside a defined ceiling."
        />
      </label>

      <button className="button button-primary" disabled={state.kind === "submitting"} type="submit">
        {state.kind === "submitting" ? "Submitting…" : "Request access"}
        <span aria-hidden="true">↗</span>
      </button>

      <p className={`form-status form-status-${state.kind}`} aria-live="polite">
        {state.message}
      </p>
    </form>
  );
}
