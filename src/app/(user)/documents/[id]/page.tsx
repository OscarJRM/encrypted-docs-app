import { DocumentDetailView } from "@/features/documents/presentation/views/DocumentDetailView";
import { use } from "react";

export default function DocumentPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  return <DocumentDetailView documentId={resolvedParams.id} />;
}
