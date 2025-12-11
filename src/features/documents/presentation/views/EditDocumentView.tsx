"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { documentService, Document } from "@/features/new-document/services/document.service";
import { usersApi, User } from "@/app/api/users.api";
import { useSession } from "next-auth/react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { SelectableCard } from "@/features/new-document/presentation/components/SelectableCard";
import { RichTextEditor } from "@/features/new-document/presentation/components/RichTextEditor";
import { Badge } from "@/app/components/ui/badge";
import { FileText, Shield, Lock, Send, Save, X, Search, Paperclip, Trash2 } from "lucide-react";

interface EditDocumentViewProps {
  documentId: string;
}

export function EditDocumentView({ documentId }: EditDocumentViewProps) {
  const router = useRouter();
  const { data: session } = useSession();
  
  // Form State
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("normal");
  const [docType, setDocType] = useState("oficio");
  const [pdfPassword, setPdfPassword] = useState("");
  
  // Recipients State
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecipients, setSelectedRecipients] = useState<User[]>([]);
  
  // Attachments State (Note: API might not support removing existing attachments easily, so we focus on adding new ones)
  const [newAttachments, setNewAttachments] = useState<File[]>([]);

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
        if (doc) {
          setTitle(doc.title);
          setContent(doc.content);
          setCategory(doc.category?.toLowerCase() || "normal");
          setDocType(doc.doc_type?.toLowerCase() || "oficio");
          // Note: We can't retrieve the PDF password or existing recipients easily in a way to populate the form exactly as 'new' 
          // unless the API provides them. For drafts, we assume we can add *more* recipients.
          // If the API returns recipients, we could map them back to selectedRecipients if we have their IDs.
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

      alert("Borrador guardado correctamente.");
    } catch (error) {
      console.error("Error saving draft:", error);
      alert("Error al guardar el borrador.");
    } finally {
      setSaving(false);
    }
  };

  const handleSend = async () => {
    setSending(true);
    try {
      // First save everything
      await handleSave();
      
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
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5);

  const addRecipient = (user: User) => {
    if (!selectedRecipients.find(u => u.id === user.id)) {
      setSelectedRecipients([...selectedRecipients, user]);
    }
    setSearchQuery("");
  };

  const removeRecipient = (userId: string) => {
    setSelectedRecipients(selectedRecipients.filter(u => u.id !== userId));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewAttachments([...newAttachments, ...Array.from(e.target.files)]);
    }
  };

  const removeAttachment = (index: number) => {
    setNewAttachments(newAttachments.filter((_, i) => i !== index));
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
    <section className="space-y-8 max-w-5xl mx-auto pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Editar Borrador</h1>
          <p className="text-muted-foreground">Continúa editando tu documento.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.back()}>Cancelar</Button>
          <Button variant="secondary" onClick={handleSave} disabled={saving || sending}>
            <Save className="mr-2 size-4" />
            {saving ? "Guardando..." : "Guardar"}
          </Button>
          <Button onClick={handleSend} disabled={saving || sending}>
            <Send className="mr-2 size-4" />
            {sending ? "Enviando..." : "Enviar"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Left Column: Settings */}
        <div className="space-y-6 lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Configuración</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Tipo de Documento</Label>
                <div className="grid grid-cols-2 gap-2">
                  <SelectableCard
                    title="Oficio"
                    icon={FileText}
                    selected={docType === "oficio"}
                    onClick={() => setDocType("oficio")}
                  />
                  <SelectableCard
                    title="Memorando"
                    icon={FileText}
                    selected={docType === "memorando"}
                    onClick={() => setDocType("memorando")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Categoría</Label>
                <div className="grid grid-cols-2 gap-2">
                  <SelectableCard
                    title="Normal"
                    icon={Shield}
                    selected={category === "normal"}
                    onClick={() => setCategory("normal")}
                  />
                  <SelectableCard
                    title="Confidencial"
                    icon={Lock}
                    selected={category === "cifrado"}
                    onClick={() => setCategory("cifrado")}
                  />
                </div>
              </div>

               {category === "cifrado" && (
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña del PDF</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Contraseña para abrir el PDF"
                    value={pdfPassword}
                    onChange={(e) => setPdfPassword(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Esta contraseña será requerida para visualizar el PDF generado.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Destinatarios Adicionales</CardTitle>
              <CardDescription>Agrega más destinatarios a este borrador.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="relative">
                <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar usuario..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {searchQuery && (
                <div className="border rounded-md divide-y max-h-40 overflow-y-auto">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map(user => (
                      <button
                        key={user.id}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors"
                        onClick={() => addRecipient(user)}
                      >
                        <div className="font-medium">{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </button>
                    ))
                  ) : (
                    <div className="p-3 text-sm text-muted-foreground text-center">
                      No se encontraron usuarios.
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {selectedRecipients.map(user => (
                  <Badge key={user.id} variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
                    {user.name}
                    <button onClick={() => removeRecipient(user.id)} className="hover:bg-muted-foreground/20 rounded-full p-0.5">
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
          
           <Card>
            <CardHeader>
              <CardTitle>Adjuntos Nuevos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="files">Subir archivos</Label>
                <Input id="files" type="file" multiple onChange={handleFileChange} />
              </div>
              <div className="space-y-2">
                {newAttachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded-md text-sm">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <Paperclip className="size-4 flex-shrink-0" />
                      <span className="truncate">{file.name}</span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeAttachment(index)}>
                      <X className="size-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Content */}
        <div className="space-y-6 lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Contenido del Documento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Asunto / Título</Label>
                <Input
                  id="title"
                  placeholder="Ej: Solicitud de vacaciones"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Cuerpo del documento</Label>
                <div className="min-h-[400px] border rounded-md">
                  <RichTextEditor value={content} onChange={setContent} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
