"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { signOut } from "next-auth/react";

interface SignOutButtonProps {
  className?: string;
}

export function SignOutButton({ className }: SignOutButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut({ callbackUrl: "/login" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      className={className}
      onClick={handleSignOut}
      disabled={loading}
    >
      {loading ? "Saliendo..." : "Cerrar sesión"}
    </Button>
  );
}
