import type { Metadata } from "next";
import { CapabilityGrid } from "@/src/components/CapabilityGrid";
import { CtaBand } from "@/src/components/CtaBand";

export const metadata: Metadata = {
  title: "Product",
  description:
    "Explore the GrowthOS product surfaces for command, decision intelligence, execution, learning, governance, approvals, integrations, and workspace operations."
};

export default function ProductPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container narrow-container">
          <span className="eyebrow">Product architecture</span>
          <h1>A marketing operating system, not another isolated AI feature.</h1>
          <p>
            GrowthOS is organized around a complete customer journey: establish the workspace and
            constraints, understand the business, rank opportunities, simulate material strategies,
            request approval when needed, execute through specialist agents, verify outcomes, and
            write evidence-backed learning to memory.
          </p>
        </div>
      </section>

      <section className="section product-detail-section">
        <div className="container">
          <CapabilityGrid />
        </div>
      </section>

      <section className="section contract-section">
        <div className="container contract-grid">
          <div>
            <span className="eyebrow">Shared AI lifecycle</span>
            <h2>Autonomous work has explicit states.</h2>
          </div>
          <div className="lifecycle-list">
            {[
              "queued",
              "researching",
              "reasoning",
              "planning",
              "simulating",
              "waiting_for_approval",
              "approved",
              "executing",
              "verifying",
              "completed",
              "learning"
            ].map((item, index) => (
              <div key={item}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item.replaceAll("_", " ")}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
