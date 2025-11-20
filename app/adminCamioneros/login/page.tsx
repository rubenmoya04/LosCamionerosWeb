"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { UtensilsCrossed, User, Lock, Loader2, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    try {
      const response = await fetch("/adminCamioneros/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Guardar username en localStorage (solo para mostrar, no para auth)
        localStorage.setItem("adminUsername", username);
        toast.success("¡Bienvenido al Panel!");
        router.replace("/adminCamioneros");
      } else {
        setError(true);
        toast.error("Usuario o contraseña incorrectos");
        setPassword("");
      }
    } catch (err) {
      console.error("Error en login:", err);
      toast.error("Ocurrió un error inesperado. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
          <div className="blob blob-3"></div>
        </div>

        <Card className={`w-full max-w-md shadow-2xl border-slate-700 bg-slate-800/90 backdrop-blur-sm transform transition-all duration-500 ${error ? "animate-shake" : "animate-fade-in"
          }`}>
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <div className="p-3 bg-slate-700 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-110">
                  <UtensilsCrossed className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-3xl font-extrabold text-white mb-2">
                Los Camioneros
              </h1>
              <p className="text-slate-400 text-sm">Panel de Administración</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="username" className="text-sm font-medium text-slate-300">
                  Usuario
                </label>
                <div className="relative mt-1.5">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Ingrese su usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading}
                    required
                    className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="text-sm font-medium text-slate-300">
                  Contraseña
                </label>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Ingrese su contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                    className="pl-10 pr-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  "Entrar al Panel"
                )}
              </Button>

              <Button
                type="button"
                onClick={() => router.push("/")}
                className="w-full mt-2 bg-slate-700 hover:bg-slate-600 text-white font-medium transition-all duration-300"
              >
                Volver a la Página Principal
              </Button>
            </form>

            <p className="text-xs text-slate-500 text-center mt-8">
              Acceso restringido a personal autorizado.
            </p>
          </div>
        </Card>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.05); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.4;
        }
        .blob-1 {
          top: -10%;
          left: -10%;
          width: 60%;
          height: 60%;
          background: linear-gradient(to right, #3b82f6, #1e40af);
          animation: float 20s infinite ease-in-out;
        }
        .blob-2 {
          bottom: -10%;
          right: -10%;
          width: 60%;
          height: 60%;
          background: linear-gradient(to right, #8b5cf6, #6d28d9);
          animation: float 25s infinite ease-in-out reverse;
        }
        .blob-3 {
          top: 50%;
          left: 50%;
          width: 40%;
          height: 40%;
          background: linear-gradient(to right, #06b6d4, #0891b2);
          animation: float 15s infinite ease-in-out;
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </>
  );
}