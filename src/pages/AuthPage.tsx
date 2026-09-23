import { ArrowRight, BrainCircuit, CheckCircle2, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "../components/Ui";

export default function AuthPage({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="auth-shell">
      <section className="auth-story">
        <div className="auth-brand">
          <span><Sparkles size={18} /></span>
          <strong>GrowthOS</strong>
        </div>
        <div className="auth-story-copy">
          <span className="eyebrow">SELF-LEARNING MARKETING OS</span>
          <h1>Your marketing team, transformed into an AI-operated growth system.</h1>
          <p>
            Set the business goal. GrowthOS continuously decides, executes, measures, learns and corrects—
            while keeping consequential actions behind human approval.
          </p>
          <div className="auth-proof">
            <div><CheckCircle2 size={16} /><span>Cross-channel AI CMO and specialist agents</span></div>
            <div><CheckCircle2 size={16} /><span>Revenue intelligence and causal measurement</span></div>
            <div><CheckCircle2 size={16} /><span>Approval gates, audit receipts and rollback controls</span></div>
          </div>
        </div>
        <div className="auth-loop">
          {["Goal", "Decide", "Execute", "Measure", "Learn", "Correct"].map((step, index) => (
            <div key={step}><span>{String(index + 1).padStart(2, "0")}</span><strong>{step}</strong></div>
          ))}
        </div>
      </section>

      <section className="auth-form-side">
        <div className="auth-form-card">
          <div className="auth-security"><ShieldCheck size={17} /><span>Secure workspace access</span></div>
          <h2>Sign in to GrowthOS</h2>
          <p>Continue to your autonomous marketing command center.</p>

          <label className="auth-label">
            Work email
            <input type="email" placeholder="name@company.com" />
          </label>
          <label className="auth-label">
            Password
            <div className="password-wrap"><LockKeyhole size={15} /><input type="password" placeholder="Enter your password" /></div>
          </label>

          <div className="auth-options">
            <label><input type="checkbox" defaultChecked /> Remember this device</label>
            <button type="button">Forgot password?</button>
          </div>

          <Button onClick={onEnter}>Open frontend preview <ArrowRight size={16} /></Button>

          <div className="auth-divider"><span>or</span></div>
          <button className="sso-button" type="button"><BrainCircuit size={17} /> Continue with enterprise SSO</button>

          <small className="auth-note">
            Frontend preview only. Authentication, session issuance, MFA and SSO enforcement will be connected to the backend identity service.
          </small>
        </div>
      </section>
    </div>
  );
}
