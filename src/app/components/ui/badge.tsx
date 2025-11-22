import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/app/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary/15 text-[color:var(--palette-primary)]",
        secondary:
          "border-transparent bg-secondary/20 text-[color:var(--palette-secondary)]",
        success:
          "border-transparent bg-[color:var(--palette-success)]/20 text-[color:var(--palette-success)]",
        warning:
          "border-transparent bg-[color:var(--palette-warning)]/20 text-[color:var(--palette-warning)]",
        info: "border-transparent bg-[color:var(--palette-info)]/20 text-[color:var(--palette-info)]",
        outline: "border-input text-muted-foreground",
        muted: "border-transparent bg-muted/60 text-muted-foreground",
        destructive:
          "border-transparent bg-[color:var(--palette-danger)]/15 text-[color:var(--palette-danger)] hover:bg-[color:var(--palette-danger)]/25",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="badge"
        className={cn(badgeVariants({ variant, className }))}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";

export { Badge, badgeVariants };
