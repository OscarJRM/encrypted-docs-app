"use client";

import { Send, Eye, Search, Filter } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";

// Mock Data
const sentDocuments = [
  {
    id: "101",
    recipient: "Contraloría General",
    subject: "Respuesta a auditoría interna",
    date: "2024-05-21",
    referenceNumber: "OF-2024-001",
    status: "sent",
  },
  {
    id: "102",
    recipient: "Equipo de Desarrollo",
    subject: "Asignación de recursos proyecto X",
    date: "2024-05-20",
    referenceNumber: "MEM-2024-045",
    status: "sent",
  },
  {
    id: "103",
    recipient: "Proveedor de Servicios TI",
    subject: "Renovación de contrato",
    date: "2024-05-15",
    referenceNumber: "OF-2024-002",
    status: "sent",
  },
];

export function SentView() {
  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground flex items-center gap-2">
          <Send className="size-8" />
          Documentos Enviados
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Historial de documentos oficiales y memorandos enviados exitosamente.
        </p>
      </header>

      <Card className="border-border/70 bg-card/80">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="space-y-1">
            <CardTitle>Historial de Salida</CardTitle>
            <CardDescription>
              Todos los documentos cuentan con firma electrónica.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar..."
                className="w-[200px] pl-9 lg:w-[300px]"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="size-4" />
            </Button>
          </div>
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
                    No. Referencia
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Fecha
                  </th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {sentDocuments.map((doc) => (
                  <tr
                    key={doc.id}
                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                  >
                    <td className="p-4 align-middle font-medium">
                      {doc.recipient}
                    </td>
                    <td className="p-4 align-middle">{doc.subject}</td>
                    <td className="p-4 align-middle font-mono text-xs">
                      {doc.referenceNumber}
                    </td>
                    <td className="p-4 align-middle">{doc.date}</td>
                    <td className="p-4 align-middle text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-2"
                        title="Ver PDF"
                      >
                        <Eye className="size-4" />
                        <span className="hidden sm:inline">Ver PDF</span>
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
