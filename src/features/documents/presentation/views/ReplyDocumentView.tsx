"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { documentService, Document } from "@/features/new-document/services/document.service";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { RichTextEditor } from "@/features/new-document/presentation/components/RichTextEditor";
import { ArrowLeft, Send } from "lucide-react";

interface ReplyDocumentViewProps {
  originalDocId: string;
}

export function ReplyDocumentView({ originalDocId }: ReplyDocumentViewProps) {
  const router = useRouter();
  const [originalDoc, setOriginalDoc] = useState<Document | null>(null);
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOriginalDoc = async () => {
      try {
        setLoading(true);
        const doc = await documentService.getById(originalDocId);
        setOriginalDoc(doc);
        setSubject(`Re: ${doc.title}`);
      } catch (err) {
        console.error("Error fetching original document:", err);
        setError("No se pudo cargar el documento original.");
      } finally {
        setLoading(false);
      }
    };

    if (originalDocId) {
      fetchOriginalDoc();
    }
  }, [originalDocId]);

  const handleReply = async () => {
    if (!subject || !content) {
      alert("Por favor completa el asunto y el contenido.");
      return;
    }

    try {
      setSending(true);
      await documentService.reply(originalDocId, {
        title: subject,
        content: content,
        // Category and doc_type might be inherited or set to defaults
        category: originalDoc?.category || "normal",
        doc_type: "oficio", // Replies are typically Oficios
      });
      
      alert("Respuesta enviada correctamente.");
      router.push("/documents/sent");
    } catch (err) {
      console.error("Error sending reply:", err);
      alert("Error al enviar la respuesta.");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando información...</p>
        </div>
      </div>
    );
  }

  if (error || !originalDoc) {
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
          Cancelar
        </Button>
      </div>

      <Card className="border-border/70 bg-card/80">
        <CardHeader>
          <CardTitle>Responder Documento</CardTitle>
          <CardDescription>
            Respondiendo a: <strong>{originalDoc.title}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="subject">Asunto</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Contenido de la respuesta</Label>
            <RichTextEditor value={content} onChange={setContent} />
          </div>

          <div className="flex justify-end">
            <Button onClick={handleReply} disabled={sending} className="gap-2">
              <Send className="size-4" />
              {sending ? "Enviando..." : "Enviar Respuesta"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
