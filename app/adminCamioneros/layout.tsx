import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | Los Camioneros",
  description: "Panel de administración",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
