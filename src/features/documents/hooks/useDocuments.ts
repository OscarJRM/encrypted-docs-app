import { useState, useEffect, useCallback } from "react";
import { documentService, Document } from "@/features/new-document/services/document.service";
import { useSession } from "next-auth/react";
import { usersApi } from "@/app/api/users.api";

export function useDocuments(type: 'inbox' | 'outbox' | 'drafts') {
  const { data: session } = useSession();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = useCallback(async () => {
    if (!session?.user) return;
    
    setLoading(true);
    try {
      let data: Document[] = [];
      switch (type) {
        case 'inbox':
          data = await documentService.getInbox();
          
          // Enrich inbox documents with sender info
          if (Array.isArray(data) && data.length > 0) {
            const token = session.user.accessToken;
            // Get unique owner IDs to avoid duplicate requests
            const ownerIds = Array.from(new Set(data.map(d => d.owner_id).filter(Boolean))) as string[];
            console.log("Found owner IDs to fetch:", ownerIds);
            
            // Fetch user details for each owner
            const usersMap = new Map();
            await Promise.all(ownerIds.map(async (id) => {
              try {
                const user = await usersApi.getById(id, token);
                usersMap.set(id, user);
              } catch (e) {
                console.error(`Failed to fetch user ${id}`, e);
              }
            }));
            console.log("Fetched users map size:", usersMap.size);

            // Map users back to documents
            data = data.map(doc => {
              if (doc.owner_id && usersMap.has(doc.owner_id)) {
                const user = usersMap.get(doc.owner_id);
                return {
                  ...doc,
                  sender: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                  }
                };
              }
              return doc;
            });
            console.log("Enriched documents with sender info:", data);
          }
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
