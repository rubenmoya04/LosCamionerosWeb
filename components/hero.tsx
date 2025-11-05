"use client"

import { useEffect, useState, useMemo } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient"
import Image from "next/image"
import GradientText from "./GradientText"
import { Utensils, Phone, Star, ArrowRight, Sparkles, PartyPopper, Clock10 } from "lucide-react"

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    setIsVisible(true)

    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % 5)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const scrollToPlatos = () => {
    const element = document.getElementById("platos")
    if (element) element.scrollIntoView({ behavior: "smooth" })
  }


  const scrollToHorario = () => {
    const element = document.getElementById("horario")
    if (element) element.scrollIntoView({ behavior: "smooth" })
  }

  const makeReservationCall = () => {
    window.location.href = "tel:+34651509877"
  }

  const words = useMemo(() => ["delicioso", "acogedor", "familiar", "auténtico", "sabroso"], [])

  // Optimizar variantes para reducir complejidad
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
        delayChildren: 0.2,
      },
    },
  }), [shouldReduceMotion])

  const itemVariants = useMemo(() => ({
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.6,
        type: shouldReduceMotion ? "tween" : "spring",
        stiffness: shouldReduceMotion ? undefined : 100,
      },
    },
  }), [shouldReduceMotion])

  // Simplificar animaciones de fondo si se prefiere reducir movimiento
  const backgroundAnimations = shouldReduceMotion ? {} : {
    animate: {
      opacity: [0.3, 0.5, 0.3],
    },
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-sky-100 via-blue-200 to-indigo-300 overflow-hidden">
      {/* Fondo simplificado - menos elementos animados */}
      <div className="absolute inset-0 overflow-hidden">
        {!shouldReduceMotion && (
          <>
            <motion.div
              className="absolute top-20 left-10 w-32 h-32 bg-white/20 rounded-full blur-2xl"
              {...backgroundAnimations}
            />
            <motion.div
              className="absolute top-40 right-20 w-48 h-48 bg-white/15 rounded-full blur-3xl"
              animate={{
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
            />
          </>
        )}
      </div>

      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 overflow-hidden" id="hero">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="relative w-full max-w-4xl lg:max-w-6xl text-center z-10"
        >
          {/* Logo optimizado */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center mb-8 sm:mb-10 lg:mb-12"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur-xl opacity-30" />
              <Image
                src="logoCamioneros.svg"
                alt="Logo Los Camioneros"
                width={400}
                height={400}
                className="m-auto relative z-10 w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 lg:w-44 lg:h-44 drop-shadow-2xl filter transition-transform duration-300"
                priority
                loading="eager"
              />
            </div>
          </motion.div>

          {/* Título optimizado */}
          <motion.div
            variants={itemVariants}
            className="mb-6 sm:mb-8 lg:mb-10"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-black/80 mb-3 sm:mb-4 leading-tight drop-shadow-lg">
              <motion.span
                className="block"
                initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                Te damos la bienvenida a
              </motion.span>
              <motion.div
                className="block mt-2 sm:mt-3"
                initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <GradientText
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
                  colors={['#1e3a8a', '#1e40af', '#2563eb', '#1e3a8a']}
                  animationSpeed={shouldReduceMotion ? 0 : 4}
                >
                  Los Camioneros
                </GradientText>
              </motion.div>
            </h1>
          </motion.div>

          {/* Subtítulo optimizado */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#394258] mb-6 sm:mb-8 lg:mb-10 max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto leading-relaxed px-3 sm:px-4 py-2 sm:py-3 drop-shadow-md bg-white/70 backdrop-blur-md rounded-lg sm:rounded-xl shadow-lg border border-blue-100"
          >
            <span className="inline-flex items-center flex-wrap justify-center gap-1">
              <span>Un lugar</span>
              <motion.span
                className="inline-block text-[#44657a] font-bold drop-shadow-lg min-w-[80px] text-center"
                key={currentWordIndex}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {words[currentWordIndex]}
              </motion.span>
              <span>para disfrutar cada día</span>
            </span>
          </motion.p>

          {/* Botones optimizados - sin hover scale en móvil */}
          <motion.div
  variants={itemVariants}
  className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 justify-center items-center px-4 sm:px-6 mb-12 sm:mb-16 lg:mb-20"
>
  {/* Botón Ver Platos */}
  <div className="w-full sm:w-auto max-w-xs sm:max-w-none">
    <HoverBorderGradient
      containerClassName="rounded-full"
      as="button"
      onClick={scrollToPlatos}
      className="bg-gradient-to-r cursor-pointer from-[#4e68ae] via-[#3a5580] to-[#2d4471] text-white px-8 py-4 sm:px-10 sm:py-5 lg:px-12 lg:py-6 text-base sm:text-lg lg:text-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4e68ae] flex items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto min-h-[52px] sm:min-h-[56px] lg:min-h-[64px] rounded-full"
    >
      <Utensils className="w-5 h-5 sm:w-6 sm:h-6" />
      <span>Ver Platos</span>
      <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
    </HoverBorderGradient>
  </div>

  {/* Botón Ver Horario */}
  <div className="w-full sm:w-auto max-w-xs sm:max-w-none">
    <HoverBorderGradient
      containerClassName="rounded-full"
      as="button"
      onClick={scrollToHorario}
      className="bg-gradient-to-r cursor-pointer from-[#22a3ac] via-[#1d8c8b] to-[#1a7472] text-white px-8 py-4 sm:px-10 sm:py-5 lg:px-12 lg:py-6 text-base sm:text-lg lg:text-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#22a3ac] flex items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto min-h-[52px] sm:min-h-[56px] lg:min-h-[64px] rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#22a3ac]"
    >
      <Clock10  className="w-5 h-5 sm:w-6 sm:h-6" />
      <span>Ver Horario</span>
      <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
    </HoverBorderGradient>
  </div>

  {/* Botón Llamar Ahora */}
  <div className="w-full sm:w-auto max-w-xs sm:max-w-none">
    <Button
      variant="outline"
      onClick={makeReservationCall}
      className="w-full sm:w-auto border-2 cursor-pointer border-green-600 bg-gradient-to-r from-[#56bb60] via-[#4f9f4b] to-[#3d7e3d] text-white hover:bg-gradient-to-r hover:from-[#51cf5d] hover:to-[#38c57e] hover:text-white px-8 py-4 sm:px-10 sm:py-5 lg:px-12 lg:py-6 text-base sm:text-lg lg:text-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 sm:gap-4 hover:shadow-2xl min-h-[52px] sm:min-h-[56px] lg:min-h-[64px] rounded-full"
    >
      <Phone className="w-5 h-5 sm:w-6 sm:h-6" />
      <span>Llamar Ahora</span>
    </Button>
  </div>
</motion.div>


          {/* Indicadores optimizados - sin hover scale */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 lg:gap-8 text-blue-900 px-4"
          >
            <div className="flex items-center gap-3 px-4 py-3 sm:px-6 sm:py-4 rounded-xl bg-white/80 backdrop-blur-md border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto justify-center sm:justify-start">
              <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 fill-yellow-500" />
              <span className="text-sm sm:text-base lg:text-lg font-medium">4.8 ★ Valoración</span>
            </div>

            <div className="flex items-center gap-3 px-4 py-3 sm:px-6 sm:py-4 rounded-xl bg-white/80 backdrop-blur-md border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto justify-center sm:justify-start">
              <PartyPopper className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
              <span className="text-sm sm:text-base lg:text-lg font-medium">50+ Años</span>
            </div>

            <div className="flex items-center gap-3 px-4 py-3 sm:px-6 sm:py-4 rounded-xl bg-white/80 backdrop-blur-md border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto justify-center sm:justify-start">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              <span className="text-sm sm:text-base lg:text-lg font-medium">Cocina Artesanal</span>
            </div>

            <div className="flex items-center gap-3 px-4 py-3 sm:px-6 sm:py-4 rounded-xl bg-white/80 backdrop-blur-md border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto justify-center sm:justify-start">
              <Utensils className="w-5 h-5 sm:w-6 sm:h-6 text-blue-900" />
              <span className=" text-sm sm:text-base lg:text-lg font-medium">Menú diario: <span className="font-bold">Martes - Viernes</span></span>
            </div>
          </motion.div>

          {/* Espaciado adicional */}
          <div className="h-16 sm:h-20 lg:h-24" />
        </motion.div>
      </section>
      <div className="w-full h-[3px] bg-gradient-to-r from-white-500 via-black/50 to-white-500" />
    </div>
  )
}