"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { documentService } from "@/features/new-document/services/document.service";
import { usersApi, User } from "@/app/api/users.api";
import { useSession } from "next-auth/react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { SelectableCard, SelectableCardAccent } from "@/features/new-document/presentation/components/SelectableCard";
import { RichTextEditor } from "@/features/new-document/presentation/components/RichTextEditor";
import { 
  FileText, 
  PenLine, 
  ShieldCheck, 
  Upload, 
  UserPlus, 
  Lock 
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

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

interface EditDocumentViewProps {
  documentId: string;
}

export function EditDocumentView({ documentId }: EditDocumentViewProps) {
  const router = useRouter();
  const { data: session } = useSession();
  
  // Form State
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<Category>("normal");
  const [docType, setDocType] = useState<DocumentType>("oficio");
  const [pdfPassword, setPdfPassword] = useState("");
  
  // Recipients State
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecipients, setSelectedRecipients] = useState<User[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Attachments State
  const [newAttachments, setNewAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // UI State
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);

  // Fetch Data
  useEffect(() => {
    const init = async () => {
      if (!session?.user) return;
      setLoading(true);
      try {
        // 1. Fetch Users
        const users = await usersApi.getAll(session.user.accessToken);
        setAvailableUsers(users);

        // 2. Fetch Document
        const doc = await documentService.getById(documentId);
        console.log("Loaded Draft Document:", doc);
        if (doc) {
          setTitle(doc.title);
          setContent(doc.content);
          setCategory((doc.category?.toLowerCase() as Category) || "normal");
          setDocType((doc.doc_type?.toLowerCase() as DocumentType) || "oficio");
          
          // Try to populate existing recipients
          if (doc.recipients && Array.isArray(doc.recipients)) {
             // We need to map the recipients to User objects. 
             // Assuming doc.recipients contains objects with at least an id, and maybe user details.
             // If the API returns full user objects in recipients, great. If not, we might need to match with availableUsers.
             const existingRecipients: User[] = [];
             doc.recipients.forEach((r: any) => {
                // Check if 'r' is a user object or has a user property
                const userId = r.id || r.recipient_id || r.user_id;
                if (userId) {
                   const foundUser = users.find(u => u.id === userId);
                   if (foundUser) {
                      existingRecipients.push(foundUser);
                   } else if (r.name && r.email) {
                      // If we have name/email but not in availableUsers list (maybe inactive?), add it anyway
                      existingRecipients.push({ id: userId, name: r.name, email: r.email, role: 'user' });
                   }
                }
             });
             // Remove duplicates
             const uniqueRecipients = Array.from(new Map(existingRecipients.map(item => [item.id, item])).values());
             setSelectedRecipients(uniqueRecipients);
          }
        }
      } catch (error) {
        console.error("Error loading draft:", error);
        alert("Error al cargar el borrador.");
        router.push("/documents/drafts");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [documentId, session, router]);

  // Handlers
  const handleSave = async () => {
    if (!title || !content) {
      alert("Por favor completa el asunto y el contenido.");
      return;
    }

    setSaving(true);
    try {
      await documentService.update(documentId, {
        title,
        content,
        category,
        doc_type: docType,
        pdf_password: pdfPassword || undefined,
      });
      
      // Upload new attachments
      if (newAttachments.length > 0) {
        for (const file of newAttachments) {
          await documentService.addAttachment(documentId, file);
        }
        setNewAttachments([]); // Clear after upload
      }

      // Add new recipients
      if (selectedRecipients.length > 0) {
        for (const user of selectedRecipients) {
          try {
             await documentService.addRecipient(documentId, {
              recipientUserId: user.id,
              canWrite: false,
            });
          } catch (e) {
             console.warn("Recipient might already exist", e);
          }
        }
        setSelectedRecipients([]); // Clear after adding
      }

      alert("Borrador actualizado correctamente.");
    } catch (error) {
      console.error("Error saving draft:", error);
      alert("Error al guardar el borrador.");
    } finally {
      setSaving(false);
    }
  };

  const handleSend = async () => {
    if (!title || !content) {
      alert("Por favor completa el asunto y el contenido.");
      return;
    }

    if (selectedRecipients.length === 0) {
      alert("Debes agregar al menos un destinatario para enviar el documento.");
      return;
    }

    setSending(true);
    try {
      // First save everything
      await documentService.update(documentId, {
        title,
        content,
        category,
        doc_type: docType,
        pdf_password: pdfPassword || undefined,
      });

      // Upload new attachments
      if (newAttachments.length > 0) {
        for (const file of newAttachments) {
          await documentService.addAttachment(documentId, file);
        }
      }

      // Add new recipients
      if (selectedRecipients.length > 0) {
        for (const user of selectedRecipients) {
          try {
             await documentService.addRecipient(documentId, {
              recipientUserId: user.id,
              canWrite: false,
            });
          } catch (e) {
             console.warn("Recipient might already exist", e);
          }
        }
      }
      
      // Then send
      await documentService.send(documentId);
      
      alert("Documento enviado correctamente.");
      router.push("/documents/sent");
    } catch (error) {
      console.error("Error sending document:", error);
      alert("Error al enviar el documento.");
    } finally {
      setSending(false);
    }
  };

  const filteredUsers = availableUsers.filter(user => 
    (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())) &&
    !selectedRecipients.find(u => u.id === user.id)
  );

  const addRecipient = (user: User) => {
    setSelectedRecipients([...selectedRecipients, user]);
    setSearchQuery("");
    setShowSuggestions(false);
  };

  const removeRecipient = (userId: string) => {
    setSelectedRecipients(selectedRecipients.filter(u => u.id !== userId));
  };

  const onFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewAttachments([...newAttachments, ...Array.from(e.target.files)]);
    }
  };

  if (loading) {
     return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando borrador...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Editar Borrador
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Continúa editando tu documento antes de enviarlo.
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
                selected={docType === option.id}
                onSelect={(value) => setDocType(value as DocumentType)}
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
              value={title}
              onChange={(event) => setTitle(event.target.value)}
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
            Gestiona los usuarios que recibirán el documento.
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
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
              />
              {showSuggestions && searchQuery && (
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
                No hay destinatarios seleccionados.
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
            Carga anexos adicionales en formato PDF.
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
          {newAttachments.length > 0 ? (
            <ul className="space-y-2 text-sm">
              {newAttachments.map((file) => (
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
              No se han seleccionado archivos adjuntos nuevos.
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
            <Button variant="outline" onClick={handleSave} disabled={saving || sending}>
              {saving ? "Guardando..." : "Guardar cambios"}
            </Button>
            <Button onClick={handleSend} disabled={saving || sending}>
              {sending ? "Enviando..." : "Firmar y enviar documento"}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
