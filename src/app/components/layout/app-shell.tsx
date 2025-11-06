"use client";

import type { ReactNode } from "react";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/app/components/ui/sidebar";
import { Separator } from "@/app/components/ui/separator";
import { AppSidebar } from "@/app/components/navigation/app-sidebar";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <SidebarProvider>
      <div className="bg-background flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset>
          <header className="flex flex-col border-b">
            <div className="flex items-center gap-2 px-4 py-3">
              <SidebarTrigger />
              <span className="text-sm font-medium text-muted-foreground">
                Menú
              </span>
            </div>
            <Separator />
          </header>
          <div className="flex-1 overflow-auto px-4 py-6 md:px-6 lg:px-8">
            {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
