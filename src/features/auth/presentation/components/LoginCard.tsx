"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/app/components/ui/card";
import { EmailPasswordForm } from "./EmailPasswordForm";
import { MicrosoftSignInButton } from "./MicrosoftSignInButton";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginCard() {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleEmailPasswordSubmit = async (data: { email: string; password: string }) => {
    setError("");
    
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      setError("Credenciales inválidas");
    } else if (result?.ok) {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Iniciar sesión</CardTitle>
        <CardDescription>
          Usa tu correo y contraseña o Microsoft 365
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded">
            {error}
          </div>
        )}
        <EmailPasswordForm onSubmit={handleEmailPasswordSubmit} />
      </CardContent>
      <CardFooter className="flex flex-col gap-3">
        <div className="h-px w-full bg-border" />
        <MicrosoftSignInButton />
      </CardFooter>
    </Card>
  );
}
