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
    category: "normal",
    read: true,
  },
  {
    id: "2",
    sender: "Departamento de RRHH",
    subject: "Memorando circular sobre feriados",
    type: "memorando",
    date: "2024-05-19",
    category: "normal",
    read: false,
  },
  {
    id: "3",
    sender: "Dirección Financiera",
    subject: "Aprobación de presupuesto Q3",
    type: "oficio",
    date: "2024-05-18",
    category: "cifrado",
    read: true,
  },
];

export function InboxView() {
  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-lg bg-[color:var(--palette-info)]/10">
            <Inbox className="size-6 text-[color:var(--palette-info)]" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Documentos Recibidos
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Gestiona y responde a los documentos oficiales y memorandos recibidos.
            </p>
          </div>
        </div>
      </header>

      <Card className="border-border/70 bg-card/80">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="space-y-1">
            <CardTitle>Listado de Documentos</CardTitle>
            <CardDescription>
              Total: {inboxDocuments.length} documentos ({inboxDocuments.filter(d => !d.read).length} sin leer)
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
                    Estado
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Tipo
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Asunto
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Remitente
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Categoría
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
                    className={`border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted ${!doc.read ? "bg-muted/30" : ""}`}
                  >
                    <td className="p-4 align-middle">
                      {!doc.read && (
                        <div className="size-2.5 rounded-full bg-[color:var(--palette-primary)]" title="No leído" />
                      )}
                    </td>
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
                    <td className={`p-4 align-middle ${!doc.read ? "font-semibold" : ""}`}>
                      {doc.subject}
                    </td>
                    <td className="p-4 align-middle text-muted-foreground">
                      {doc.sender}
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
                    <td className="p-4 align-middle text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 gap-1 text-[color:var(--palette-primary)] hover:text-[color:var(--palette-primary)]"
                          title="Ver PDF"
                        >
                          <Eye className="size-4" />
                          Ver
                        </Button>
                        {doc.type === "oficio" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 gap-1 text-[color:var(--palette-secondary)] hover:text-[color:var(--palette-secondary)]"
                            title="Responder"
                          >
                            <Reply className="size-4" />
                            Responder
                          </Button>
                        )}
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
