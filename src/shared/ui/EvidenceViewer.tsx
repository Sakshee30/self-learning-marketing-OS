import { FileSearch } from "lucide-react";
import { Panel } from "./Panel";

export type EvidenceItem = {
  id: string;
  label: string;
  source: string;
  detail: string;
  confidence?: number;
};

export function EvidenceViewer({
  title = "Evidence",
  items
}: {
  title?: string;
  items: EvidenceItem[];
}) {
  return (
    <Panel className="p-4 shadow-none">
      <div className="mb-3 flex items-center gap-2">
        <FileSearch className="text-violet-700" size={17} />
        <strong className="text-sm">{title}</strong>
      </div>
      <div className="grid gap-2">
        {items.map((item) => (
          <article key={item.id} className="rounded-lg border border-growth-line bg-white p-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <strong className="block text-xs text-growth-ink">{item.label}</strong>
                <span className="type-caption text-growth-muted">{item.source}</span>
              </div>
              {typeof item.confidence === "number" && (
                <span className="type-caption font-semibold text-emerald-700">{item.confidence}% confidence</span>
              )}
            </div>
            <p className="mb-0 mt-2 text-xs leading-5 text-growth-muted">{item.detail}</p>
          </article>
        ))}
      </div>
    </Panel>
  );
}
