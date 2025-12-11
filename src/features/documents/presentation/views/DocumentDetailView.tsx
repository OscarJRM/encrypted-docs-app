"use client";

import { useEffect, useState } from "react";
import { documentService, Document } from "@/features/new-document/services/document.service";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { ArrowLeft, Download, Reply } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface DocumentDetailViewProps {
  documentId: string;
}

export function DocumentDetailView({ documentId }: DocumentDetailViewProps) {
  const router = useRouter();
  const [document, setDocument] = useState<Document | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setLoading(true);
        // 1. Fetch metadata
        const docData = await documentService.getById(documentId);
        setDocument(docData);

        // 2. Fetch PDF content
        const blob = await documentService.download(documentId);
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      } catch (err) {
        console.error("Error fetching document:", err);
        setError("No se pudo cargar el documento.");
      } finally {
        setLoading(false);
      }
    };

    if (documentId) {
      fetchDocument();
    }

    // Cleanup blob URL
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [documentId]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando documento...</p>
        </div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4">
        <p className="text-destructive">{error || "Documento no encontrado"}</p>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 size-4" />
          Volver
        </Button>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="size-4" />
          Volver
        </Button>
        <div className="flex gap-2">
          {document.doc_type === "oficio" && (
            <Link href={`/documents/${documentId}/reply`}>
              <Button className="gap-2">
                <Reply className="size-4" />
                Responder
              </Button>
            </Link>
          )}
          {pdfUrl && (
            <a href={pdfUrl} download={`${document.title}.pdf`}>
              <Button variant="outline" className="gap-2">
                <Download className="size-4" />
                Descargar PDF
              </Button>
            </a>
          )}
        </div>
      </div>

      <Card className="border-border/70 bg-card/80">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl">{document.title}</CardTitle>
              <CardDescription>
                {new Date(document.created_at).toLocaleDateString()} • {new Date(document.created_at).toLocaleTimeString()}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="capitalize">
                {document.doc_type}
              </Badge>
              <Badge
                variant={document.category === "Confidencial" ? "destructive" : "secondary"}
                className="capitalize"
              >
                {document.category || "General"}
              </Badge>
              <Badge variant="success" className="capitalize">
                {document.status}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Remitente</h4>
              <p className="text-sm">
                {document.sender?.name || document.sender?.email || "Desconocido"}
              </p>
            </div>
            {/* Add more metadata fields if needed */}
          </div>
        </CardContent>
      </Card>

      <Card className="h-[800px] border-border/70 bg-card/80 overflow-hidden">
        <CardContent className="h-full p-0">
          {pdfUrl ? (
            <iframe
              src={pdfUrl}
              className="h-full w-full border-0"
              title="Visor de PDF"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No se pudo cargar la vista previa del PDF.
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
