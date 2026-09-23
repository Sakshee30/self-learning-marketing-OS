import { useEffect, useMemo, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowRight, Command, Search, Sparkles, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { NavItem } from "../../../types";

export function AiCommandPalette({
  open,
  onOpenChange,
  items
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: NavItem[];
}) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setAiAnswer(null);
    }
  }, [open]);

  const matches = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return items.slice(0, 8);
    return items.filter((item) =>
      [item.label, item.section, item.path].some((field) => field.toLowerCase().includes(value))
    ).slice(0, 8);
  }, [items, query]);

  function openItem(path: string) {
    navigate(path);
    onOpenChange(false);
  }

  function askAi() {
    const value = query.trim();
    if (!value) return;
    setAiAnswer(
      "Frontend preview: I would route this question through the AI CMO with workspace context, World Model evidence, revenue data, policies and decision memory. Real model reasoning is intentionally deferred until the governed backend model gateway is connected."
    );
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[90] bg-slate-950/30 backdrop-blur-sm" />
        <Dialog.Content
          className="fixed left-1/2 top-[16%] z-[100] w-[min(720px,calc(100vw-28px))] -translate-x-1/2 overflow-hidden rounded-2xl border border-growth-line bg-white shadow-2xl"
          aria-describedby="growthos-command-description"
        >
          <div className="flex items-start justify-between gap-4 border-b border-growth-line px-5 py-4">
            <div>
              <Dialog.Title className="m-0 text-lg font-semibold text-growth-ink">GrowthOS Command</Dialog.Title>
              <Dialog.Description id="growthos-command-description" className="m-0 mt-1 text-xs text-growth-muted">
                Navigate the workspace or ask the AI CMO what to investigate next.
              </Dialog.Description>
            </div>
            <Dialog.Close className="icon-button" aria-label="Close command palette"><X size={18} /></Dialog.Close>
          </div>

          <div className="relative border-b border-growth-line">
            <Search className="absolute left-5 top-4 text-slate-400" size={18} />
            <input
              autoFocus
              className="h-12 w-full border-0 bg-white px-12 text-sm outline-none"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setAiAnswer(null);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" && matches[0] && !event.shiftKey) {
                  event.preventDefault();
                  openItem(matches[0].path);
                }
              }}
              placeholder="Search campaigns, revenue, approvals… or ask a question"
            />
            <kbd className="absolute right-4 top-3.5 border border-growth-line bg-slate-50 text-slate-500">ESC</kbd>
          </div>

          <div className="max-h-[420px] overflow-y-auto p-3">
            <div className="px-2 py-2 text-[11px] font-bold uppercase tracking-[.1em] text-slate-400">
              Workspace navigation
            </div>
            <div className="grid gap-1">
              {matches.map((item) => (
                <button
                  type="button"
                  key={item.path}
                  onClick={() => openItem(item.path)}
                  className="flex min-h-11 items-center justify-between gap-3 rounded-lg px-3 text-left hover:bg-slate-50"
                >
                  <span>
                    <strong className="block text-sm text-growth-ink">{item.label}</strong>
                    <span className="mt-0.5 block text-xs text-growth-muted">{item.section}</span>
                  </span>
                  <ArrowRight size={15} className="text-slate-400" />
                </button>
              ))}
            </div>

            {query.trim() && (
              <div className="mt-3 border-t border-growth-line pt-3">
                <button
                  type="button"
                  onClick={askAi}
                  className="flex w-full items-start gap-3 rounded-xl bg-violet-50 p-4 text-left hover:bg-violet-100"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-violet-600 text-white">
                    <Sparkles size={17} />
                  </span>
                  <span>
                    <strong className="block text-sm text-violet-950">Ask AI CMO</strong>
                    <span className="mt-1 block text-xs leading-5 text-violet-800">{query}</span>
                  </span>
                </button>
              </div>
            )}

            {aiAnswer && (
              <div className="mt-3 rounded-xl border border-violet-200 bg-white p-4">
                <div className="flex items-center gap-2">
                  <Command size={16} className="text-violet-700" />
                  <strong className="text-xs text-violet-900">AI CMO preview</strong>
                </div>
                <p className="mb-0 mt-2 text-xs leading-5 text-growth-muted">{aiAnswer}</p>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-growth-line bg-slate-50 px-5 py-3 text-[11px] text-slate-500">
            <span>Enter opens the top matching workspace item</span>
            <span>AI execution is not simulated as completed work</span>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
