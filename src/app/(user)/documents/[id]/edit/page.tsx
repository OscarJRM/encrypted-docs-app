import { EditDocumentView } from "@/features/documents/presentation/views/EditDocumentView";
import { use } from "react";

export default function EditDocumentPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  return <EditDocumentView documentId={resolvedParams.id} />;
}
