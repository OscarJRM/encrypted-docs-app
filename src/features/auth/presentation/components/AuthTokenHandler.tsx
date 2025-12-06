"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function AuthTokenHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();

  useEffect(() => {
    const token = searchParams.get("token");

    console.log("[AuthTokenHandler] Checking auth state:", {
      hasToken: !!token,
      status,
      path: window.location.pathname,
    });

    if (token) {
      if (status === "unauthenticated") {
        console.log("[AuthTokenHandler] Token found and user unauthenticated. Attempting login...");
        
        // Attempt to sign in with the token
        signIn("credentials", {
          token,
          redirect: false,
        }).then((result) => {
          console.log("[AuthTokenHandler] SignIn result:", result);
          
          if (result?.error) {
            console.error("[AuthTokenHandler] Login failed:", result.error);
          } else {
            console.log("[AuthTokenHandler] Login successful. Cleaning URL...");
            // Login success
            // Remove token from URL to clean it up
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.delete("token");
            router.replace(newUrl.pathname + newUrl.search);
            router.refresh();
          }
        }).catch((err) => {
          console.error("[AuthTokenHandler] SignIn exception:", err);
        });
      } else if (status === "authenticated") {
        console.log("[AuthTokenHandler] User already authenticated. Removing token from URL.");
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete("token");
        router.replace(newUrl.pathname + newUrl.search);
      }
    }
  }, [searchParams, status, router]);

  return null;
}
