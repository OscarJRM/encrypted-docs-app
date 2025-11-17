"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileEdit,
  FileText,
  Inbox,
  Plus,
  Send,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/app/lib/utils";

type MetricCardDetail =
  | { type: "trend"; value: string; helper: string }
  | { type: "badge"; label: string }
  | { type: "text"; label: string };

type MetricCardConfig = {
  id: string;
  label: string;
  value: string;
  href?: string;
  accent: "primary" | "secondary" | "warning" | "info";
  icon: LucideIcon;
  detail?: MetricCardDetail;
};

type QuickStat = {
  id: string;
  label: string;
  value: string;
  helper: string;
  icon: LucideIcon;
  accent: "primary" | "success" | "info" | "secondary";
};

type RecentActivity = {
  id: number;
  type: "recibido" | "enviado";
  asunto: string;
  fecha: string;
  tipoDoc: string;
  remitente?: string;
  destinatario?: string;
  requiereRespuesta?: boolean;
  estado?: string;
};

const chartData = [
  { name: "Lun", enviados: 4, recibidos: 6 },
  { name: "Mar", enviados: 3, recibidos: 5 },
  { name: "Mié", enviados: 7, recibidos: 4 },
  { name: "Jue", enviados: 5, recibidos: 8 },
  { name: "Vie", enviados: 6, recibidos: 7 },
  { name: "Sáb", enviados: 2, recibidos: 3 },
  { name: "Dom", enviados: 1, recibidos: 2 },
];

const metricCards: MetricCardConfig[] = [
  {
    id: "sent",
    label: "Documentos enviados",
    value: "24",
    href: "/dashboard/enviados",
    accent: "primary",
    icon: Send,
    detail: { type: "trend", value: "+12%", helper: "vs mes anterior" },
  },
  {
    id: "received",
    label: "Documentos recibidos",
    value: "18",
    href: "/dashboard/recibidos",
    accent: "secondary",
    icon: Inbox,
    detail: { type: "badge", label: "5 sin leer" },
  },
  {
    id: "drafts",
    label: "Borradores",
    value: "7",
    href: "/dashboard/borradores",
    accent: "warning",
    icon: FileEdit,
    detail: { type: "text", label: "En elaboración" },
  },
  {
    id: "total",
    label: "Total documentos",
    value: "49",
    accent: "info",
    icon: FileText,
    detail: { type: "text", label: "32 Oficios · 17 Memorandos" },
  },
];

const quickStats: QuickStat[] = [
  {
    id: "response-rate",
    label: "Tasa de respuesta",
    value: "87%",
    helper: "De oficios respondidos",
    icon: TrendingUp,
    accent: "primary",
  },
  {
    id: "signed-docs",
    label: "Documentos firmados",
    value: "42",
    helper: "Con firma electrónica (QR)",
    icon: CheckCircle2,
    accent: "success",
  },
  {
    id: "avg-time",
    label: "Tiempo promedio",
    value: "2.4h",
    helper: "De respuesta a oficios",
    icon: Clock,
    accent: "info",
  },
  {
    id: "active-users",
    label: "Usuarios activos",
    value: "15",
    helper: "Destinatarios registrados",
    icon: Users,
    accent: "secondary",
  },
];

const recentActivity: RecentActivity[] = [
  {
    id: 1,
    type: "recibido",
    asunto: "Solicitud de Información Académica",
    remitente: "Dra. María González",
    fecha: "Hace 2 horas",
    tipoDoc: "Oficio",
    requiereRespuesta: true,
  },
  {
    id: 2,
    type: "enviado",
    asunto: "Memorando Interno - Reunión Departamental",
    destinatario: "Ing. Carlos Pérez",
    fecha: "Hace 5 horas",
    tipoDoc: "Memorando",
    estado: "Entregado",
  },
  {
    id: 3,
    type: "recibido",
    asunto: "Aprobación de Proyecto de Titulación",
    remitente: "Ing. Luis Morales",
    fecha: "Hace 1 día",
    tipoDoc: "Oficio",
    requiereRespuesta: true,
  },
];

const accentStyles: Record<
  MetricCardConfig["accent"],
  { border: string; icon: string }
> = {
  primary: {
    border: "hover:border-[color:var(--palette-primary)]",
    icon: "text-[color:var(--palette-primary)]",
  },
  secondary: {
    border: "hover:border-[color:var(--palette-secondary)]",
    icon: "text-[color:var(--palette-secondary)]",
  },
  warning: {
    border: "hover:border-[color:var(--palette-warning)]",
    icon: "text-[color:var(--palette-warning)]",
  },
  info: {
    border: "hover:border-[color:var(--palette-info)]",
    icon: "text-[color:var(--palette-info)]",
  },
};

const statAccent: Record<
  QuickStat["accent"],
  { container: string; icon: string }
> = {
  primary: {
    container: "bg-[color:var(--palette-primary)]/15",
    icon: "text-[color:var(--palette-primary)]",
  },
  success: {
    container: "bg-[color:var(--palette-success)]/15",
    icon: "text-[color:var(--palette-success)]",
  },
  info: {
    container: "bg-[color:var(--palette-info)]/15",
    icon: "text-[color:var(--palette-info)]",
  },
  secondary: {
    container: "bg-[color:var(--palette-secondary)]/15",
    icon: "text-[color:var(--palette-secondary)]",
  },
};

const activityMeta = {
  alertCount: 3,
  description: "Documentos pendientes de sincronización por fallos de conexión",
};

function MetricCardItem({ card }: { card: MetricCardConfig }) {
  const Icon = card.icon;
  const content = (
    <Card
      className={cn(
        "h-full bg-card/80 border-border/70 transition-all hover:-translate-y-0.5",
        accentStyles[card.accent].border
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {card.label}
        </CardTitle>
        <Icon className={cn("h-4 w-4", accentStyles[card.accent].icon)} />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold text-foreground">{card.value}</div>
        {card.detail?.type === "trend" && (
          <p className="mt-1 text-xs text-muted-foreground">
            <span className="font-semibold text-[color:var(--palette-success)]">
              {card.detail.value}
            </span>{" "}
            {card.detail.helper}
          </p>
        )}
        {card.detail?.type === "badge" && (
          <div className="mt-2">
            <Badge variant="secondary" className="text-[10px]">
              {card.detail.label}
            </Badge>
          </div>
        )}
        {card.detail?.type === "text" && (
          <p className="mt-1 text-xs text-muted-foreground">{card.detail.label}</p>
        )}
      </CardContent>
    </Card>
  );

  if (card.href) {
    return (
      <Link
        href={card.href}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        {content}
      </Link>
    );
  }

  return content;
}

export default function AdminPageFeature() {
  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Panel de control
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gestión de documentos - Universidad Técnica de Ambato
          </p>
        </div>
        <Button asChild size="lg" className="gap-2 px-5">
          <Link href="/dashboard/crear-documento">
            <Plus className="h-5 w-5" />
            Crear documento
          </Link>
        </Button>
      </div>

      <Card className="border-[color:var(--palette-danger)]/70 bg-[color:var(--palette-danger)]/8">
        <CardContent className="flex flex-col gap-4 pt-6 md:flex-row md:items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[color:var(--palette-danger)]/20">
            <AlertTriangle className="h-6 w-6 text-[color:var(--palette-danger)]" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-[color:var(--palette-danger)]">
              {activityMeta.alertCount} documentos no enviados
            </h3>
            <p className="text-sm text-muted-foreground">
              {activityMeta.description}
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            className="border-[color:var(--palette-danger)] text-[color:var(--palette-danger)] hover:bg-[color:var(--palette-danger)]/15"
          >
            <Link href="/dashboard/no-enviados">Sincronizar ahora</Link>
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metricCards.map((card) => (
          <MetricCardItem key={card.id} card={card} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-7">
        <Card className="bg-card/80 border-border/70 lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">
              Actividad semanal
            </CardTitle>
            <CardDescription>
              Comparación de documentos enviados vs recibidos
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorEnviados" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--palette-primary)" stopOpacity={0.7} />
                      <stop offset="95%" stopColor="var(--palette-primary)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorRecibidos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--palette-secondary)" stopOpacity={0.7} />
                      <stop offset="95%" stopColor="var(--palette-secondary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="4 4"
                    stroke="color-mix(in srgb, var(--palette-border) 70%, transparent)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "var(--palette-text-muted)", fontSize: 12 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "var(--palette-text-muted)", fontSize: 12 }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    cursor={{ stroke: "var(--palette-border)", strokeWidth: 1 }}
                    contentStyle={{
                      backgroundColor: "var(--palette-bg)",
                      border: "1px solid var(--palette-border)",
                      borderRadius: "12px",
                      color: "var(--palette-text)",
                    }}
                    labelStyle={{ color: "var(--palette-text-muted)" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="enviados"
                    stroke="var(--palette-primary)"
                    strokeWidth={2.4}
                    fillOpacity={1}
                    fill="url(#colorEnviados)"
                    name="Enviados"
                  />
                  <Area
                    type="monotone"
                    dataKey="recibidos"
                    stroke="var(--palette-secondary)"
                    strokeWidth={2.4}
                    fillOpacity={1}
                    fill="url(#colorRecibidos)"
                    name="Recibidos"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/80 border-border/70 lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">
              Estadísticas rápidas
            </CardTitle>
            <CardDescription>Resumen de la actividad del sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {quickStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.id}
                  className="flex items-center gap-4 rounded-2xl border border-border/60 bg-background/30 p-4"
                >
                  <div
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-xl",
                      statAccent[stat.accent].container
                    )}
                  >
                    <Icon
                      className={cn("h-6 w-6", statAccent[stat.accent].icon)}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-semibold text-foreground">
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground">{stat.helper}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/80 border-border/70">
        <CardHeader>
          <CardTitle className="text-lg text-foreground">
            Actividad reciente
          </CardTitle>
          <CardDescription>Últimos documentos enviados y recibidos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentActivity.map((activity) => {
            const isReceived = activity.type === "recibido";
            return (
              <div
                key={activity.id}
                className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-background/30 p-4 transition-colors hover:border-border hover:bg-card/70 lg:flex-row lg:items-center"
              >
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-xl",
                    isReceived
                      ? "bg-[color:var(--palette-secondary)]/15 text-[color:var(--palette-secondary)]"
                      : "bg-[color:var(--palette-primary)]/15 text-[color:var(--palette-primary)]"
                  )}
                >
                  {isReceived ? (
                    <Inbox className="h-5 w-5" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-foreground">{activity.asunto}</p>
                    <Badge variant="outline" className="normal-case tracking-normal">
                      {activity.tipoDoc}
                    </Badge>
                    {activity.requiereRespuesta && (
                      <Badge variant="secondary" className="normal-case tracking-normal">
                        Requiere respuesta
                      </Badge>
                    )}
                    {activity.estado && (
                      <Badge variant="success" className="normal-case tracking-normal">
                        {activity.estado}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {isReceived
                      ? `De: ${activity.remitente ?? "Desconocido"}`
                      : `Para: ${activity.destinatario ?? "Desconocido"}`}
                  </p>
                  <p className="text-xs text-muted-foreground">{activity.fecha}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-border/70 text-muted-foreground hover:text-foreground"
                >
                  Ver documento
                </Button>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </section>
  );
}
