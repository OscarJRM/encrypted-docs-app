"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/app/components/ui/card";
import { MicrosoftSignInButton } from "./MicrosoftSignInButton";
import { EmailPasswordForm } from "./EmailPasswordForm";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginCard() {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleCedulaPasswordSubmit = async (credentials: { cedula: string; password: string }) => {
    setError("");
    
    const result = await signIn("credentials", {
      ...credentials,
      redirect: false,
    });

    if (result?.error) {
      setError("Credenciales inválidas");
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Iniciar sesión</CardTitle>
        <CardDescription>
          Ingresa tu cédula y contraseña o usa tu cuenta de Microsoft.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded">
            {error}
          </div>
        )}
        <EmailPasswordForm onSubmit={handleCedulaPasswordSubmit} />
        <div className="mt-2 text-center">
          <a href="/forgot-password" className="text-sm text-blue-600 hover:underline">
            ¿Olvidaste tu contraseña?
          </a>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-3">
        <div className="h-px w-full bg-border" />
        <MicrosoftSignInButton />
      </CardFooter>
    </Card>
  );
}
