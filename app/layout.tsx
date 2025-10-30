import { Analytics } from "@vercel/analytics/next";
import "@/styles/globals.css";
import { Suspense, ReactNode } from "react";
import { Lora, Inter } from "next/font/google";

// Configuración de fuentes con variables CSS
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

export const metadata = {
  title: "Los Camioneros - Restaurante Tradicional",
  description: "El sabor auténtico en cada plato",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="es" className={`${inter.variable} ${lora.variable}`}>
      <body className="font-sans antialiased bg-slate-950 text-white transition-colors duration-300">
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-screen text-slate-400">
              Cargando...
            </div>
          }
        >
          {/* Contenido principal */}
          {children}

          {/* Analytics */}
          <Analytics />
        </Suspense>
      </body>
    </html>
  );
}
