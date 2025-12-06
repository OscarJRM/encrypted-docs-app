"use client";

import { useState } from "react";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Button } from "@/app/components/ui/button";

export interface EmailPasswordFormProps {
  onSubmit?: (data: { cedula: string; password: string }) => Promise<void> | void;
}

export function EmailPasswordForm({ onSubmit }: EmailPasswordFormProps) {
  const [cedula, setCedula] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit?.({ cedula, password });
    } finally {
      setLoading(false);
    }
  };

  return (
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
      <div className="grid gap-2">
        <Label htmlFor="password">Contraseña</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Ingresando..." : "Ingresar"}
      </Button>
    </form>
  );
}

