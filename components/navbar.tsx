"use client"

import { useState, useEffect } from "react"
import { Menu, X, House, ChefHat, BadgeInfo, CookingPot, Phone, Images } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setIsMobileMenuOpen(false)
    }
  }

  const makeCall = () => (window.location.href = "tel:+34651509877")

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur-lg shadow-lg" : "bg-white/90 backdrop-blur-sm shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-5 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16 lg:h-20">
          
          <div
            className="flex items-center gap-0 sm:gap-0.5 md:gap-1 lg:gap-2 cursor-pointer"
            onClick={() => scrollToSection("hero")}
          >
            <Image
              src="/logoCamioneros.svg"
              alt="Logo Los Camioneros"
              width={50}
              height={50}
              className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 transition-transform duration-300 hover:scale-110"
            />
            <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-serif font-bold text-slate-900 tracking-tight whitespace-nowrap">
              Los <span className="inline">Camioneros</span>
            </span>
          </div>

          {/* MENU DESKTOP */}
          <div className="hidden lg:flex items-center space-x-5 xl:space-x-8">
            {[
              { id: "hero", label: "Inicio", icon: House },
              { id: "horario", label: "Horario y Ubicación", icon: ChefHat },
              { id: "galeria", label: "Nuestro Espacio", icon: Images },
              { id: "platos", label: "Nuestros Platos", icon: CookingPot },
              { id: "contacto", label: "Contacto", icon: BadgeInfo },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className="group whitespace-nowrap relative flex items-center gap-1 text-base text-slate-700 font-medium transition-all duration-300 hover:text-blue-700 hover:scale-105 cursor-pointer py-2"
              >
                <Icon className="h-5 w-5 transition-colors duration-300 group-hover:text-blue-700" />
                <span>{label}</span>
                <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
              </button>
            ))}

            <Button
              onClick={makeCall}
              className="group flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg py-2 px-4"
            >
              <Phone className="h-5 w-5" />
              <span>Llámanos</span>
            </Button>
          </div>

          {/* MENU TABLET */}
          <div className="hidden md:flex lg:hidden items-center justify-center gap-3 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-slate-200 mx-auto">
            {[
              { id: "hero", icon: House, label: "Inicio" },
              { id: "horario", icon: ChefHat, label: "Horario y Ubicación" },
              { id: "galeria", icon: Images, label: "Espacio" },
              { id: "platos", icon: CookingPot, label: "Platos" },
              { id: "contacto", icon: BadgeInfo, label: "Contacto" },
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className="relative flex flex-col items-center px-2 py-2 rounded-xl transition-all duration-300 hover:bg-gradient-to-br hover:from-blue-50 hover:to-cyan-50 active:scale-95"
              >
                <Icon className="h-5 w-5 text-slate-700 group-hover:text-blue-600" />
                <span className="text-[11px] text-slate-600 font-medium whitespace-nowrap">
                  {label}
                </span>
              </button>
            ))}
            <Button
              onClick={makeCall}
              size="sm"
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-md transition-all duration-300 hover:scale-105"
            >
              <Phone className="h-4 w-4" />
              <span className="text-xs font-semibold">Llamar</span>
            </Button>
          </div>

          {/* MENU MÓVIL */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-all duration-300 active:scale-95"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-slate-900 rotate-90 transition-transform" />
            ) : (
              <Menu className="h-6 w-6 text-slate-900 transition-transform" />
            )}
          </button>
        </div>

        {/* MOBILE MENU */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
            isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="py-3 border-t border-slate-100">
            {[
              { id: "hero", icon: House, label: "Inicio" },
              { id: "horario", icon: ChefHat, label: "Horario y Ubicación" },
              { id: "galeria", icon: Images, label: "Nuestro Espacio" },
              { id: "platos", icon: CookingPot, label: "Nuestros Platos" },
              { id: "contacto", icon: BadgeInfo, label: "Contacto" },
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className="flex items-center gap-3 w-full text-left px-4 py-3 text-slate-700 font-medium transition-all duration-300 hover:text-blue-700 hover:bg-slate-50 rounded-lg"
              >
                <Icon className="h-5 w-5" />
                <span className="text-base">{label}</span>
              </button>
            ))}

            <div className="px-4 pt-3">
              <Button
                onClick={makeCall}
                className="w-full bg-green-600 hover:bg-green-700 text-white transition-all duration-300 hover:scale-105"
              >
                <Phone className="h-5 w-5" />
                <span className="ml-2">Llámanos Ahora</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
