"use client";

import { AlertTriangle, RefreshCw, WifiOff, Trash2 } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";

import { Badge } from "@/app/components/ui/badge";

// Mock Data
const unsentDocuments = [
  {
    id: "u1",
    recipient: "Ministerio de Salud",
    subject: "Reporte de incidencias sanitarias",
    type: "oficio",
    category: "normal",
    date: "2024-05-22 11:00 AM",
    error: "Error de conexión: Tiempo de espera agotado",
  },
  {
    id: "u2",
    recipient: "Dirección General",
    subject: "Solicitud de vacaciones",
    type: "memorando",
    category: "cifrado",
    date: "2024-05-22 10:45 AM",
    error: "Error del servidor: 500 Internal Server Error",
  },
];

export function UnsentView() {
  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-lg bg-[color:var(--palette-danger)]/10">
            <WifiOff className="size-6 text-[color:var(--palette-danger)]" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Documentos No Enviados
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Documentos que no pudieron enviarse debido a problemas de conexión o
              errores del sistema.
            </p>
          </div>
        </div>
      </header>

      {unsentDocuments.length > 0 && (
        <Card className="border-[color:var(--palette-danger)]/70 bg-[color:var(--palette-danger)]/8">
          <CardContent className="flex flex-col gap-4 pt-6 md:flex-row md:items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[color:var(--palette-danger)]/20">
              <AlertTriangle className="h-6 w-6 text-[color:var(--palette-danger)]" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-[color:var(--palette-danger)]">
                Atención requerida
              </h3>
              <p className="text-sm text-muted-foreground">
                Tienes {unsentDocuments.length} documentos pendientes de sincronización.
                Verifica tu conexión a internet y vuelve a intentarlo.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-border/70 bg-card/80">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="space-y-1">
            <CardTitle>Cola de Reintentos</CardTitle>
            <CardDescription>
              Estos documentos están guardados localmente y seguros.
            </CardDescription>
          </div>
          <Button size="sm" className="gap-2 bg-[color:var(--palette-success)] hover:bg-[color:var(--palette-success)]/90 text-[color:var(--palette-bg-dark)]">
            <RefreshCw className="size-4" />
            Sincronizar Todo
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Tipo
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Destinatario
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Asunto
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Categoría
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Fecha Intento
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Error
                  </th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {unsentDocuments.map((doc) => (
                  <tr
                    key={doc.id}
                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                  >
                    <td className="p-4 align-middle">
                      <Badge
                        variant="outline"
                        className={`capitalize ${
                          doc.type === "oficio"
                            ? "border-[color:var(--palette-info)] text-[color:var(--palette-info)]"
                            : "border-[color:var(--palette-warning)] text-[color:var(--palette-warning)]"
                        }`}
                      >
                        {doc.type}
                      </Badge>
                    </td>
                    <td className="p-4 align-middle font-medium">
                      {doc.recipient}
                    </td>
                    <td className="p-4 align-middle">{doc.subject}</td>
                    <td className="p-4 align-middle">
                      <Badge
                        variant={doc.category === "cifrado" ? "destructive" : "success"}
                        className="capitalize"
                      >
                        {doc.category}
                      </Badge>
                    </td>
                    <td className="p-4 align-middle">{doc.date}</td>
                    <td className="p-4 align-middle text-[color:var(--palette-danger)] text-xs font-medium">
                      {doc.error}
                    </td>
                    <td className="p-4 align-middle text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 gap-2 text-[color:var(--palette-success)] hover:text-[color:var(--palette-success)] hover:bg-[color:var(--palette-success)]/10"
                        >
                          <RefreshCw className="size-3.5" />
                          Reintentar
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-[color:var(--palette-danger)] hover:text-[color:var(--palette-danger)] hover:bg-[color:var(--palette-danger)]/10"
                          title="Eliminar"
                        >
                          <Trash2 className="size-4" />
                          <span className="sr-only">Eliminar</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
