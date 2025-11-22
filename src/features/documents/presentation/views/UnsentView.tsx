"use client";

import { AlertTriangle, RefreshCw, WifiOff } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert"; // Assuming Alert exists, otherwise I'll build it
import { Badge } from "@/app/components/ui/badge";

// Mock Data
const unsentDocuments = [
  {
    id: "u1",
    recipient: "Ministerio de Salud",
    subject: "Reporte de incidencias sanitarias",
    date: "2024-05-22 11:00 AM",
    error: "Error de conexión: Tiempo de espera agotado",
  },
  {
    id: "u2",
    recipient: "Dirección General",
    subject: "Solicitud de vacaciones",
    date: "2024-05-22 10:45 AM",
    error: "Error del servidor: 500 Internal Server Error",
  },
];

export function UnsentView() {
  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground flex items-center gap-2 text-destructive">
          <WifiOff className="size-8" />
          No Enviados
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Documentos que no pudieron enviarse debido a problemas de conexión o
          errores del sistema.
        </p>
      </header>

      <Alert variant="destructive" className="bg-destructive/10 text-destructive border-destructive/50">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Atención requerida</AlertTitle>
        <AlertDescription>
          Tienes {unsentDocuments.length} documentos pendientes de sincronización.
          Verifica tu conexión a internet y vuelve a intentarlo.
        </AlertDescription>
      </Alert>

      <Card className="border-border/70 bg-card/80">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="space-y-1">
            <CardTitle>Cola de Reintentos</CardTitle>
            <CardDescription>
              Estos documentos están guardados localmente y seguros.
            </CardDescription>
          </div>
          <Button size="sm" className="gap-2">
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
                    Destinatario
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Asunto
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
                    <td className="p-4 align-middle font-medium">
                      {doc.recipient}
                    </td>
                    <td className="p-4 align-middle">{doc.subject}</td>
                    <td className="p-4 align-middle">{doc.date}</td>
                    <td className="p-4 align-middle text-destructive text-xs font-medium">
                      {doc.error}
                    </td>
                    <td className="p-4 align-middle text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 gap-2 border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      >
                        <RefreshCw className="size-3.5" />
                        Reintentar
                      </Button>
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
