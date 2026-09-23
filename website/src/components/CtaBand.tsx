import Link from "next/link";

export function CtaBand() {
  return (
    <section className="section cta-section">
      <div className="container">
        <div className="cta-band">
          <div>
            <span className="eyebrow">Build around outcomes</span>
            <h2>Give your marketing system a goal, evidence, constraints, and a clear approval policy.</h2>
          </div>
          <Link className="button button-light" href="/contact">
            Request access <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
