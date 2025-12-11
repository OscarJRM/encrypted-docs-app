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


import { useDocuments } from "../../hooks/useDocuments";
import Link from "next/link";

export function InboxView() {
  const { documents, loading, error } = useDocuments('inbox');

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando documentos...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-lg bg-[color:var(--palette-secondary)]/10">
            <Inbox className="size-6 text-[color:var(--palette-secondary)]" />
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
              Total: {documents.length} documentos
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
                {documents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-muted-foreground">
                      No hay documentos recibidos.
                    </td>
                  </tr>
                ) : (
                  documents.map((doc) => (
                    <tr
                      key={doc.id}
                      className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                    >
                      <td className="p-4 align-middle">
                        <Badge
                          variant="outline"
                          className={`capitalize ${
                            doc.doc_type === "Oficio"
                              ? "border-[color:var(--palette-info)] text-[color:var(--palette-info)]"
                              : "border-[color:var(--palette-warning)] text-[color:var(--palette-warning)]"
                          }`}
                        >
                          {doc.doc_type || 'Documento'}
                        </Badge>
                      </td>
                      <td className="p-4 align-middle font-medium">
                        {doc.title}
                      </td>
                      <td className="p-4 align-middle text-muted-foreground">
                        {doc.sender?.name || doc.sender?.email || 'Desconocido'}
                      </td>
                      <td className="p-4 align-middle">
                        <Badge
                          variant={doc.category === "Confidencial" ? "destructive" : "secondary"}
                          className="capitalize"
                        >
                          {doc.category || 'General'}
                        </Badge>
                      </td>
                      <td className="p-4 align-middle text-muted-foreground">
                        {new Date(doc.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4 align-middle text-right">
                        <div className="flex justify-end gap-1">
                          <Link href={`/documents/${doc.id}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 gap-1 text-[color:var(--palette-primary)] hover:text-[color:var(--palette-primary)]"
                              title="Ver PDF"
                            >
                              <Eye className="size-4" />
                              Ver
                            </Button>
                          </Link>
                          <Link href={`/documents/${doc.id}/reply`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 gap-1 text-[color:var(--palette-secondary)] hover:text-[color:var(--palette-secondary)]"
                              title="Responder"
                            >
                              <Reply className="size-4" />
                              Responder
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
