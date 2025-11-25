// components/admin/ChangePassword.tsx  (créalo cuando quieras)
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function ChangePassword() {
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirm) return toast.error("Las contraseñas no coinciden");
    if (newPass.length < 8) return toast.error("Mínimo 8 caracteres");

    setLoading(true);
    const res = await fetch("/api/adminCamioneros/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ current, newPassword: newPass }),
    });

    if (res.ok) {
      toast.success("¡Contraseña cambiada correctamente!");
      setCurrent(""); setNewPass(""); setConfirm("");
      // Opcional: forzar logout después de cambiar contraseña
      // window.location.href = "/adminCamioneros/login";
    } else {
      toast.error("Contraseña actual incorrecta");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <Input
        type="password"
        placeholder="Contraseña actual"
        value={current}
        onChange={(e) => setCurrent(e.target.value)}
        required
      />
      <Input
        type="password"
        placeholder="Nueva contraseña"
        value={newPass}
        onChange={(e) => setNewPass(e.target.value)}
        required
      />
      <Input
        type="password"
        placeholder="Repite la nueva contraseña"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        required
      />
      <Button type="submit" disabled={loading}>
        {loading ? "Cambiando..." : "Cambiar contraseña"}
      </Button>
    </form>
  );
}
