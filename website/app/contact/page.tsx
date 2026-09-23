import type { Metadata } from "next";
import { ContactForm } from "@/src/components/ContactForm";

export const metadata: Metadata = {
  title: "Request access",
  description:
    "Request access to GrowthOS and tell the team which business outcome you want your marketing operating system to improve."
};

export default function ContactPage() {
  return (
    <section className="page-hero contact-page">
      <div className="container contact-layout">
        <div className="contact-copy">
          <span className="eyebrow">Request access</span>
          <h1>Start with the outcome your marketing system should own.</h1>
          <p>
            Tell us the commercial result you want to improve and the operating constraint that
            matters most. GrowthOS is designed to begin with those facts before it proposes tactics.
          </p>

          <div className="contact-expectations">
            <div>
              <strong>Goal</strong>
              <span>The outcome the system should optimize for.</span>
            </div>
            <div>
              <strong>Evidence</strong>
              <span>The systems and signals it needs to understand.</span>
            </div>
            <div>
              <strong>Guardrails</strong>
              <span>The budget, risk, and approval boundaries it must respect.</span>
            </div>
          </div>
        </div>

        <div className="contact-card">
          <h2>Tell us what you are trying to improve.</h2>
          <p>
            The form only reports success after the configured Website API confirms acceptance.
          </p>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
