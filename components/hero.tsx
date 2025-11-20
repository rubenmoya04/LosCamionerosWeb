"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Utensils, Phone, Star, ArrowRight, Sparkles, PartyPopper, Clock, MapPin } from "lucide-react"

// Componente de texto con gradiente, ahora optimizado sin animaciones pesadas
function GradientText({ children, className = "" }) {
  return (
    <span className={`bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent ${className}`}>
      {children}
    </span>
  )
}

export default function Hero() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  const words = ["delicioso", "acogedor", "familiar", "auténtico", "sabroso"]

  useEffect(() => {
    setIsLoaded(true) // Marca el componente como cargado para la animación de entrada
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % words.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  const callNow = () => window.location.href = "tel:+34651509877"

  const actions = [
    { label: "Ver Platos", icon: Utensils, section: "platos" },
    { label: "Ver Horario", icon: Clock, section: "horario" },
    { label: "Ver Ubicación", icon: MapPin, section: "ubicación" },
  ]

  const badges = [
    { icon: Star, text: "4.8 ★ Valoración", color: "text-yellow-500", fill: true },
    { icon: PartyPopper, text: "50+ Años de experiencia", color: "text-orange-600" },
    { icon: Sparkles, text: "Cocina Artesanal", color: "text-purple-600" },
    { icon: Utensils, text: "Menú diario · Mar-Vie", color: "text-blue-600", bold: true },
  ]

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-blue-50 overflow-hidden">
      {/* Fondo animado con CSS (más ligero que Framer Motion) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      <section className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className={`text-center max-w-5xl lg:max-w-7xl mx-auto w-full transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          {/* Logo con responsive sizes */}
          <div className="relative inline-block mb-8 sm:mb-12">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full blur-3xl opacity-30 scale-110"></div>
            <Image
              src="/logoCamioneros.svg"
              alt="Los Camioneros"
              width={400}
              height={400}
              className="relative z-10 w-32 h-32 sm:w-48 sm:h-48 lg:w-60 lg:h-60 drop-shadow-2xl transition-transform duration-500 hover:scale-105"
              priority
              sizes="(max-width: 640px) 128px, (max-width: 1024px) 192px, 240px"
            />
          </div>

          {/* Título con responsive font sizes */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-slate-900 mb-4 sm:mb-6 leading-tight">
            <span className="block">Te damos la bienvenida a</span>
            <GradientText className="mt-2 sm:mt-4 block">
              Los Camioneros
            </GradientText>
          </h1>

          {/* Subtítulo rotativo */}
          <p className="text-lg sm:text-xl md:text-2xl text-slate-600 font-medium mb-12 sm:mb-16 max-w-3xl mx-auto">
            Un lugar{" "}
            <span className="inline-block font-bold text-blue-600 min-w-[100px] transition-all duration-500 ease-in-out">
              {words[currentWordIndex]}
            </span>{" "}
            para disfrutar cada día
          </p>

          {/* Botones con layout responsive (1 col mobile, 2 col tablet, fila desktop) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-row gap-4 justify-center items-center mb-16 sm:mb-20">
            {actions.map((action) => (
              <Button
                key={action.label}
                onClick={() => scrollTo(action.section)}
                className="bg-white text-slate-800 border-2 border-slate-200 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 hover:shadow-lg px-6 py-6 text-base sm:text-lg font-bold rounded-full flex items-center justify-center gap-3 transition-all duration-300"
              >
                <action.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                <span>{action.label}</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            ))}

            <Button
              onClick={callNow}
              className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-500 hover:to-emerald-600 text-white px-6 py-6 text-base sm:text-lg font-bold rounded-full flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Phone className="w-5 h-5 sm:w-6 sm:h-6" />
              Llamar Ahora
            </Button>
          </div>

          {/* Badges con responsive grid y espaciado mejorado */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {badges.map((item) => (
              <div
                key={item.text}
                className="group flex flex-col items-center justify-center gap-3 bg-white/90 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-md border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <item.icon
                  className={`w-8 h-8 sm:w-10 sm:h-10 ${item.color} ${item.fill ? "fill-current" : ""} group-hover:scale-110 transition-transform duration-300`}
                />
                <p className={`text-center text-xs sm:text-sm font-semibold text-slate-800 ${item.bold ? "font-bold" : ""}`}>
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />

      {/* Estilos para las animaciones de fondo */}
      <style jsx>{`
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
          background: linear-gradient(to right, #60a5fa, #3b82f6);
          animation: float 20s infinite ease-in-out;
        }
        .blob-2 {
          bottom: -10%;
          right: -10%;
          width: 60%;
          height: 60%;
          background: linear-gradient(to right, #818cf8, #6366f1);
          animation: float 25s infinite ease-in-out reverse;
        }
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.05); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
        }
      `}</style>
    </div>
  )
}
