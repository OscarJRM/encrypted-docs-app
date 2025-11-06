import type { ReactNode } from "react";

import { AppShell } from "@/app/components/layout/app-shell";

export default function UserLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
