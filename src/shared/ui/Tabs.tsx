import type { KeyboardEvent } from "react";

export type TabItem<TValue extends string = string> = {
  value: TValue;
  label: string;
};

export function Tabs<TValue extends string>({
  items,
  value,
  onValueChange,
  label
}: {
  items: readonly TabItem<TValue>[];
  value: TValue;
  onValueChange: (value: TValue) => void;
  label: string;
}) {
  function moveFocus(event: KeyboardEvent<HTMLButtonElement>, nextIndex: number) {
    const buttons = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    buttons?.[nextIndex]?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;

    if (event.key === "ArrowRight") next = (index + 1) % items.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + items.length) % items.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = items.length - 1;
    else return;

    event.preventDefault();
    const target = items[next];
    if (!target) return;
    onValueChange(target.value);
    moveFocus(event, next);
  }

  return (
    <div className="module-tabs" role="tablist" aria-label={label}>
      {items.map((item, index) => {
        const selected = item.value === value;

        return (
          <button
            key={item.value}
            type="button"
            id={`tab-${item.value}`}
            role="tab"
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            className={selected ? "active" : ""}
            onClick={() => onValueChange(item.value)}
            onKeyDown={(event) => onKeyDown(event, index)}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
