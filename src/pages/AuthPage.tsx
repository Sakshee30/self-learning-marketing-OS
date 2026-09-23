import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, BrainCircuit, CheckCircle2, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "../components/Ui";
import { useZodForm } from "../shared/forms/useZodForm";
import {
  forgotPasswordSchema,
  signInSchema,
  signUpSchema,
  type ForgotPasswordInput,
  type SignInInput,
  type SignUpInput
} from "../features/auth/schemas/auth.schema";
import { useAuthStore } from "../features/auth/store/authStore";

type AuthMode = "sign-in" | "sign-up" | "forgot-password";

function FieldError({ message }: { message?: string }) {
  return message ? <span className="mt-1 block text-xs font-semibold text-red-600">{message}</span> : null;
}

export default function AuthPage({ mode = "sign-in" }: { mode?: AuthMode }) {
  const navigate = useNavigate();
  const signInPreview = useAuthStore((state) => state.signInPreview);
  const signUpPreview = useAuthStore((state) => state.signUpPreview);
  const [resetSent, setResetSent] = useState(false);

  const signInForm = useZodForm<SignInInput>(signInSchema, {
    defaultValues: { email: "", password: "", remember: true }
  });
  const signUpForm = useZodForm<SignUpInput>(signUpSchema, {
    defaultValues: { fullName: "", email: "", password: "", acceptTerms: false }
  });
  const forgotForm = useZodForm<ForgotPasswordInput>(forgotPasswordSchema, {
    defaultValues: { email: "" }
  });

  const enterWorkspace = () => navigate("/launchpad", { replace: true });
  const enterOnboarding = () => navigate("/onboarding", { replace: true });

  const onSignIn = signInForm.handleSubmit((values) => {
    signInPreview(values);
    enterWorkspace();
  });

  const onSignUp = signUpForm.handleSubmit((values) => {
    signUpPreview(values);
    enterOnboarding();
  });

  const onForgot = forgotForm.handleSubmit(() => {
    setResetSent(true);
  });

  const previewSso = () => {
    signInPreview({
      email: "sso.preview@growthos.local",
      password: "preview-only",
      remember: true
    });
    enterWorkspace();
  };

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

          {mode === "sign-in" && (
            <>
              <h2>Sign in to GrowthOS</h2>
              <p>Continue to your autonomous marketing command center.</p>
              <form onSubmit={onSignIn}>
                <label className="auth-label">
                  Work email
                  <input type="email" placeholder="name@company.com" {...signInForm.register("email")} />
                  <FieldError message={signInForm.formState.errors.email?.message} />
                </label>
                <label className="auth-label">
                  Password
                  <div className="password-wrap">
                    <LockKeyhole size={15} />
                    <input type="password" placeholder="Enter your password" {...signInForm.register("password")} />
                  </div>
                  <FieldError message={signInForm.formState.errors.password?.message} />
                </label>
                <div className="auth-options">
                  <label><input type="checkbox" {...signInForm.register("remember")} /> Remember this device</label>
                  <Link to="/auth/forgot-password">Forgot password?</Link>
                </div>
                <Button type="submit">Open workspace <ArrowRight size={16} /></Button>
              </form>

              <div className="auth-divider"><span>or</span></div>
              <button className="sso-button" type="button" onClick={previewSso}>
                <BrainCircuit size={17} /> Continue with enterprise SSO
              </button>

              <p className="mt-4 text-center text-xs">
                New to GrowthOS? <Link className="font-bold text-violet-700" to="/auth/sign-up">Create an account</Link>
              </p>
            </>
          )}

          {mode === "sign-up" && (
            <>
              <h2>Create your GrowthOS account</h2>
              <p>Start with an owner account. Workspace and organization setup comes next.</p>
              <form onSubmit={onSignUp}>
                <label className="auth-label">
                  Full name
                  <input placeholder="Your name" {...signUpForm.register("fullName")} />
                  <FieldError message={signUpForm.formState.errors.fullName?.message} />
                </label>
                <label className="auth-label">
                  Work email
                  <input type="email" placeholder="name@company.com" {...signUpForm.register("email")} />
                  <FieldError message={signUpForm.formState.errors.email?.message} />
                </label>
                <label className="auth-label">
                  Password
                  <div className="password-wrap">
                    <LockKeyhole size={15} />
                    <input type="password" placeholder="Use at least 10 characters" {...signUpForm.register("password")} />
                  </div>
                  <FieldError message={signUpForm.formState.errors.password?.message} />
                </label>
                <div className="auth-options">
                  <label><input type="checkbox" {...signUpForm.register("acceptTerms")} /> I accept the platform terms</label>
                </div>
                <FieldError message={signUpForm.formState.errors.acceptTerms?.message} />
                <Button type="submit">Create account <ArrowRight size={16} /></Button>
              </form>
              <p className="mt-4 text-center text-xs">
                Already have an account? <Link className="font-bold text-violet-700" to="/auth/sign-in">Sign in</Link>
              </p>
            </>
          )}

          {mode === "forgot-password" && (
            <>
              <h2>Reset your password</h2>
              <p>Enter your work email. The backend identity service will send the secure reset flow.</p>
              {resetSent ? (
                <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-xs text-emerald-800">
                  Reset request accepted in frontend preview. Email delivery will be connected with backend identity.
                </div>
              ) : (
                <form onSubmit={onForgot}>
                  <label className="auth-label">
                    Work email
                    <input type="email" placeholder="name@company.com" {...forgotForm.register("email")} />
                    <FieldError message={forgotForm.formState.errors.email?.message} />
                  </label>
                  <Button type="submit">Request reset link <ArrowRight size={16} /></Button>
                </form>
              )}
              <p className="mt-4 text-center text-xs">
                <Link className="font-bold text-violet-700" to="/auth/sign-in">Back to sign in</Link>
              </p>
            </>
          )}

          <small className="auth-note">
            Frontend-first identity contract. Session issuance, MFA, SSO enforcement, password reset delivery and token rotation remain backend responsibilities.
          </small>
        </div>
      </section>
    </div>
  );
}
