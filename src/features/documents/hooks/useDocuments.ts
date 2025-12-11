import { useState, useEffect, useCallback } from "react";
import { documentService, Document } from "@/features/new-document/services/document.service";
import { useSession } from "next-auth/react";

export function useDocuments(type: 'inbox' | 'outbox' | 'drafts') {
  const { data: session } = useSession();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = useCallback(async () => {
    if (!session?.user) return;
    
    setLoading(true);
    try {
      let data;
      switch (type) {
        case 'inbox':
          data = await documentService.getInbox();
          break;
        case 'outbox':
          data = await documentService.getOutbox();
          break;
        case 'drafts':
          data = await documentService.getDrafts();
          break;
      }
      // Ensure data is an array
      setDocuments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Error al cargar documentos");
    } finally {
      setLoading(false);
    }
  }, [session, type]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return { documents, loading, error, refresh: fetchDocuments };
}
