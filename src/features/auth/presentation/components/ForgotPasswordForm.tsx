"use client";

import { useState } from "react";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Button } from "@/app/components/ui/button";
import { authService } from "../../services/auth.service";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";

export function ForgotPasswordForm() {
  const [cedula, setCedula] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      await authService.forgotPassword(cedula);
      setMessage("Si la cédula está registrada, recibirás un correo con instrucciones.");
    } catch (err) {
      setError("Ocurrió un error al procesar la solicitud.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Recuperar Contraseña</CardTitle>
        <CardDescription>
          Ingresa tu cédula para recibir instrucciones de restablecimiento.
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
            <Label htmlFor="cedula">Cédula</Label>
            <Input
              id="cedula"
              type="text"
              placeholder="Ingrese su cédula"
              value={cedula}
              onChange={(e) => setCedula(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Enviando..." : "Enviar Instrucciones"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
