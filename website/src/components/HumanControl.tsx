import { autonomyPolicies } from "@/src/content/product";

export function HumanControl() {
  return (
    <section className="section control-section" id="human-control">
      <div className="container control-layout">
        <div className="control-copy">
          <span className="eyebrow">Autonomy with an operating envelope</span>
          <h2>Let AI do the repetitive thinking. Keep consequential decisions accountable.</h2>
          <p>
            GrowthOS separates side-effect-free research and planning from actions that change spend,
            publish externally, contact customers, or affect production. Policy determines when the
            system can continue and when a person must decide.
          </p>

          <div className="control-callout">
            <span aria-hidden="true">◎</span>
            <div>
              <strong>Frontend state is not execution proof.</strong>
              <p>
                A click, queued job, forecast, or draft is not presented as completed work without
                authoritative confirmation.
              </p>
            </div>
          </div>
        </div>

        <div className="policy-stack">
          {autonomyPolicies.map((policy) => (
            <article className={`policy-card policy-${policy.tone}`} key={policy.label}>
              <div className="policy-header">
                <span className="policy-dot" aria-hidden="true" />
                <h3>{policy.label}</h3>
              </div>
              <p>{policy.summary}</p>
              <ul>
                {policy.examples.map((example) => (
                  <li key={example}>{example}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
