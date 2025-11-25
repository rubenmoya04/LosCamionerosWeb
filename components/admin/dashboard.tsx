"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Menu,
  X,
  Home,
  LockOpen,
  ImageIcon,
  UtensilsCrossed,
  Clock,
  Settings,
  LogOut,
  Loader2,
  BarChart3,
} from "lucide-react"
import { useRouter } from "next/navigation"

import MenuDishesManager from "./menu-dishes-manager"
import GalleryImagesManager from "./gallery-images-manager"
import AuditLog from "./audit-log"
import SystemStatus from "./system-status"

type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>

const SidebarButton = ({
  icon: Icon,
  label,
  isActive,
  onClick,
}: {
  icon: IconType
  label: string
  isActive: boolean
  onClick: () => void
}) => (
  <Button
    variant="ghost"
    size="lg"
    className={`w-full justify-start h-12 rounded-xl font-medium transition-all duration-300 group ${
      isActive
        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
    }`}
    onClick={onClick}
  >
    <div
      className={`p-2 rounded-lg transition-all duration-300 flex-shrink-0 ${
        isActive ? "bg-white/20" : "bg-slate-200 group-hover:bg-slate-300"
      }`}
    >
      <Icon className="w-5 h-5" />
    </div>
    <span className="ml-3">{label}</span>
  </Button>
)

export default function AdminDashboard({ onLogout }: { onLogout: () => Promise<void> }) {
  const [activeSection, setActiveSection] = useState<"dishes" | "gallery" | "audit" | "status" | "settings">("dishes")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await onLogout()
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  const sidebarItems = [
    { id: "dishes" as const, label: "Gestor de Platos", icon: UtensilsCrossed },
    { id: "gallery" as const, label: "Fotos del Local", icon: ImageIcon },
    { id: "status" as const, label: "Estado del Sistema", icon: BarChart3 },
    { id: "audit" as const, label: "Registro de Actividades", icon: Clock },
  ]

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex">
      {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={toggleSidebar} />}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transform transition-transform duration-300 ease-in-out h-full shadow-xl ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6 border-b border-slate-200 flex-shrink-0 bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-md">
              <LockOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Panel de administración</p>
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                Los Camioneros
              </h1>
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
                setActiveSection(item.id)
                setIsSidebarOpen(false)
              }}
            />
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200 space-y-2 flex-shrink-0 bg-slate-50">
          <SidebarButton
            icon={Settings}
            label="Configuración"
            isActive={activeSection === "settings"}
            onClick={() => {
              setActiveSection("settings")
              setIsSidebarOpen(false)
            }}
          />

          <Button
            variant="ghost"
            size="lg"
            disabled={isLoggingOut}
            className="w-full justify-start h-12 rounded-xl font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-300"
            onClick={handleLogout}
          >
            <div className="p-2 bg-red-100 rounded-lg">
              {isLoggingOut ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogOut className="w-5 h-5" />}
            </div>
            <span className="ml-3">{isLoggingOut ? "Cerrando sesión..." : "Cerrar sesión"}</span>
          </Button>
        </div>
      </aside>

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
                {activeSection === "status" && "Estado del Sistema"}
                {activeSection === "audit" && "Registro de Actividades"}
                {activeSection === "settings" && "Configuración"}
              </h2>

              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/")}
                className="flex items-center gap-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 ml-2"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Página Principal</span>
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {activeSection === "dishes" && <MenuDishesManager />}
            {activeSection === "gallery" && <GalleryImagesManager />}
            {activeSection === "status" && <SystemStatus />}
            {activeSection === "audit" && <AuditLog />}
            {activeSection === "settings" && (
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg">
                    <Settings className="w-8 h-8 text-slate-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Configuración</h2>
                    <p className="text-slate-500">Gestiona la configuración general del sitio.</p>
                  </div>
                </div>
                <div className="text-center py-12">
                  <p className="text-slate-500 text-lg mb-2">Esta sección está en desarrollo...</p>
                  <p className="text-slate-400 font-medium">Próximamente mamá :)</p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
