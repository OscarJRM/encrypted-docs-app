import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "./components/SessionProvider";
import { ThemeInitializer } from "./components/ThemeInitializer";
import { Suspense } from "react";
import { AuthTokenHandler } from "@/features/auth/presentation/components/AuthTokenHandler";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Encrypted Docs",
  description: "Gestión segura de documentos encriptados",
  icons: {
    icon: "/icon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" data-theme="dark">
      <body
        className={`dark ${geistSans.variable} ${geistMono.variable} antialiased`}
        data-theme="dark"
      >
        <ThemeInitializer />
        <SessionProvider>
          <Suspense fallback={null}>
            <AuthTokenHandler />
          </Suspense>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
