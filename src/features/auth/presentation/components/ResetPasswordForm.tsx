"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Button } from "@/app/components/ui/button";
import { authService } from "../../services/auth.service";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("Token inválido o faltante.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
      await authService.resetPassword(token, newPassword);
      setMessage("Contraseña restablecida exitosamente. Redirigiendo al login...");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      setError("Error al restablecer la contraseña. El token puede haber expirado.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-red-500">Error</CardTitle>
          <CardDescription>Token de restablecimiento no encontrado.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Restablecer Contraseña</CardTitle>
        <CardDescription>
          Ingresa tu nueva contraseña.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {message && (
          <div className="mb-4 p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded">
            {error}
          </div>
        )}
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="newPassword">Nueva Contraseña</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Restableciendo..." : "Restablecer Contraseña"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
