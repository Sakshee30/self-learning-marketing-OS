"use client";

import { FormEvent, useState } from "react";
import {
  submitContactRequest,
  type ContactRequestFields,
  type ContactSubmissionResult
} from "@/src/features/contact/submit-contact-request";

type SubmissionState =
  | { kind: "idle"; message: "" }
  | { kind: "submitting"; message: string }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };

function messageFor(result: ContactSubmissionResult): SubmissionState {
  switch (result.kind) {
    case "accepted":
      return {
        kind: "success",
        message:
          "Your request was accepted by the configured Website API. The downstream follow-up workflow is separate from this confirmation."
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
          "This deployment has an incomplete contact-service configuration. No confirmed submission was recorded."
      };
    case "rejected":
      return {
        kind: "error",
        message:
          result.status >= 500
            ? "The contact service could not accept the request. No success has been recorded."
            : "The contact service rejected this request. Review the form fields and try again."
      };
    case "timeout":
      return {
        kind: "error",
        message:
          "The contact service did not confirm acceptance in time. The website is not treating this request as successfully submitted."
      };
    case "unavailable":
      return {
        kind: "error",
        message:
          "The contact service could not be reached. The website is not treating this request as successfully submitted."
      };
  }
}

function contactFieldsFrom(form: HTMLFormElement): ContactRequestFields {
  const data = new FormData(form);

  return {
    name: String(data.get("name") ?? "").trim(),
    email: String(data.get("email") ?? "").trim(),
    company: String(data.get("company") ?? "").trim(),
    goal: String(data.get("goal") ?? "").trim()
  };
}

export function ContactForm() {
  const [state, setState] = useState<SubmissionState>({ kind: "idle", message: "" });

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (state.kind === "submitting") {
      return;
    }

    const form = event.currentTarget;
    const fields = contactFieldsFrom(form);

    if (!fields.name || !fields.email || !fields.goal) {
      setState({
        kind: "error",
        message: "Name, work email, and the marketing outcome are required."
      });
      return;
    }

    setState({ kind: "submitting", message: "Submitting your request…" });

    const result = await submitContactRequest(fields);
    const nextState = messageFor(result);

    if (nextState.kind === "success") {
      form.reset();
    }

    setState(nextState);
  }

  const submitting = state.kind === "submitting";

  return (
    <form className="contact-form" onSubmit={submit} aria-busy={submitting}>
      <div className="field-grid">
        <label>
          <span>Name</span>
          <input autoComplete="name" name="name" required disabled={submitting} />
        </label>
        <label>
          <span>Work email</span>
          <input
            autoComplete="email"
            inputMode="email"
            name="email"
            required
            type="email"
            disabled={submitting}
          />
        </label>
      </div>

      <label>
        <span>Company</span>
        <input autoComplete="organization" name="company" disabled={submitting} />
      </label>

      <label>
        <span>What marketing outcome are you trying to improve?</span>
        <textarea
          name="goal"
          required
          rows={5}
          disabled={submitting}
          placeholder="For example: improve qualified pipeline while keeping CAC inside a defined ceiling."
        />
      </label>

      <button className="button button-primary" disabled={submitting} type="submit">
        {submitting ? "Submitting…" : "Request access"}
        <span aria-hidden="true">↗</span>
      </button>

      <p className={`form-status form-status-${state.kind}`} aria-live="polite">
        {state.message}
      </p>
    </form>
  );
}
