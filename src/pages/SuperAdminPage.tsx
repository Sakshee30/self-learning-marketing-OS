import { ShieldCheck } from "lucide-react";
import { PageHeader } from "../components/Ui";

export default function SuperAdminPage() {
  return (
    <>
      <PageHeader
        eyebrow="SEPARATE TRUST BOUNDARY"
        title="Platform Control is a separate application"
        description="Privileged tenant, infrastructure, security, release and operational controls are intentionally excluded from the customer application. Use the dedicated platform-control build instead."
      />
      <article className="panel p-5">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 text-violet-700" size={20} />
          <div>
            <strong className="text-sm text-growth-ink">Customer sessions do not grant platform-control authority.</strong>
            <p className="mb-0 mt-2 text-sm text-growth-muted">
              This compatibility entry point contains no privileged tenant data, infrastructure actions or platform secrets.
            </p>
          </div>
        </div>
      </article>
    </>
  );
}
