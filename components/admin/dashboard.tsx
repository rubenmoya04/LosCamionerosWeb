"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Home, LockOpen, ImageIcon, UtensilsCrossed, Clock, Settings, LogOut, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import MenuDishesManager from "./menu-dishes-manager";
import GalleryImagesManager from "./gallery-images-manager";
import AuditLog from "./audit-log";
import SettingsPage from "./settings";

// --- LA INTERFAZ SÍ NECESITA onLogout ---
interface AdminDashboardProps {
  onLogout: () => void; // <-- RESTAURADO
}

// Tipado correcto para iconos de Lucide
type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

const SidebarButton = ({
  icon: Icon,
  label,
  isActive,
  onClick
}: {
  icon: IconType;
  label: string;
  isActive: boolean;
  onClick: () => void;
}) => (
  <Button
    variant="ghost"
    size="lg"
    className={`w-full justify-start h-12 rounded-xl font-medium transition-all duration-300 group ${isActive
        ? "bg-slate-900 text-white shadow-lg"
        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
      }`}
    onClick={onClick}
  >
    <div className={`p-2 rounded-lg transition-all duration-300 flex-shrink-0 ${isActive ? "bg-white/20" : "bg-slate-200 group-hover:bg-slate-300"
      }`}>
      <Icon
        className="w-5 h-5"
        style={{ color: 'currentColor' }}
      />
    </div>
    <span className="ml-3">{label}</span>
  </Button>
);

export default function AdminDashboard({ onLogout }: AdminDashboardProps) { // <-- RECIBE LA PROP
  const [activeSection, setActiveSection] = useState<"dishes" | "gallery" | "audit" | "settings">("dishes");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false); // Estado para el feedback del botón
  const router = useRouter();

  // --- FUNCIÓN QUE LLAMA AL PADRE ---
  const handleLogoutClick = async () => {
    setIsLoggingOut(true); // Activa el estado de carga
    await onLogout(); // Espera a que la función del padre termine
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const sidebarItems = [
    { id: "dishes", label: "Gestor de Platos", icon: UtensilsCrossed },
    { id: "gallery", label: "Fotos del Local", icon: ImageIcon },
    { id: "audit", label: "Registro de Actividades", icon: Clock },
  ];

  return (
    <div className="h-screen bg-slate-50 flex">
      {/* Overlay móvil */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={toggleSidebar} />
      )}

      {/* SIDEBAR */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transform transition-transform duration-300 ease-in-out h-full ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}>
        <div className="p-6 border-b border-slate-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-900 rounded-xl shadow-md">
              <LockOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">
                Panel de administración
              </p>
              <h1 className="text-xl font-bold text-slate-900">Los Camioneros</h1>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {sidebarItems.map((item) => (
            <SidebarButton
              key={item.id}
              icon={item.icon}
              label={item.label}
              isActive={activeSection === item.id}
              onClick={() => {
                setActiveSection(item.id);
                setIsSidebarOpen(false);
              }}
            />
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200 space-y-2 flex-shrink-0">
          <SidebarButton
            icon={Settings}
            label="Configuración"
            isActive={activeSection === "settings"}
            onClick={() => {
              setActiveSection("settings");
              setIsSidebarOpen(false);
            }}
          />
          {/* --- BOTÓN DE CERRAR SESIÓN CON FEEDBACK --- */}
          <Button
            variant="ghost"
            size="lg"
            disabled={isLoggingOut}
            className="w-full justify-start h-12 rounded-xl font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-300"
            onClick={handleLogoutClick}
          >
            <div className="p-2 bg-red-100 rounded-lg">
              {isLoggingOut ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <LogOut className="w-5 h-5" />
              )}
            </div>
            <span className="ml-3">
              {isLoggingOut ? "Cerrando sesión..." : "Cerrar sesión"}
            </span>
          </Button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-slate-200 shadow-sm flex-shrink-0">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={toggleSidebar} className="lg:hidden p-2">
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>

            <div className="flex-1 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800 capitalize hidden lg:block">
                {activeSection === "dishes" && "Gestor de Platos"}
                {activeSection === "gallery" && "Galería de Imágenes"}
                {activeSection === "audit" && "Registro de Actividades"}
                {activeSection === "settings" && "Configuración"}
              </h2>

              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/")}
                className="flex items-center gap-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Página Principal</span>
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {activeSection === "dishes" && <MenuDishesManager />}
            {activeSection === "gallery" && <GalleryImagesManager />}
            {activeSection === "audit" && <AuditLog />}
             {activeSection === "settings" && (
              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-slate-100 rounded-lg">
                    <Settings className="w-8 h-8 text-slate-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Configuración</h2>
                    <p className="text-slate-500">Gestiona la configuración general del sitio.</p>
                  </div>
                </div>
                <div className="text-center py-12">
                  <p className="text-slate-500">Esta sección está en desarrollo...</p>
                  <hr className="my-4" />
                  <p className="text-slate-500 font-bold">Proximamente mama :)</p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}