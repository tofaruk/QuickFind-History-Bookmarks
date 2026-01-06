import { useEffect, useMemo, useRef, useState } from "react";
import type { TimeRange } from "../../domain/types/filter";

type TimeRangeSelectProps = {
  value: TimeRange;
  onChange: (value: TimeRange) => void;
};

function labelFor(tr: TimeRange): string {
  if (tr.kind === "today") return "Today";
  if (tr.kind === "thisWeek") return "This week";
  return `Past ${tr.weeks} week${tr.weeks === 1 ? "" : "s"}`;
}

function useClickOutside(
  refs: Array<React.RefObject<HTMLElement | null>>,
  onOutside: () => void,
  enabled: boolean
) {
  useEffect(() => {
    if (!enabled) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      const inside = refs.some((r) => r.current && r.current.contains(target));
      if (!inside) onOutside();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [refs, onOutside, enabled]);
}

export function TimeRangeSelect({ value, onChange }: TimeRangeSelectProps) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useClickOutside([buttonRef, panelRef], () => setOpen(false), open);

  const options = useMemo<TimeRange[]>(() => {
    const past = Array.from(
      { length: 8 },
      (_, i) => ({ kind: "pastWeeks", weeks: i + 1 } as const)
    );
    return [{ kind: "today" }, { kind: "thisWeek" }, ...past];
  }, []);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        className="inline-flex w-full items-center justify-between gap-2 rounded-xl border border-gray-200 bg-white dark:bg-gray-800 dark:hover:bg-gray-900 px-3 py-2 text-sm shadow-sm hover:bg-gray-50 dark:hover:text-gray-900"
        onClick={() => setOpen((v) => !v)}
        title="Time range"
      >
        <span className="min-w-0 truncate">
          <span className="text-gray-500 dark:text-gray-200 dark:hover:text-gray-300 ">
            Range{" "}
          </span>
          <span className="font-medium text-gray-900  dark:text-gray-50 dark:hover:text-white">
            {labelFor(value)}
          </span>
        </span>
        <span className="text-gray-500">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div
          ref={panelRef}
          className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-2xl border border-gray-200 bg-white dark:bg-gray-800 shadow-lg"
        >
          <div className="max-h-60 overflow-auto p-2">
            {options.map((opt) => {
              const active = labelFor(opt) === labelFor(value);
              return (
                <button
                  key={labelFor(opt)}
                  type="button"
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                  }}
                  className={[
                    "flex w-full items-center justify-between rounded-xl px-2 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-900",
                    active ? "bg-gray-50 dark:bg-gray-900" : "",
                  ].join(" ")}
                >
                  <span className="font-medium text-gray-900 dark:text-gray-50">
                    {labelFor(opt)}
                  </span>
                  {active && (
                    <span className="text-xs text-gray-500 dark:text-gray-100">Selected</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
