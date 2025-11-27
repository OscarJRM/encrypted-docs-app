"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Loader2, Check, Copy } from "lucide-react";

export function MicrosoftCallback() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const accessToken = session?.user?.accessToken;

  const handleCopy = () => {
    if (accessToken) {
      navigator.clipboard.writeText(accessToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleContinue = () => {
    router.push("/");
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return (
      <Card className="w-full max-w-md mx-auto mt-10">
        <CardHeader>
          <CardTitle className="text-red-500">Error de Autenticación</CardTitle>
          <CardDescription>No se pudo obtener la sesión de Microsoft.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => router.push("/login")} variant="outline">
            Volver al Login
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl text-green-600 flex items-center gap-2">
            <Check className="h-6 w-6" />
            Autenticación Exitosa
          </CardTitle>
          <CardDescription>
            Has iniciado sesión correctamente con Microsoft.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-sm text-slate-700">Microsoft Access Token (Para Backend)</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-8 text-xs"
              >
                {copied ? (
                  <span className="flex items-center text-green-600">
                    <Check className="h-3 w-3 mr-1" /> Copiado
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Copy className="h-3 w-3 mr-1" /> Copiar Token
                  </span>
                )}
              </Button>
            </div>
            <div className="bg-slate-950 text-slate-50 p-3 rounded text-xs font-mono break-all max-h-48 overflow-y-auto">
              {accessToken || "No access token found in session"}
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Usa este token en el header `Authorization: Bearer &lt;token&gt;` para probar tus endpoints de NestJS.
            </p>
          </div>

          <div className="flex justify-end gap-3">
             <Button onClick={handleContinue}>
              Continuar al Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
