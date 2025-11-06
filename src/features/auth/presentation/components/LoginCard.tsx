"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { MicrosoftSignInButton } from "./MicrosoftSignInButton";
import { cn } from "@/app/lib/utils";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const TEST_USER_OPTIONS = {
  admin: {
    label: "Administrador",
    description: "Acceso a la vista de administración",
    email: "admin@example.com",
    password: "admin123",
    redirect: "/admin",
  },
  user: {
    label: "Cliente",
    description: "Acceso a la vista para clientes",
    email: "user@example.com",
    password: "user123",
    redirect: "/",
  },
} as const;

type TestRole = keyof typeof TEST_USER_OPTIONS;

export function LoginCard() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [selectedRole, setSelectedRole] = useState<TestRole>("admin");
  const [loading, setLoading] = useState(false);

  const handleQuickSignIn = async () => {
    const selectedUser = TEST_USER_OPTIONS[selectedRole];
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email: selectedUser.email,
        password: selectedUser.password,
        redirect: false,
        callbackUrl: selectedUser.redirect,
      });

      if (result?.error) {
        setError("No se pudo iniciar sesión con el perfil seleccionado.");
        return;
      }

      const destination = result?.url ?? selectedUser.redirect;
      router.push(destination);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Iniciar sesión</CardTitle>
        <CardDescription>
          Selecciona un rol temporal mientras conectamos con Microsoft 365.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded">
            {error}
          </div>
        )}
        <div className="grid gap-3">
          {Object.entries(TEST_USER_OPTIONS).map(([role, info]) => {
            const isSelected = role === selectedRole;
            return (
              <button
                type="button"
                key={role}
                onClick={() => setSelectedRole(role as TestRole)}
                className={cn(
                  "rounded-lg border p-3 text-left transition-all",
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-muted",
                )}
              >
                <p className="font-medium">{info.label}</p>
                <p className="text-sm text-muted-foreground">{info.description}</p>
                <div className="mt-2 grid gap-1 text-xs font-mono text-muted-foreground">
                  <div>Correo: {info.email}</div>
                  <div>Contraseña: {info.password}</div>
                </div>
              </button>
            );
          })}
        </div>
        <Button
          type="button"
          onClick={handleQuickSignIn}
          disabled={loading}
          className="mt-4 w-full"
        >
          {loading
            ? "Ingresando..."
            : `Ingresar como ${TEST_USER_OPTIONS[selectedRole].label}`}
        </Button>
      </CardContent>
      <CardFooter className="flex flex-col gap-3">
        <div className="h-px w-full bg-border" />
        <MicrosoftSignInButton />
      </CardFooter>
    </Card>
  );
}
