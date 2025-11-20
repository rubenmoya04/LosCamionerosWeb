// app/adminCamioneros/page.tsx ← VERSIÓN 100% FUNCIONAL
"use client";

import { useRouter } from 'next/navigation';
import AdminDashboard from "@/components/admin/dashboard";
import { toast } from "sonner";

export default function AdminPage() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch("/adminCamioneros/auth-logout", {
        method: "POST"
      }); // ← QUITA LA COMA Y EL PARÉNTESIS EXTRA

      if (response.ok) {
        toast.success("¡Sesión cerrada correctamente!");
        router.replace("/adminCamioneros/auth-login"); // ← también actualiza aquí la ruta
      } else {
        toast.error("Error al cerrar la sesión.");
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      toast.error("Ocurrió un error inesperado.");
    }
  };

  return <AdminDashboard onLogout={handleLogout} />;
}