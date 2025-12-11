import { ReplyDocumentView } from "@/features/documents/presentation/views/ReplyDocumentView";
import { use } from "react";

export default function ReplyPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  return <ReplyDocumentView originalDocId={resolvedParams.id} />;
}
