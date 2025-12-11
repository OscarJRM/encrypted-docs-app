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

  const createAndSendDocument = async (
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
      console.log("Starting document creation flow...");
      
      // 1. Create Document (Draft)
      console.log("1. Creating document draft...");
      const docData = await documentService.create({
        title,
        content,
        category,
        doc_type: docType,
        pdf_password: pdfPassword,
      });

      const documentId = docData.id;
      console.log("Document created with ID:", documentId);

      // 2. Add Attachments
      if (attachments.length > 0) {
        console.log(`2. Adding ${attachments.length} attachments...`);
        for (const file of attachments) {
          console.log(`Uploading attachment: ${file.name}`);
          try {
            await documentService.addAttachment(documentId, file);
            console.log(`Attachment ${file.name} uploaded successfully.`);
          } catch (attError) {
            console.error(`Failed to upload attachment ${file.name}:`, attError);
            // We might want to continue or throw, depending on strictness. 
            // For now, let's log and continue, or maybe throw to stop sending?
            // Let's throw to ensure integrity.
            throw new Error(`Error al subir adjunto ${file.name}`);
          }
        }
      }

      // 3. Add Recipients
      console.log(`3. Adding ${recipients.length} recipients...`);
      for (const userId of recipients) {
        console.log(`Adding recipient: ${userId}`);
        try {
          await documentService.addRecipient(documentId, {
            recipientUserId: userId,
            canWrite: false,
          });
          console.log(`Recipient ${userId} added successfully.`);
        } catch (recipError) {
          console.error(`Failed to add recipient ${userId}:`, recipError);
          throw new Error(`Error al agregar destinatario ${userId}`);
        }
      }

      // 3. Send Document
      console.log("3. Sending document...");
      await documentService.send(documentId);
      console.log("Document sent successfully.");

      alert("Documento enviado correctamente");
      
      const isAdmin = pathname?.startsWith("/admin");
      router.push(isAdmin ? "/admin/documents/sent" : "/documents/sent"); 
    } catch (error) {
      console.error("Error in createAndSendDocument flow:", error);
      alert("Error al crear y enviar el documento. Revisa la consola para más detalles.");
    } finally {
      setLoading(false);
    }
  };

  return {
    createAndSendDocument,
    loading,
    availableUsers: users,
  };
}
