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

const TEST_USERS = [
  {
    role: "Administrador",
    email: "admin@example.com",
    password: "admin123",
    redirect: "/admin",
  },
  {
    role: "Cliente",
    email: "user@example.com",
    password: "user123",
    redirect: "/",
  },
] as const;

export function LoginCard() {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleEmailPasswordSubmit = async (credentials: { email: string; password: string }) => {
    setError("");
    const normalizedEmail = credentials.email.toLowerCase();
    const matchedUser = TEST_USERS.find((user) => user.email === normalizedEmail);

    const result = await signIn("credentials", {
      ...credentials,
      redirect: false,
      callbackUrl: matchedUser?.redirect ?? "/",
    });

    if (result?.error) {
      setError("Credenciales inválidas");
      return;
    }

    const destination = result?.url ?? matchedUser?.redirect ?? "/";
    router.push(destination);
    router.refresh();
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Iniciar sesión</CardTitle>
        <CardDescription>
          Usa temporalmente las credenciales de prueba mientras conectamos con Microsoft 365.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded">
            {error}
          </div>
        )}
        <EmailPasswordForm onSubmit={handleEmailPasswordSubmit} />
        <div className="mt-4 space-y-2 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Perfiles de prueba disponibles:</p>
          {TEST_USERS.map((user) => (
            <div key={user.email} className="rounded-md border border-dashed border-border p-3">
              <p className="font-medium text-foreground">{user.role}</p>
              <p>Correo: {user.email}</p>
              <p>Contraseña: {user.password}</p>
              <p>Redirige a: {user.redirect}</p>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-3">
        <div className="h-px w-full bg-border" />
        <MicrosoftSignInButton />
      </CardFooter>
    </Card>
  );
}
