import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import "../styles/globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react";

// === FUENTES OFICIALES DE GOOGLE (Inter = Geist, Lora = Serif) ===
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600", "700"],
});

// === METADATA ===
export const metadata: Metadata = {
  title: {
    default: "Los Camioneros - Restaurante en Rubí",
    template: "%s | Los Camioneros",
  },
  description:
    "Descubre el sabor auténtico en Los Camioneros, un restaurante familiar con más de 50 años de tradición. Cocina artesanal y un ambiente acogedor en Rubí.",
  keywords: [
    "Los Camioneros",
    "restaurante Rubí",
    "comida casera",
    "tapas",
    "menú del día",
    "restaurante familiar",
    "bar Rubí",
    "platos combinados",
    "cocina tradicional",
    "reserva mesa",
  ],
  authors: [{ name: "Los Camioneros Rubí", url: "https://www.loscamionerosrubi.com" }],
  creator: "Los Camioneros Team",
  publisher: "Los Camioneros Rubí",
  metadataBase: new URL("https://www.loscamionerosrubi.com"),
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/logoCamioneros.svg",
    shortcut: "/logoCamioneros.svg",
    apple: "/logoCamioneros.svg",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Los Camioneros - Restaurante en Rubí",
    description: "Más de 50 años sirviendo comida casera con amor.",
    url: "https://www.loscamionerosrubi.com",
    siteName: "Los Camioneros Rubí",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Los Camioneros - Restaurante Familiar",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Los Camioneros - Restaurante en Rubí",
    description: "Comida casera, tradición y buen ambiente desde 1970.",
    images: ["/og-image.jpg"],
  },
    generator: 'v0.app'
};

// === VIEWPORT ===
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

// === LAYOUT ===
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
        <meta name="theme-color" content="#18181b" />

        {/* FAVICONS */}
        <link rel="icon" href="/logoCamioneros.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/logoCamioneros.svg" />

        {/* PWA */}
        <link rel="manifest" href="/site.webmanifest" />
      </head>

      <body
        className={`
          ${inter.variable} ${lora.variable}
          antialiased
          bg-background text-foreground
          min-h-screen
          font-sans
          selection:bg-primary selection:text-primary-foreground
        `}
      >
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
