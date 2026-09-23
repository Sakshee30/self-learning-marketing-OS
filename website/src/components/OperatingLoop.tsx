import { operatingLoop } from "@/src/content/product";

export function OperatingLoop() {
  return (
    <section className="section loop-section" id="operating-loop">
      <div className="container">
        <div className="section-heading split-heading">
          <div>
            <span className="eyebrow">One continuous system</span>
            <h2>Marketing should learn from what actually happened.</h2>
          </div>
          <p>
            GrowthOS is designed around a closed operating loop instead of disconnected dashboards,
            prompts, and campaign tools. Every stage feeds the next one, while consequential changes
            can pause for human approval.
          </p>
        </div>

        <ol className="operating-loop" aria-label="GrowthOS operating loop">
          {operatingLoop.map((step, index) => (
            <li key={step}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{step}</strong>
              {index < operatingLoop.length - 1 && <i aria-hidden="true">→</i>}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
