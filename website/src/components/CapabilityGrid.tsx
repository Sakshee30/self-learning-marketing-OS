import Link from "next/link";
import { capabilityGroups } from "@/src/content/product";

export function CapabilityGrid({ compact = false }: { compact?: boolean }) {
  const groups = compact ? capabilityGroups.slice(0, 4) : capabilityGroups;

  return (
    <div className="capability-grid">
      {groups.map((group, index) => (
        <article className="capability-card" key={group.eyebrow}>
          <div className="capability-number">{String(index + 1).padStart(2, "0")}</div>
          <span className="eyebrow">{group.eyebrow}</span>
          <h3>{group.title}</h3>
          <p>{group.description}</p>
          <div className="tag-list" aria-label={`${group.eyebrow} capabilities`}>
            {group.items.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </article>
      ))}

      {compact && (
        <article className="capability-card capability-link-card">
          <span className="eyebrow">Govern & operate</span>
          <h3>Autonomy only works when control is designed in.</h3>
          <p>
            Human approvals, governance, audit, roles, integrations, usage, and workspace controls
            define the operating boundary around AI execution.
          </p>
          <Link href="/product" className="text-link">
            Explore the complete product surface <span aria-hidden="true">→</span>
          </Link>
        </article>
      )}
    </div>
  );
}
