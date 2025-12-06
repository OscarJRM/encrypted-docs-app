"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Loader2 } from "lucide-react";

export function MicrosoftCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();
  const [error, setError] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      // Attempt to sign in with the token
      signIn("credentials", {
        token,
        redirect: false,
      }).then((result) => {
        if (result?.error) {
          setError("Error al iniciar sesión con el token proporcionado.");
        } else {
          router.push("/");
          router.refresh();
        }
      });
    } else if (status === "unauthenticated") {
      setError("No se encontró el token de autenticación.");
    } else if (status === "authenticated") {
        router.push("/");
    }
  }, [searchParams, router, status]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-500">Error de Autenticación</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/login")} variant="outline" className="w-full">
              Volver al Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            Autenticando...
          </CardTitle>
          <CardDescription>
            Estamos verificando tus credenciales de Microsoft.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
