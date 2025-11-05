"use client"

import { useState, useEffect } from "react"
import { Menu, X, House, ChefHat, BadgeInfo, CookingPot, Phone, Images } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
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

  const makeCall = () => {
    window.location.href = "tel:+34651509877"
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? "bg-white/95 backdrop-blur-lg shadow-lg"
        : "bg-white/90 backdrop-blur-sm shadow-sm"
        }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16 md:h-18 lg:h-20">

          {/* Logo - Responsive sizes */}
          <div
            className="flex-shrink-0 flex items-center gap-2 sm:gap-3 cursor-pointer"
            onClick={() => scrollToSection("hero")}
          >
            <Image
              src="/logoCamioneros.svg"
              alt="Logo Los Camioneros"
              width={120}
              height={120}
              className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 transition-transform duration-300 hover:scale-110"
            />
            <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-serif font-bold text-slate-900 tracking-tight">
              Los <span className="sm:inline">Camioneros</span>
            </span>
          </div>

          {/* Desktop Menu - Responsive spacing and text */}
          <div className="hidden lg:flex items-center space-x-4 xl:space-x-6">
            <button
              onClick={() => scrollToSection("hero")}
              className="group relative flex items-center gap-2 text-base sm:text-lg text-slate-700 font-medium transition-all duration-300 hover:text-blue-700 hover:scale-105 cursor-pointer py-2"
            >
              <House className="h-4 w-4 sm:h-5 sm:w-5 transition-colors duration-300 group-hover:text-blue-700" />
              <span className="hidden sm:inline">Inicio</span>
              <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
            </button>

            <button
              onClick={() => scrollToSection("horario")}
              className="group relative flex items-center gap-2 text-base sm:text-lg text-slate-700 font-medium transition-all duration-300 hover:text-blue-700 hover:scale-105 cursor-pointer py-2"
            >
              <ChefHat className="h-4 w-4 sm:h-5 sm:w-5 transition-colors duration-300 group-hover:text-blue-700" />
              <span className="hidden sm:inline">Horario</span>
              <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
            </button>


            <button
              onClick={() => scrollToSection("galeria")}
              className="group relative flex items-center gap-2 text-base sm:text-lg text-slate-700 font-medium transition-all duration-300 hover:text-blue-700 hover:scale-105 cursor-pointer py-2"
            >
              <Images className="h-4 w-4 sm:h-5 sm:w-5 transition-colors duration-300 group-hover:text-blue-700" />
              <span className="hidden sm:inline">Nuestro Espacio</span>
              <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
            </button>

            <button
              onClick={() => scrollToSection("platos")}
              className="group relative flex items-center gap-2 text-base sm:text-lg text-slate-700 font-medium transition-all duration-300 hover:text-blue-700 hover:scale-105 cursor-pointer py-2"
            >
              <CookingPot className="h-4 w-4 sm:h-5 sm:w-5 transition-colors duration-300 group-hover:text-blue-700" />
              <span className="hidden sm:inline">Nuestros Platos</span>
              <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
            </button>

            <button
              onClick={() => scrollToSection("contacto")}
              className="group relative flex items-center gap-2 text-base sm:text-lg text-slate-700 font-medium transition-all duration-300 hover:text-blue-700 hover:scale-105 cursor-pointer py-2"
            >
              <BadgeInfo className="h-4 w-4 sm:h-5 sm:w-5 transition-colors duration-300 group-hover:text-blue-700" />
              <span className="hidden sm:inline">Contacto</span>
              <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
            </button>

            {/* <Button
              onClick={() => scrollToSection("cartaPDF")}
              className="group relative flex items-center gap-2 bg-blue-900 hover:bg-blue-700 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer py-2 px-3 sm:px-4 text-sm sm:text-base"
            >
              <UtensilsCrossed className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Carta</span>
            </Button> */}

            <Button
              onClick={makeCall}
              className="group relative flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer py-2 px-3 sm:px-4 text-sm sm:text-base"
            >
              <Phone className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Llámanos</span>
            </Button>
          </div>

          {/* Tablet Menu - Medium screens */}
          {/* Tablet Menu - Compacto con texto visible */}
<div className="hidden md:flex lg:hidden items-center justify-center text-nowrap gap-3 px-3 py-1 bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-slate-200 mx-auto">
  {[
    { id: "hero", icon: House, label: "Inicio" },
    { id: "horario", icon: ChefHat, label: "Horario" },
    { id: "galeria", icon: Images, label: "Espacio" },
    { id: "platos", icon: CookingPot, label: "Platos" },
    { id: "contacto", icon: BadgeInfo, label: "Contacto" },
  ].map(({ id, icon: Icon, label }) => (
    <button
      key={id}
      onClick={() => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: "smooth" })
      }}
      className="relative flex flex-col items-center justify-center px-2 py-2 rounded-xl transition-all duration-300 hover:bg-gradient-to-br hover:from-blue-50 hover:to-cyan-50 active:scale-95 focus:outline-none group"
    >
      <Icon
        className="h-5 w-5 text-slate-700 group-hover:text-blue-600 transition-colors duration-300"
        aria-hidden="true"
      />
      <span className="text-[10px] sm:text-xs text-slate-600 mt-1 font-medium group-hover:text-blue-700">
        {label}
      </span>
      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-blue-500 rounded-full transition-all duration-300 group-hover:w-3/4" />
    </button>
  ))}

  {/* Botón de llamada */}
  <Button
    onClick={() => (window.location.href = "tel:+34651509877")}
    size="sm"
    className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-md transition-all duration-300 hover:scale-105 focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
  >
    <Phone className="h-4 w-4" aria-hidden="true" />
    <span className="text-xs font-semibold">Llamar</span>
  </Button>
</div>


          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-all duration-300 active:scale-95"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5 sm:h-6 sm:w-6 text-slate-900 transition-transform duration-300 rotate-90" />
            ) : (
              <Menu className="h-5 w-5 sm:h-6 sm:w-6 text-slate-900 transition-transform duration-300" />
            )}
          </button>
        </div>

        {/* Mobile Menu - Enhanced responsive design */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
        >
          <div className="py-3 sm:py-4 space-y-1 sm:space-y-2 border-t border-slate-100">
            <button
              onClick={() => scrollToSection("hero")}
              className="group relative flex items-center gap-3 w-full text-left px-3 sm:px-4 py-3 text-slate-700 font-medium transition-all duration-300 hover:text-blue-700 hover:bg-slate-50 cursor-pointer rounded-lg"
            >
              <House className="h-5 w-5 transition-colors duration-300 group-hover:text-blue-700" />
              <span className="text-base sm:text-lg">Inicio</span>
              <span className="absolute -bottom-1 left-12 h-[2px] w-0 bg-blue-500 transition-all duration-300 group-hover:w-20"></span>
            </button>

            <button
              onClick={() => scrollToSection("horario")}
              className="group relative flex items-center gap-3 w-full text-left px-3 sm:px-4 py-3 text-slate-700 font-medium transition-all duration-300 hover:text-blue-700 hover:bg-slate-50 cursor-pointer rounded-lg"
            >
              <ChefHat className="h-5 w-5 transition-colors duration-300 group-hover:text-blue-700" />
              <span className="text-base sm:text-lg">Horario</span>
              <span className="absolute -bottom-1 left-12 h-[2px] w-0 bg-blue-500 transition-all duration-300 group-hover:w-28"></span>
            </button>

            <button
              onClick={() => scrollToSection("galeria")}
              className="group relative flex items-center gap-3 w-full text-left px-3 sm:px-4 py-3 text-slate-700 font-medium transition-all duration-300 hover:text-blue-700 hover:bg-slate-50 cursor-pointer rounded-lg"
            >
              <Images className="h-5 w-5 transition-colors duration-300 group-hover:text-blue-700" />
              <span className="text-base sm:text-lg">Nuestro Espacio</span>
              <span className="absolute -bottom-1 left-12 h-[2px] w-0 bg-blue-500 transition-all duration-300 group-hover:w-20"></span>
            </button>

            <button
              onClick={() => scrollToSection("platos")}
              className="group relative flex items-center gap-3 w-full text-left px-3 sm:px-4 py-3 text-slate-700 font-medium transition-all duration-300 hover:text-blue-700 hover:bg-slate-50 cursor-pointer rounded-lg"
            >
              <CookingPot className="h-5 w-5 transition-colors duration-300 group-hover:text-blue-700" />
              <span className="text-base sm:text-lg">Nuestros Platos</span>
              <span className="absolute -bottom-1 left-12 h-[2px] w-0 bg-blue-500 transition-all duration-300 group-hover:w-28"></span>
            </button>

            <button
              onClick={() => scrollToSection("contacto")}
              className="group relative flex items-center gap-3 w-full text-left px-3 sm:px-4 py-3 text-slate-700 font-medium transition-all duration-300 hover:text-blue-700 hover:bg-slate-50 cursor-pointer rounded-lg"
            >
              <BadgeInfo className="h-5 w-5 transition-colors duration-300 group-hover:text-blue-700" />
              <span className="text-base sm:text-lg">Contacto</span>
              <span className="absolute -bottom-1 left-12 h-[2px] w-0 bg-blue-500 transition-all duration-300 group-hover:w-36"></span>
            </button>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 px-3 sm:px-4 pt-2">
              {/* <Button
                onClick={() => scrollToSection("cartaPDF")}
                className="flex-1 bg-blue-900 hover:bg-blue-700 text-white transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <UtensilsCrossed className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="ml-2 text-sm sm:text-base">Ver Carta</span>
              </Button> */}
              <Button
                onClick={makeCall}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <Phone className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="ml-2 text-sm sm:text-base">Llámanos Ahora</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}