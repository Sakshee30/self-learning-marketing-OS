const evidence = [
  ["Revenue signals", "Connected"],
  ["Audience evidence", "Ready"],
  ["Market evidence", "Updating"],
  ["Approval policy", "Active"]
] as const;

const opportunities = [
  {
    score: "01",
    title: "Recover high-intent demand",
    note: "Model suggests reallocating effort toward the segment with stronger qualified-pipeline evidence.",
    state: "Simulation ready"
  },
  {
    score: "02",
    title: "Refresh weak conversion path",
    note: "Website experience agent found a journey with repeated drop-off and a testable message mismatch.",
    state: "Draft prepared"
  },
  {
    score: "03",
    title: "Expand organic coverage",
    note: "Topic gap analysis found demand where existing product evidence can support a useful answer.",
    state: "Researching"
  }
] as const;

export function ProductPreview() {
  return (
    <div className="product-preview" aria-label="Illustrative GrowthOS command center workflow">
      <div className="preview-topbar">
        <div className="preview-window-controls" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="preview-title">AI CMO / Daily decision brief</div>
        <span className="preview-live">Governed</span>
      </div>

      <div className="preview-body">
        <aside className="preview-sidebar" aria-hidden="true">
          <div className="preview-logo">G</div>
          {Array.from({ length: 7 }).map((_, index) => (
            <span className={index === 1 ? "active" : ""} key={index} />
          ))}
        </aside>

        <div className="preview-workspace">
          <div className="preview-heading">
            <div>
              <small>Primary objective</small>
              <h2>Grow qualified pipeline inside the CAC ceiling.</h2>
            </div>
            <span className="status-pill">Model confidence: monitored</span>
          </div>

          <div className="evidence-strip">
            {evidence.map(([label, status]) => (
              <div key={label}>
                <span>{label}</span>
                <strong>{status}</strong>
              </div>
            ))}
          </div>

          <div className="preview-section-title">
            <div>
              <small>Ranked opportunities</small>
              <strong>What the system recommends next</strong>
            </div>
            <span>Evidence → forecast → policy</span>
          </div>

          <div className="opportunity-list">
            {opportunities.map((item) => (
              <article key={item.score}>
                <span className="opportunity-rank">{item.score}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.note}</p>
                </div>
                <span className="opportunity-state">{item.state}</span>
              </article>
            ))}
          </div>

          <div className="approval-preview">
            <div className="approval-icon" aria-hidden="true">✓</div>
            <div>
              <small>Human approval boundary</small>
              <strong>External publishing and material spend changes wait for approval.</strong>
            </div>
            <span>Policy active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
