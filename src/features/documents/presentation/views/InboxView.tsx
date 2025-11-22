"use client";

import {
  FileText,
  Inbox,
  MoreVertical,
  Reply,
  Eye,
  Search,
  Filter,
} from "lucide-react";
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
const inboxDocuments = [
  {
    id: "1",
    sender: "Ministerio de Educación",
    subject: "Solicitud de informe anual 2024",
    type: "oficio",
    date: "2024-05-20",
    status: "received",
  },
  {
    id: "2",
    sender: "Departamento de RRHH",
    subject: "Memorando circular sobre feriados",
    type: "memorando",
    date: "2024-05-19",
    status: "received",
  },
  {
    id: "3",
    sender: "Dirección Financiera",
    subject: "Aprobación de presupuesto Q3",
    type: "oficio",
    date: "2024-05-18",
    status: "read",
  },
];

export function InboxView() {
  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground flex items-center gap-2">
          <Inbox className="size-8" />
          Bandeja de Entrada
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Gestiona y responde a los documentos oficiales y memorandos recibidos.
        </p>
      </header>

      <Card className="border-border/70 bg-card/80">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="space-y-1">
            <CardTitle>Documentos Recibidos</CardTitle>
            <CardDescription>
              Listado de comunicaciones recientes.
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
                    Remitente
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Asunto
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Tipo
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
                {inboxDocuments.map((doc) => (
                  <tr
                    key={doc.id}
                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                  >
                    <td className="p-4 align-middle font-medium">
                      {doc.sender}
                    </td>
                    <td className="p-4 align-middle">{doc.subject}</td>
                    <td className="p-4 align-middle">
                      <Badge
                        variant={
                          doc.type === "oficio" ? "default" : "secondary"
                        }
                        className="capitalize"
                      >
                        {doc.type}
                      </Badge>
                    </td>
                    <td className="p-4 align-middle">{doc.date}</td>
                    <td className="p-4 align-middle text-right">
                      <div className="flex justify-end gap-2">
                        {doc.type === "oficio" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            title="Responder"
                          >
                            <Reply className="size-4" />
                            <span className="sr-only">Responder</span>
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          title="Ver PDF"
                        >
                          <Eye className="size-4" />
                          <span className="sr-only">Ver PDF</span>
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
