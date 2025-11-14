"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  FilePlus2,
  Users,
  Settings,
  ShieldCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useSession } from "next-auth/react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/app/components/ui/sidebar";
import { SignOutButton } from "@/features/auth/presentation/components/SignOutButton";
import { cn } from "@/app/lib/utils";

type Role = "admin" | "user";

type RoleHref = Partial<Record<Role, string>>;

type MatchStrategy = "exact" | "prefix";

type NavItem = {
  label: string;
  icon: LucideIcon;
  href: RoleHref;
  roles?: Role[];
  children?: NavChild[];
  matchStrategy?: MatchStrategy;
};

type NavChild = {
  label: string;
  href: RoleHref;
  roles?: Role[];
  matchStrategy?: MatchStrategy;
};

const roleLabels: Record<Role, string> = {
  admin: "Administrador",
  user: "Usuario",
};

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: { admin: "/admin", user: "/" },
    matchStrategy: "exact",
  },
  {
    label: "Documentos",
    icon: FileText,
    href: { admin: "/admin/documentos", user: "/documentos" },
    children: [
      {
        label: "En elaboración",
        href: { admin: "/admin/documentos/en-elaboracion", user: "/documentos/en-elaboracion" },
      },
      {
        label: "Enviados",
        href: { admin: "/admin/documentos/enviados", user: "/documentos/enviados" },
      },
      {
        label: "Recibidos",
        href: { admin: "/admin/documentos/recibidos", user: "/documentos/recibidos" },
      },
      {
        label: "No enviados",
        href: { admin: "/admin/documentos/no-enviados", user: "/documentos/no-enviados" },
      },
      {
        label: "Enviar documento",
        href: { admin: "/admin/documentos/enviar", user: "/documentos/enviar" },
      },
    ],
  },
  {
    label: "Crear documento",
    icon: FilePlus2,
    href: { admin: "/admin/documents/new", user: "/documentos/nuevo" },
  },
  {
    label: "Usuarios",
    icon: Users,
    href: { admin: "/admin/usuarios" },
    roles: ["admin"],
  },
  {
    label: "Configuración",
    icon: Settings,
    href: { admin: "/admin/configuracion", user: "/configuracion" },
  },
];

const DEFAULT_ROLE: Role = "user";

function resolveHref(href: RoleHref, role: Role) {
  return href[role] ?? href[DEFAULT_ROLE] ?? "#";
}

function hasAccess(allowedRoles: Role[] | undefined, role: Role) {
  if (!allowedRoles || allowedRoles.length === 0) {
    return true;
  }

  return allowedRoles.includes(role);
}

function isActivePath(
  pathname: string,
  candidate: string | undefined,
  matchStrategy: MatchStrategy = "prefix"
) {
  if (!candidate || candidate === "#") {
    return false;
  }

  const normalizedPath = pathname.replace(/\/+$/, "") || "/";
  const normalizedCandidate = candidate.replace(/\/+$/, "") || "/";

  if (normalizedCandidate === "/") {
    return normalizedPath === "/";
  }

  if (matchStrategy === "exact") {
    return normalizedPath === normalizedCandidate;
  }

  return (
    normalizedPath === normalizedCandidate ||
    normalizedPath.startsWith(`${normalizedCandidate}/`)
  );
}

export function AppSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const sessionRole = (session?.user as { role?: Role } | undefined)?.role;
  const role: Role = sessionRole === "admin" ? "admin" : "user";

  const displayName = session?.user?.name ?? "Invitado";

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 rounded-md px-2 py-1.5">
          <div className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-md font-semibold">
            8v
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-semibold">
              {displayName}
            </span>
            <span className="text-muted-foreground text-xs">
              {roleLabels[role]}
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menú principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems
                .filter((item) => hasAccess(item.roles, role))
                .map((item) => {
                  const href = resolveHref(item.href, role);
                  const hasChildren = Boolean(item.children?.length);
                  const itemIsActive =
                    isActivePath(
                      pathname,
                      href,
                      item.matchStrategy ?? "prefix"
                    ) ||
                    (item.children ?? []).some((child) =>
                      isActivePath(
                        pathname,
                        resolveHref(child.href, role),
                        child.matchStrategy ?? "prefix"
                      )
                    );

                  return (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton
                        asChild
                        isActive={itemIsActive && !hasChildren}
                        tooltip={item.label}
                      >
                        <Link href={href}>
                          <item.icon className="size-4" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>

                      {hasChildren ? (
                        <SidebarMenuSub>
                          {item.children
                            ?.filter((child) => hasAccess(child.roles, role))
                            .map((child) => {
                              const childHref = resolveHref(child.href, role);

                              return (
                                <SidebarMenuSubItem key={child.label}>
                                  <SidebarMenuSubButton
                                    asChild
                                    isActive={isActivePath(
                                      pathname,
                                      childHref,
                                      child.matchStrategy ?? "prefix"
                                    )}
                                  >
                                    <Link href={childHref}>{child.label}</Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              );
                            })}
                        </SidebarMenuSub>
                      ) : null}
                    </SidebarMenuItem>
                  );
                })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarGroupLabel>Seguridad</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={cn("justify-start gap-2", "text-left")}
            >
              <SignOutButton variant="ghost" className="gap-2 justify-start">
                <ShieldCheck className="size-4" />
                <span>Seguridad / Cerrar sesión</span>
              </SignOutButton>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
