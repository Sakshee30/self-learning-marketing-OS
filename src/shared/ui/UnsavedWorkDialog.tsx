import * as Dialog from "@radix-ui/react-dialog";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "./Button";

export function UnsavedWorkDialog({
  open,
  items,
  onCancel,
  onDiscard
}: {
  open: boolean;
  items: Array<{ id: string; label: string }>;
  onCancel: () => void;
  onDiscard: () => void;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && onCancel()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[110] bg-slate-950/35 backdrop-blur-sm" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-[120] w-[min(520px,calc(100vw-28px))] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-growth-line bg-white p-5 shadow-2xl"
          aria-describedby="unsaved-work-description"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-700">
                <AlertTriangle size={20} />
              </span>
              <div>
                <Dialog.Title className="m-0 text-lg font-semibold text-growth-ink">
                  Leave with unsaved work?
                </Dialog.Title>
                <Dialog.Description id="unsaved-work-description" className="mt-1 text-sm text-growth-muted">
                  This workspace has local changes that are not durably confirmed. Leaving may discard those edits.
                </Dialog.Description>
              </div>
            </div>
            <Dialog.Close className="icon-button" aria-label="Close">
              <X size={18} />
            </Dialog.Close>
          </div>

          {items.length > 0 && (
            <ul className="mt-4 grid gap-2 rounded-xl border border-amber-100 bg-amber-50/70 p-3">
              {items.map((item) => (
                <li key={item.id} className="text-xs font-medium text-amber-950">
                  {item.label}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-5 flex flex-wrap justify-end gap-2">
            <Button variant="secondary" onClick={onCancel}>Keep editing</Button>
            <Button variant="danger" onClick={onDiscard}>Discard and continue</Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
