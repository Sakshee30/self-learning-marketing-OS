import Link from "next/link";

export default function NotFound() {
  return (
    <section className="not-found">
      <div className="container narrow-container">
        <span className="eyebrow">404</span>
        <h1>This page is outside the current GrowthOS map.</h1>
        <p>Return to the product overview or continue from the homepage.</p>
        <div className="hero-actions">
          <Link className="button button-primary" href="/">
            Back to home
          </Link>
          <Link className="button button-secondary" href="/product">
            Explore product
          </Link>
        </div>
      </div>
    </section>
  );
}
