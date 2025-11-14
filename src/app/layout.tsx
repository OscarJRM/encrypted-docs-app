import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "./components/SessionProvider";
import { ThemeInitializer } from "./components/ThemeInitializer";

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
    icon: "/icon.png",
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
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
