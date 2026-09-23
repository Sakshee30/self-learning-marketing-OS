import type { Metadata } from "next";
import { CtaBand } from "@/src/components/CtaBand";
import { trustPrinciples } from "@/src/content/product";

export const metadata: Metadata = {
  title: "Trust & control",
  description:
    "Review the current GrowthOS product principles for approvals, policy enforcement, workspace isolation, decision receipts, accessibility, and evidence-backed claims."
};

export default function SecurityPage() {
  return (
    <>
      <section className="page-hero trust-hero">
        <div className="container narrow-container">
          <span className="eyebrow">Trust & control</span>
          <h1>Autonomy should increase operational leverage without hiding responsibility.</h1>
          <p>
            GrowthOS is being designed around explicit policy boundaries, approval states, workspace
            isolation, decision receipts, typed contracts, and honest execution status. This page
            describes product principles from the current implementation contract; it does not claim
            certifications or completed security assurance that have not been verified.
          </p>
        </div>
      </section>

      <section className="section trust-section">
        <div className="container trust-grid">
          {trustPrinciples.map((principle, index) => (
            <article key={principle.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h2>{principle.title}</h2>
              <p>{principle.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section boundary-section">
        <div className="container boundary-card">
          <div>
            <span className="eyebrow">Current boundary</span>
            <h2>The customer product is frontend-first today.</h2>
          </div>
          <p>
            Preview data and simulated interface states are used to finalize workflows and backend
            contracts. Authoritative identity, tenancy, persistence, integrations, model execution,
            approvals, receipts, and external execution belong to the backend phase. The public
            website therefore avoids presenting previews as verified production execution.
          </p>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
