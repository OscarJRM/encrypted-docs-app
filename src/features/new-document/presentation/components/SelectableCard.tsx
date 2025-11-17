"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/app/lib/utils";

const accentStyles = {
  primary: {
    icon: "bg-[color:var(--palette-primary)]/15 text-[color:var(--palette-primary)]",
    hover: "hover:border-[color:var(--palette-primary)]/70",
    ring: "ring-[color:var(--palette-primary)]/60",
    indicatorBorder: "border-[color:var(--palette-primary)]/80",
    indicatorDot: "bg-[color:var(--palette-primary)]",
  },
  secondary: {
    icon: "bg-[color:var(--palette-secondary)]/15 text-[color:var(--palette-secondary)]",
    hover: "hover:border-[color:var(--palette-secondary)]/70",
    ring: "ring-[color:var(--palette-secondary)]/60",
    indicatorBorder: "border-[color:var(--palette-secondary)]/80",
    indicatorDot: "bg-[color:var(--palette-secondary)]",
  },
  info: {
    icon: "bg-[color:var(--palette-info)]/15 text-[color:var(--palette-info)]",
    hover: "hover:border-[color:var(--palette-info)]/70",
    ring: "ring-[color:var(--palette-info)]/60",
    indicatorBorder: "border-[color:var(--palette-info)]/80",
    indicatorDot: "bg-[color:var(--palette-info)]",
  },
  warning: {
    icon: "bg-[color:var(--palette-warning)]/15 text-[color:var(--palette-warning)]",
    hover: "hover:border-[color:var(--palette-warning)]/70",
    ring: "ring-[color:var(--palette-warning)]/60",
    indicatorBorder: "border-[color:var(--palette-warning)]/80",
    indicatorDot: "bg-[color:var(--palette-warning)]",
  },
  success: {
    icon: "bg-[color:var(--palette-success)]/15 text-[color:var(--palette-success)]",
    hover: "hover:border-[color:var(--palette-success)]/70",
    ring: "ring-[color:var(--palette-success)]/60",
    indicatorBorder: "border-[color:var(--palette-success)]/80",
    indicatorDot: "bg-[color:var(--palette-success)]",
  },
};

export type SelectableCardAccent = keyof typeof accentStyles;

type SelectableCardProps = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  selected: boolean;
  onSelect: (id: string) => void;
  accent?: SelectableCardAccent;
};

export function SelectableCard({
  id,
  title,
  description,
  icon: Icon,
  selected,
  onSelect,
  accent = "primary",
}: SelectableCardProps) {
  const accentClasses = accentStyles[accent] ?? accentStyles.primary;

  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className={cn(
        "group relative flex min-h-[128px] flex-1 flex-col justify-between rounded-2xl border border-border/60 bg-card/70 p-4 text-left transition",
        "shadow-[var(--shadow-card)] hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
        accentClasses.hover,
        selected ? accentClasses.ring : "ring-0 ring-transparent"
      )}
    >
      <div
        className={cn(
          "absolute right-4 top-4 flex size-9 items-center justify-center rounded-full border-2 bg-background/80 transition",
          selected
            ? accentClasses.indicatorBorder
            : "border-border/60 text-muted-foreground/80"
        )}
        aria-hidden
      >
        <span
          className={cn(
            "size-3 rounded-full transition",
            selected ? accentClasses.indicatorDot : "bg-transparent"
          )}
        />
      </div>
      <div className="flex items-start gap-4">
        <span
          className={cn(
            "inline-flex size-12 items-center justify-center rounded-xl transition",
            accentClasses.icon
          )}
        >
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
