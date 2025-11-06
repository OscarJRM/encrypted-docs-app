"use client";

import { signOut } from "next-auth/react";
import { useState, type ReactNode } from "react";

import { Button } from "@/app/components/ui/button";

interface SignOutButtonProps {
  className?: string;
  variant?: React.ComponentProps<typeof Button>["variant"];
  children?: ReactNode;
}

export function SignOutButton({
  className,
  variant = "outline",
  children,
}: SignOutButtonProps) {
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
      variant={variant}
      className={className}
      onClick={handleSignOut}
      disabled={loading}
    >
      {loading ? "Saliendo..." : children ?? "Cerrar sesión"}
    </Button>
  );
}
