"use client";

import { Button } from "@/app/components/ui/button";

export function MicrosoftSignInButton() {
  const signInWithMicrosoft = () => {
    window.location.href = "/api/auth/signin/azure-ad";
  };

  return (
    <Button type="button" variant="outline" className="w-full" onClick={signInWithMicrosoft}>
      <MicrosoftIcon className="mr-2" />
      Continuar con Microsoft
    </Button>
  );
}

function MicrosoftIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 23 23"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="1" y="1" width="9.5" height="9.5" fill="#F25022" />
      <rect x="12.5" y="1" width="9.5" height="9.5" fill="#7FBA00" />
      <rect x="1" y="12.5" width="9.5" height="9.5" fill="#00A4EF" />
      <rect x="12.5" y="12.5" width="9.5" height="9.5" fill="#FFB900" />
    </svg>
  );
}

