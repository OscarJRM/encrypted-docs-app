import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { documentService } from "../services/document.service";
import { usersApi, User } from "@/app/api/users.api";

export function useCreateDocument() {
  const { data: session } = useSession();
  const router = useRouter();
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
    recipients: string[], // emails
    pdfPassword?: string
  ) => {
    setLoading(true);
    try {
      // 1. Create Document (Draft)
      const docData = await documentService.create({
        title,
        content,
        category,
        doc_type: docType,
        pdf_password: pdfPassword,
      });

      const documentId = docData.id;

      // 2. Add Recipients
      for (const email of recipients) {
        const user = users.find((u) => u.email === email);
        if (user) {
          await documentService.addRecipient(documentId, {
            recipientUserId: user.id,
            canWrite: false, // Default to read-only for now
          });
        } else {
            console.warn(`User with email ${email} not found.`);
        }
      }

      // 3. Send Document
      await documentService.send(documentId);

      alert("Documento enviado correctamente");
      router.push("/documents"); 
    } catch (error) {
      console.error("Error creating document:", error);
      alert("Error al crear el documento");
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
