"use client";

import { useRef, useState } from "react";
import {
  FileText,
  PenLine,
  ShieldCheck,
  Upload,
  UserPlus,
  Lock,
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
import {
  SelectableCard,
  type SelectableCardAccent,
} from "../components/SelectableCard";
import { RichTextEditor } from "../components/RichTextEditor";
import { useCreateDocument } from "../../hooks/useCreateDocument";
import { User } from "@/app/api/users.api";

type DocumentType = "oficio" | "memorando";
type Category = "normal" | "cifrado";

const documentTypeOptions: Array<{
  id: DocumentType;
  title: string;
  description: string;
  icon: LucideIcon;
  accent: SelectableCardAccent;
}> = [
  {
    id: "oficio",
    title: "Oficio",
    description: "Comunicados formales entre instituciones o entes externos.",
    icon: FileText,
    accent: "primary",
  },
  {
    id: "memorando",
    title: "Memorando",
    description: "Notas internas para equipos o áreas específicas.",
    icon: PenLine,
    accent: "info",
  },
];

const categoryOptions: Array<{
  id: Category;
  title: string;
  description: string;
  icon: LucideIcon;
  accent: SelectableCardAccent;
}> = [
  {
    id: "normal",
    title: "Normal",
    description: "Documento visible para los destinatarios sin cifrado.",
    icon: UserPlus,
    accent: "success",
  },
  {
    id: "cifrado",
    title: "Cifrado",
    description: "Protección avanzada con acceso restringido y seguimiento.",
    icon: ShieldCheck,
    accent: "secondary",
  },
];



export function NewDocumentView() {
  const { createAndSendDocument, loading, availableUsers } = useCreateDocument();
  const [documentType, setDocumentType] = useState<DocumentType>("oficio");
  const [category, setCategory] = useState<Category>("normal");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [pdfPassword, setPdfPassword] = useState("");
  
  // Recipient selection state
  const [selectedRecipients, setSelectedRecipients] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter users based on search term and exclude already selected ones
  const filteredUsers = availableUsers.filter((user) =>
    (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
    !selectedRecipients.find((s) => s.id === user.id)
  );

  const addRecipient = (user: User) => {
    setSelectedRecipients((prev) => [...prev, user]);
    setSearchTerm("");
    setShowSuggestions(false);
  };

  const removeRecipient = (userId: string) => {
    setSelectedRecipients((prev) => prev.filter((u) => u.id !== userId));
  };

  const onFilesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    setAttachments(Array.from(files));
  };

  const handleCreateDocument = async () => {
    if (!subject || !content) {
      alert("Por favor completa el asunto y el contenido.");
      return;
    }
    if (selectedRecipients.length === 0) {
      alert("Debes agregar al menos un destinatario.");
      return;
    }

    await createAndSendDocument(
      subject,
      content,
      category,
      documentType,
      selectedRecipients.map((u) => u.id),
      pdfPassword || undefined
    );
  };

  return (
    <section className="space-y-8">
      {/* ... (Header and Document Type/Category cards remain same) ... */}
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Crear documento
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Completa la información esencial para preparar, firmar y enviar tu
          documento oficial.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/70 bg-card/80">
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
                accent={option.accent}
              />
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/80">
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
                accent={option.accent}
              />
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/70 bg-card/80">
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
            <Label htmlFor="pdfPassword">Contraseña del PDF (Opcional)</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="pdfPassword"
                type="password"
                placeholder="Protege el documento con una contraseña"
                className="pl-9"
                value={pdfPassword}
                onChange={(event) => setPdfPassword(event.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Contenido del documento</Label>
            <RichTextEditor value={content} onChange={setContent} />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/70 bg-card/80">
        <CardHeader>
          <CardTitle>Destinatarios</CardTitle>
          <CardDescription>
            Busca y selecciona los usuarios que recibirán el documento.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative space-y-2">
            <Label htmlFor="recipient-search">Buscar usuario</Label>
            <div className="relative">
              <Input
                id="recipient-search"
                type="text"
                placeholder="Escribe nombre o correo..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
              />
              {showSuggestions && searchTerm && (
                <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover p-1 shadow-md">
                  {filteredUsers.length === 0 ? (
                    <p className="p-2 text-sm text-muted-foreground">No se encontraron usuarios.</p>
                  ) : (
                    filteredUsers.map((user) => (
                      <button
                        key={user.id}
                        type="button"
                        className="flex w-full flex-col items-start rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
                        onClick={() => addRecipient(user)}
                      >
                        <span className="font-medium">{user.name}</span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {selectedRecipients.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Aún no hay destinatarios seleccionados.
              </p>
            ) : (
              selectedRecipients.map((user) => (
                <span
                  key={user.id}
                  className="inline-flex items-center gap-2 rounded-full border border-[color:var(--palette-secondary)]/50 bg-[color:var(--palette-secondary)]/15 px-3 py-1 text-sm font-medium text-[color:var(--palette-secondary)]"
                >
                  {user.name}
                  <button
                    type="button"
                    onClick={() => removeRecipient(user.id)}
                    className="text-[color:var(--palette-secondary)]/80 transition hover:text-destructive"
                    aria-label={`Eliminar ${user.name}`}
                  >
                    ×
                  </button>
                </span>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/70 bg-card/80">
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
            className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-[color:var(--palette-info)]/60 bg-[color:var(--palette-info)]/5 px-6 py-10 text-center transition hover:border-[color:var(--palette-info)]"
            onClick={() => fileInputRef.current?.click()}
          >
            <span className="rounded-full bg-[color:var(--palette-info)]/15 p-3 text-[color:var(--palette-info)]">
              <Upload className="size-5" />
            </span>
            <div>
              <p className="font-medium">Selecciona o arrastra tus archivos</p>
              <p className="text-sm text-muted-foreground">
                Solo se permiten archivos PDF de hasta 10 MB.
              </p>
            </div>
            <Button
              variant="secondary"
              type="button"
              className="border-[color:var(--palette-info)]/60 bg-[color:var(--palette-info)]/20 text-[color:var(--palette-info)] hover:bg-[color:var(--palette-info)]/30"
            >
              Elegir archivos PDF
            </Button>
          </div>
          {attachments.length > 0 ? (
            <ul className="space-y-2 text-sm">
              {attachments.map((file) => (
                <li
                  key={`${file.name}-${file.size}`}
                  className="flex items-center justify-between rounded-lg border border-border/60 bg-background/40 px-3 py-2"
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

      <div className="space-y-3 rounded-2xl border border-border/70 bg-card/80 p-6 shadow-[var(--shadow-card)]">
        <div className="flex flex-col gap-3 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>
            El documento será firmado electrónicamente y se generará un código
            QR para validar su autenticidad antes del envío.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button variant="outline" disabled={loading}>Guardar borrador</Button>
            <Button onClick={handleCreateDocument} disabled={loading}>
              {loading ? "Enviando..." : "Firmar y enviar documento"}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
