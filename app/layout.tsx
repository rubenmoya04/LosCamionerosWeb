import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Los Camioneros - Restaurante en Rubí",
  description: "Descubre el sabor auténtico en Los Camioneros, un restaurante familiar con más de 50 años de tradición. Cocina artesanal y un ambiente acogedor en Rubí.",
  keywords: ["Los Camioneros", "restaurante", "Rubí", "comida", "cocina artesanal", "restaurante familiar"],
  authors: [{ name: "Los Camioneros" }],
  icons: {
    icon: "logoCamioneros.svg",
  },
  openGraph: {
    title: "Los Camioneros - Restaurante en Rubí",
    description: "Descubre el sabor auténtico en Los Camioneros, un restaurante familiar con más de 50 años de tradición.",
    url: "https://www.loscamionerosrubi.com",
    siteName: "Los Camioneros",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Los Camioneros - Restaurante en Rubí",
    description: "Descubre el sabor auténtico en Los Camioneros, un restaurante familiar con más de 50 años de tradición.",
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}