import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { documentService } from "../services/document.service";
import { usersApi, User } from "@/app/api/users.api";

export function useCreateDocument() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  
  // State to track the current document being edited
  const [currentDocumentId, setCurrentDocumentId] = useState<string | null>(null);
  const [savedRecipients, setSavedRecipients] = useState<Set<string>>(new Set());
  const [uploadedAttachments, setUploadedAttachments] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (session?.user) {
      fetchUsers();
    }
  }, [session]);

  const fetchUsers = async () => {
    try {
      const token = session?.user?.accessToken;
      const data = await usersApi.getAll(token);
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const saveDraft = async (
    title: string,
    content: string,
    category: string,
    docType: string,
    recipients: string[], // user IDs
    attachments: File[],
    pdfPassword?: string
  ) => {
    setLoading(true);
    try {
      console.log("Starting save draft flow...");
      
      let documentId = currentDocumentId;

      // 1. Create or Update Document
      if (!documentId) {
        console.log("Creating new document draft...");
        const docData = await documentService.create({
          title,
          content,
          category,
          doc_type: docType,
          pdf_password: pdfPassword,
        });
        documentId = docData.id;
        setCurrentDocumentId(documentId);
        console.log("Document created with ID:", documentId);
      } else {
        console.log(`Updating existing document ${documentId}...`);
        // TODO: Implement update if needed, for now we assume create is enough for the first step
        // or we might need an update endpoint if the user changes title/content after first save.
        // For this iteration, let's assume we are just ensuring it exists.
        // If we had an update endpoint: await documentService.update(documentId, { ... });
      }

      if (!documentId) throw new Error("Failed to get document ID");

      // 2. Add Attachments (only new ones)
      if (attachments.length > 0) {
        console.log(`Checking ${attachments.length} attachments...`);
        for (const file of attachments) {
          // Simple check by name/size to avoid re-uploading in this session
          // ideally backend handles deduplication or we track IDs.
          const fileKey = `${file.name}-${file.size}`;
          if (!uploadedAttachments.has(fileKey)) {
            console.log(`Uploading attachment: ${file.name}`);
            try {
              await documentService.addAttachment(documentId, file);
              setUploadedAttachments(prev => new Set(prev).add(fileKey));
              console.log(`Attachment ${file.name} uploaded successfully.`);
            } catch (attError) {
              console.error(`Failed to upload attachment ${file.name}:`, attError);
              throw new Error(`Error al subir adjunto ${file.name}`);
            }
          }
        }
      }

      // 3. Add Recipients (only new ones)
      if (recipients.length > 0) {
        console.log(`Checking ${recipients.length} recipients...`);
        for (const userId of recipients) {
          if (!savedRecipients.has(userId)) {
            console.log(`Adding recipient: ${userId}`);
            try {
              await documentService.addRecipient(documentId, {
                recipientUserId: userId,
                canWrite: false,
              });
              setSavedRecipients(prev => new Set(prev).add(userId));
              console.log(`Recipient ${userId} added successfully.`);
            } catch (recipError) {
              console.error(`Failed to add recipient ${userId}:`, recipError);
              throw new Error(`Error al agregar destinatario ${userId}`);
            }
          }
        }
      }

      return documentId;
    } catch (error) {
      console.error("Error in saveDraft:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const sendDocument = async (
    title: string,
    content: string,
    category: string,
    docType: string,
    recipients: string[], // user IDs
    attachments: File[],
    pdfPassword?: string
  ) => {
    try {
      // First ensure everything is saved
      const documentId = await saveDraft(
        title,
        content,
        category,
        docType,
        recipients,
        attachments,
        pdfPassword
      );

      if (!documentId) throw new Error("No document ID after save");

      setLoading(true);
      // 3. Send Document
      console.log("Sending document...");
      await documentService.send(documentId);
      console.log("Document sent successfully.");

      alert("Documento enviado correctamente");
      
      const isAdmin = pathname?.startsWith("/admin");
      router.push(isAdmin ? "/admin/documents/sent" : "/documents/sent"); 
    } catch (error) {
      console.error("Error in sendDocument flow:", error);
      alert("Error al enviar el documento. Revisa la consola para más detalles.");
    } finally {
      setLoading(false);
    }
  };

  return {
    saveDraft,
    sendDocument,
    loading,
    availableUsers: users,
    currentDocumentId
  };
}
