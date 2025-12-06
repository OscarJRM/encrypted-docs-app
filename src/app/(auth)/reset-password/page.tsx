import { ResetPasswordForm } from "@/features/auth/presentation/components/ResetPasswordForm";
import { Suspense } from "react";

export default function ResetPasswordPage() {
  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center px-4">
      <Suspense fallback={<div>Cargando...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
