import { MicrosoftCallback } from "@/features/auth/presentation/views/MicrosoftCallback";
import { Suspense } from "react";

export default function MicrosoftCallbackPage() {
  return (
    <Suspense fallback={<div>Autenticando...</div>}>
      <MicrosoftCallback />
    </Suspense>
  );
}
