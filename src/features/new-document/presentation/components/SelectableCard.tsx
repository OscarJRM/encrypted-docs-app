"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/app/lib/utils";

type SelectableCardProps = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  selected: boolean;
  onSelect: (id: string) => void;
};

export function SelectableCard({
  id,
  title,
  description,
  icon: Icon,
  selected,
  onSelect,
}: SelectableCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className={cn(
        "group relative flex min-h-[128px] flex-1 flex-col justify-between rounded-2xl border border-transparent p-4 text-left transition",
        "shadow-[var(--shadow-card)] hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
        "bg-[color:var(--palette-bg-light)]",
        selected ? "ring-2 ring-primary/60" : "ring-0 ring-transparent"
      )}
    >
      <div
        className={cn(
          "absolute right-4 top-4 flex size-9 items-center justify-center rounded-full border-2 transition",
          selected
            ? "border-primary bg-primary/20 text-primary"
            : "border-border/60 text-muted-foreground/80"
        )}
        aria-hidden
      >
        <span
          className={cn(
            "size-3 rounded-full transition",
            selected ? "bg-primary" : "bg-transparent"
          )}
        />
      </div>
      <div className="flex items-start gap-4">
        <span className="inline-flex size-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <Icon className="size-5" />
        </span>
        <div className="space-y-1 pr-8">
          <p className="text-base font-semibold tracking-tight">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </button>
  );
}
