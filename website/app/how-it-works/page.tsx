import { CtaBand } from "@/src/components/CtaBand";
import { DecisionReceipt } from "@/src/components/DecisionReceipt";
import { HumanControl } from "@/src/components/HumanControl";
import { OperatingLoop } from "@/src/components/OperatingLoop";
import { metadataFor } from "@/src/seo/metadata";

export const metadata = metadataFor("howItWorks");

const stages = [
  {
    number: "01",
    title: "Define the outcome and operating constraints",
    body:
      "The human sets the business objective, commercial facts, evidence sources, autonomy posture, and the boundaries the AI must respect."
  },
  {
    number: "02",
    title: "Build and update the Business World Model",
    body:
      "Customer, market, revenue, product, and campaign evidence is organized into a living model used by downstream decisions."
  },
  {
    number: "03",
    title: "Rank opportunities and strategies",
    body:
      "The AI CMO turns evidence into prioritized opportunities, forecasts, strategy options, confidence, and explicit assumptions."
  },
  {
    number: "04",
    title: "Simulate material changes before execution",
    body:
      "The Growth Digital Twin gives consequential strategies a place to be compared before real-world side effects are created."
  },
  {
    number: "05",
    title: "Apply the approval policy",
    body:
      "Actions inside the autonomous envelope can continue. Material spend, publishing, customer communication, and production-impacting changes can wait for an authorized decision."
  },
  {
    number: "06",
    title: "Execute through specialist agents and connected systems",
    body:
      "Approved work moves into campaigns, creative, organic growth, lifecycle, social, CRO, automation, and integration workflows."
  },
  {
    number: "07",
    title: "Verify outcomes and write learning back",
    body:
      "The platform distinguishes a proposed action from a confirmed outcome, then connects verified results to memory and the next correction cycle."
  }
] as const;

export default function HowItWorksPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container narrow-container">
          <span className="eyebrow">Operating model</span>
          <h1>From “what should we do?” to “what did we learn?” in one governed loop.</h1>
          <p>
            GrowthOS treats AI as an execution workflow with evidence, policy, approval, verification,
            and memory—not as a chat box that stops after generating a suggestion.
          </p>
        </div>
      </section>

      <OperatingLoop />

      <section className="section">
        <div className="container process-list">
          {stages.map((stage) => (
            <article key={stage.number}>
              <span>{stage.number}</span>
              <div>
                <h2>{stage.title}</h2>
                <p>{stage.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <HumanControl />
      <DecisionReceipt />
      <CtaBand />
    </>
  );
}
