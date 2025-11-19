"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import AdminDashboard from "@/components/admin/dashboard";
import { toast } from "sonner";

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/adminCamioneros/login");
      return;
    }
    setIsAuthenticated(true);
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    toast.success("Sesión cerrada");
    router.push("/adminCamioneros/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <AdminDashboard onLogout={handleLogout} />;
}
