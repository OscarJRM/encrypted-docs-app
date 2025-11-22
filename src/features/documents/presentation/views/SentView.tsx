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
import { Badge } from "@/app/components/ui/badge";

// Mock Data
const sentDocuments = [
  {
    id: "101",
    recipient: "Contraloría General",
    subject: "Respuesta a auditoría interna",
    type: "oficio",
    date: "2024-05-21",
    referenceNumber: "OF-2024-001",
    category: "normal",
    status: "Entregado",
  },
  {
    id: "102",
    recipient: "Equipo de Desarrollo",
    subject: "Asignación de recursos proyecto X",
    type: "memorando",
    date: "2024-05-20",
    referenceNumber: "MEM-2024-045",
    category: "normal",
    status: "Entregado",
  },
  {
    id: "103",
    recipient: "Proveedor de Servicios TI",
    subject: "Renovación de contrato",
    type: "oficio",
    date: "2024-05-15",
    referenceNumber: "OF-2024-002",
    category: "cifrado",
    status: "Entregado",
  },
];

export function SentView() {
  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-lg bg-[color:var(--palette-success)]/10">
            <Send className="size-6 text-[color:var(--palette-success)]" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Documentos Enviados
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Historial de documentos oficiales y memorandos enviados exitosamente.
            </p>
          </div>
        </div>
      </header>

      <Card className="border-border/70 bg-card/80">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="space-y-1">
            <CardTitle>Historial de Salida</CardTitle>
            <CardDescription>
              Total: {sentDocuments.length} documentos enviados
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
                    Fecha
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Estado
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
                    <td className="p-4 align-middle">
                      <div className="flex flex-col">
                        <span>{doc.subject}</span>
                        <span className="text-xs text-muted-foreground font-mono">{doc.referenceNumber}</span>
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <Badge
                        variant={doc.category === "cifrado" ? "destructive" : "success"}
                        className="capitalize"
                      >
                        {doc.category}
                      </Badge>
                    </td>
                    <td className="p-4 align-middle text-muted-foreground">
                      {doc.date}
                    </td>
                    <td className="p-4 align-middle">
                      <Badge variant="success" className="capitalize">
                        {doc.status}
                      </Badge>
                    </td>
                    <td className="p-4 align-middle text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-2 text-[color:var(--palette-primary)] hover:text-[color:var(--palette-primary)]"
                        title="Ver PDF"
                      >
                        <Eye className="size-4" />
                        <span className="hidden sm:inline">Ver</span>
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
