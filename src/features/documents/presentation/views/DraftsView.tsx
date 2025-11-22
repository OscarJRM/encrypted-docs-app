"use client";

import { FilePenLine, Pencil, Trash2, Search, Filter } from "lucide-react";
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
const draftDocuments = [
  {
    id: "d1",
    subject: "Propuesta de nueva normativa de seguridad",
    type: "oficio",
    lastModified: "2024-05-22 10:30 AM",
    progress: "80%",
  },
  {
    id: "d2",
    subject: "Memo interno sobre vacaciones",
    type: "memorando",
    lastModified: "2024-05-21 16:45 PM",
    progress: "45%",
  },
  {
    id: "d3",
    subject: "Respuesta a solicitud ciudadana #12345",
    type: "oficio",
    lastModified: "2024-05-20 09:15 AM",
    progress: "20%",
  },
];

export function DraftsView() {
  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground flex items-center gap-2">
          <FilePenLine className="size-8" />
          Borradores
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Continúa editando tus documentos pendientes antes de firmarlos y
          enviarlos.
        </p>
      </header>

      <Card className="border-border/70 bg-card/80">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="space-y-1">
            <CardTitle>Documentos en Elaboración</CardTitle>
            <CardDescription>
              Tus documentos se guardan automáticamente mientras trabajas.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar borrador..."
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
                    Asunto
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Tipo
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Última Modificación
                  </th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {draftDocuments.map((doc) => (
                  <tr
                    key={doc.id}
                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                  >
                    <td className="p-4 align-middle font-medium">
                      {doc.subject || "(Sin asunto)"}
                    </td>
                    <td className="p-4 align-middle">
                      <Badge
                        variant="outline"
                        className={
                          doc.type === "oficio"
                            ? "border-blue-500 text-blue-500"
                            : "border-orange-500 text-orange-500"
                        }
                      >
                        {doc.type}
                      </Badge>
                    </td>
                    <td className="p-4 align-middle text-muted-foreground">
                      {doc.lastModified}
                    </td>
                    <td className="p-4 align-middle text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="default"
                          size="sm"
                          className="h-8 gap-2"
                        >
                          <Pencil className="size-3.5" />
                          Editar
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive/90"
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
