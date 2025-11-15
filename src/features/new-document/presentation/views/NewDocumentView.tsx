"use client";

import { useRef, useState } from "react";
import {
  FileText,
  PenLine,
  ShieldCheck,
  Upload,
  UserPlus,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { SelectableCard } from "../components/SelectableCard";
import { RichTextEditor } from "../components/RichTextEditor";

type DocumentType = "oficio" | "memorando";
type Category = "normal" | "cifrado";

const documentTypeOptions: Array<{
  id: DocumentType;
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    id: "oficio",
    title: "Oficio",
    description: "Comunicados formales entre instituciones o entes externos.",
    icon: FileText,
  },
  {
    id: "memorando",
    title: "Memorando",
    description: "Notas internas para equipos o áreas específicas.",
    icon: PenLine,
  },
];

const categoryOptions: Array<{
  id: Category;
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    id: "normal",
    title: "Normal",
    description: "Documento visible para los destinatarios sin cifrado.",
    icon: UserPlus,
  },
  {
    id: "cifrado",
    title: "Cifrado",
    description: "Protección avanzada con acceso restringido y seguimiento.",
    icon: ShieldCheck,
  },
];

export function NewDocumentView() {
  const [documentType, setDocumentType] = useState<DocumentType>("oficio");
  const [category, setCategory] = useState<Category>("normal");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [recipientInput, setRecipientInput] = useState("");
  const [recipients, setRecipients] = useState<string[]>([]);
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addRecipient = () => {
    const value = recipientInput.trim();
    if (!value) return;
    if (recipients.includes(value)) {
      setRecipientInput("");
      return;
    }
    setRecipients((prev) => [...prev, value]);
    setRecipientInput("");
  };

  const removeRecipient = (email: string) => {
    setRecipients((prev) => prev.filter((item) => item !== email));
  };

  const onFilesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    setAttachments(Array.from(files));
  };

  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Crear documento
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Completa la información esencial para preparar, firmar y enviar tu
          documento oficial.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-transparent">
          <CardHeader>
            <CardTitle>Tipo de documento</CardTitle>
            <CardDescription>
              Selecciona la estructura que mejor se adapte a tu comunicación.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {documentTypeOptions.map((option) => (
              <SelectableCard
                key={option.id}
                id={option.id}
                title={option.title}
                description={option.description}
                icon={option.icon}
                selected={documentType === option.id}
                onSelect={(value) => setDocumentType(value as DocumentType)}
              />
            ))}
          </CardContent>
        </Card>

        <Card className="border-transparent">
          <CardHeader>
            <CardTitle>Categoría</CardTitle>
            <CardDescription>
              Define el nivel de seguridad y visibilidad del documento.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {categoryOptions.map((option) => (
              <SelectableCard
                key={option.id}
                id={option.id}
                title={option.title}
                description={option.description}
                icon={option.icon}
                selected={category === option.id}
                onSelect={(value) => setCategory(value as Category)}
              />
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-transparent">
        <CardHeader>
          <CardTitle>Información del documento</CardTitle>
          <CardDescription>
            Describe el objetivo y el contenido que será firmado y enviado.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="subject">Asunto</Label>
            <Input
              id="subject"
              placeholder="Ej. Solicitud de información complementaria"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Contenido del documento</Label>
            <RichTextEditor value={content} onChange={setContent} />
          </div>
        </CardContent>
      </Card>

      <Card className="border-transparent">
        <CardHeader>
          <CardTitle>Destinatarios</CardTitle>
          <CardDescription>
            Agrega los correos institucionales que recibirán el documento.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="flex-1 space-y-2">
              <Label htmlFor="recipient">Correo institucional</Label>
              <Input
                id="recipient"
                type="email"
                placeholder="Ej. direccion@institucion.gob"
                value={recipientInput}
                onChange={(event) => setRecipientInput(event.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button
                type="button"
                className="w-full md:w-auto"
                onClick={addRecipient}
              >
                <UserPlus className="size-4" />
                Agregar
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {recipients.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Aún no hay destinatarios agregados.
              </p>
            ) : (
              recipients.map((email) => (
                <span
                  key={email}
                  className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-3 py-1 text-sm text-foreground"
                >
                  {email}
                  <button
                    type="button"
                    onClick={() => removeRecipient(email)}
                    className="text-muted-foreground transition hover:text-destructive"
                    aria-label={`Eliminar ${email}`}
                  >
                    ×
                  </button>
                </span>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-transparent">
        <CardHeader>
          <CardTitle>Archivos adjuntos</CardTitle>
          <CardDescription>
            Carga anexos en formato PDF para respaldar la solicitud.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={onFilesChange}
            multiple
          />
          <div
            className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border/70 px-6 py-10 text-center"
            onClick={() => fileInputRef.current?.click()}
          >
            <span className="rounded-full bg-primary/10 p-3 text-primary">
              <Upload className="size-5" />
            </span>
            <div>
              <p className="font-medium">Selecciona o arrastra tus archivos</p>
              <p className="text-sm text-muted-foreground">
                Solo se permiten archivos PDF de hasta 10 MB.
              </p>
            </div>
            <Button variant="secondary" type="button">
              Elegir archivos PDF
            </Button>
          </div>
          {attachments.length > 0 ? (
            <ul className="space-y-2 text-sm">
              {attachments.map((file) => (
                <li
                  key={`${file.name}-${file.size}`}
                  className="flex items-center justify-between rounded-lg border border-border/70 px-3 py-2"
                >
                  <span className="truncate font-medium">{file.name}</span>
                  <span className="text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              No se han seleccionado archivos adjuntos.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="space-y-3 rounded-2xl border bg-muted/20 p-6">
        <div className="flex flex-col gap-3 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>
            El documento será firmado electrónicamente y se generará un código
            QR para validar su autenticidad antes del envío.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button variant="outline">Guardar borrador</Button>
            <Button>Firmar y enviar documento</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
