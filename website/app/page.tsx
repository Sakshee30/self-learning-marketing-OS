import Link from "next/link";
import { CapabilityGrid } from "@/src/components/CapabilityGrid";
import { CtaBand } from "@/src/components/CtaBand";
import { DecisionReceipt } from "@/src/components/DecisionReceipt";
import { HumanControl } from "@/src/components/HumanControl";
import { OperatingLoop } from "@/src/components/OperatingLoop";
import { ProductPreview } from "@/src/components/ProductPreview";

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="hero-orb hero-orb-one" aria-hidden="true" />
        <div className="hero-orb hero-orb-two" aria-hidden="true" />
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="hero-badge">
              <span className="pulse-dot" aria-hidden="true" />
              Autonomous marketing, governed by human policy
            </div>
            <h1>
              One operating system for a marketing team that{" "}
              <span>observes, decides, executes, and learns.</span>
            </h1>
            <p className="hero-lead">
              GrowthOS connects business goals, evidence, AI reasoning, simulation, human approvals,
              execution, measurement, and memory in one continuous operating loop.
            </p>
            <div className="hero-actions">
              <Link className="button button-primary" href="/contact">
                Request access <span aria-hidden="true">↗</span>
              </Link>
              <Link className="button button-secondary" href="/how-it-works">
                See how the loop works <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className="hero-proof">
              <div>
                <strong>Goal-first</strong>
                <span>Start from a business outcome</span>
              </div>
              <div>
                <strong>Policy-aware</strong>
                <span>Pause consequential actions</span>
              </div>
              <div>
                <strong>Learning loop</strong>
                <span>Correct from verified outcomes</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <ProductPreview />
          </div>
        </div>
      </section>

      <section className="statement-strip" aria-label="GrowthOS product positioning">
        <div className="container statement-grid">
          <span>AI CMO</span>
          <span>Business World Model</span>
          <span>Growth Digital Twin</span>
          <span>Human Approval Center</span>
          <span>Decision Memory</span>
        </div>
      </section>

      <OperatingLoop />

      <section className="section capabilities-section" id="capabilities">
        <div className="container">
          <div className="section-heading centered-heading">
            <span className="eyebrow">From strategy to execution</span>
            <h2>Replace fragmented marketing workflows with one coordinated product surface.</h2>
            <p>
              The system is organized around the work needed to understand the business, choose what
              to do, execute through specialist capabilities, learn from outcomes, and govern the
              entire process.
            </p>
          </div>
          <CapabilityGrid compact />
        </div>
      </section>

      <HumanControl />
      <DecisionReceipt />
      <CtaBand />
    </>
  );
}
