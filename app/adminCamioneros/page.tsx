// app/adminCamioneros/page.tsx ← VERSIÓN FINAL QUE FUNCIONA AL 100%
"use client";

import { useRouter } from 'next/navigation';
import AdminDashboard from "@/components/admin/dashboard";
import { toast } from "sonner";

export default function AdminPage() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // RUTA CORRECTA: tu API está en /api/adminCamioneros/logout
      const response = await fetch("/api/adminCamioneros/logout", {
        method: "POST",
        credentials: "include", // ← OBLIGATORIO para que envíe la cookie HttpOnly
      });

      if (response.ok) {
        toast.success("¡Sesión cerrada correctamente!");
        // Redirige al login real (que ya funciona gracias a force-dynamic)
        window.location.href = "/adminCamioneros/login";
      } else {
        toast.error("Error al cerrar la sesión.");
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      toast.error("Ocurrió un error inesperado.");
      // Aunque falle, te sacamos por seguridad
      window.location.href = "/adminCamioneros/login";
    }
  };

  return <AdminDashboard onLogout={handleLogout} />;
}