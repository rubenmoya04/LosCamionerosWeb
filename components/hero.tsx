"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { AuroraBackground } from "@/components/ui/aurora-background"
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient"
import Image from "next/image"
import GradientText from "./GradientText"
import { Utensils, Phone, Star, ArrowRight, Sparkles } from "lucide-react"
import Balatro from "./Balatro"

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentWordIndex, setCurrentWordIndex] = useState(0)

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

  const makeReservationCall = () => {
    window.location.href = "tel:+34651509877"
  }

  const words = ["delicioso", "acogedor", "familiar", "auténtico", "sabroso"]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        type: "spring",
        stiffness: 100,
      },
    },
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-sky-100 via-blue-200 to-indigo-300">
      {/* Destellos blancos animados */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-white/20 rounded-full blur-2xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-48 h-48 bg-white/15 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        <motion.div
          className="absolute bottom-32 left-1/4 w-40 h-40 bg-white/25 rounded-full blur-2xl"
          animate={{
            x: [0, 120, 0],
            y: [0, -40, 0],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
        />
      </div>

      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 overflow-hidden" id="hero">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="relative w-full max-w-4xl lg:max-w-6xl text-center z-10"
        >
          {/* Logo con mejor espaciado */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center mb-8 sm:mb-10 lg:mb-12"
          >
            <motion.div className="relative">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur-xl opacity-40"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.4, 0.5, 0.4],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <Image
                src="logoCamioneros.svg"
                alt="Logo Los Camioneros"
                width={400}
                height={400}
                className="m-auto relative z-10 w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 lg:w-44 lg:h-44 drop-shadow-2xl filter transition-transform duration-300 hover:scale-105"
              />
            </motion.div>
          </motion.div>

          {/* Título con mejor jerarquía visual */}
          <motion.div
            variants={itemVariants}
            className="mb-6 sm:mb-8 lg:mb-10"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-black/80 mb-3 sm:mb-4 leading-tight drop-shadow-lg">
              <motion.span
                className="block"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                Te damos la bienvenida a @
              </motion.span>
              <motion.div
                className="block mt-2 sm:mt-3"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                <GradientText
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
                  colors={['#1e3a8a', '#1e40af', '#2563eb', '#1e3a8a']}
                  animationSpeed={4}
                >
                  Los Camioneros
                </GradientText>
              </motion.div>
            </h1>
          </motion.div>

          {/* Subtítulo con mejor legibilidad */}
          <motion.p
            variants={itemVariants}
className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#394258] mb-6 sm:mb-8 lg:mb-10 max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto leading-relaxed px-3 sm:px-4 py-2 sm:py-3 drop-shadow-md bg-white/70 backdrop-blur-md rounded-lg sm:rounded-xl shadow-lg border border-blue-100"
          >
            Un lugar{" "}
            <motion.span
              className="inline-block text-[#44657a] font-bold drop-shadow-lg"
              key={currentWordIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {words[currentWordIndex]}
            </motion.span>{" "}
            para disfrutar cada día
          </motion.p>

          {/* Botones con mejor espaciado y diseño */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 justify-center items-center px-4 sm:px-6 mb-12 sm:mb-16 lg:mb-20"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="w-full sm:w-auto max-w-xs sm:max-w-none"
            >
              <HoverBorderGradient
                containerClassName="rounded-full"
                as="button"
                onClick={scrollToPlatos}
                className="bg-[#4e68ae] backdrop-blur-sm text-white px-8 cursor-pointer py-4 sm:px-10 sm:py-5 lg:px-12 lg:py-6 text-base sm:text-lg lg:text-xl font-semibold transition-all duration-300 hover:bg-[#354779] hover:shadow-2xl flex items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto min-h-[52px] sm:min-h-[56px] lg:min-h-[64px] rounded-full"
              >
                <Utensils className="w-5 h-5 sm:w-6 sm:h-6" />
                <span>Ver Menú</span>
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </HoverBorderGradient>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="w-full sm:w-auto max-w-xs sm:max-w-none"
            >
              <Button
                variant="outline"
                onClick={makeReservationCall}
                className="w-full sm:w-auto border-2 border-green-600 bg-[#56bb60] backdrop-blur-sm text-white hover:bg-[#51cf5d] hover:text-white  px-8 py-4 sm:px-10 sm:py-5 lg:px-12 lg:py-6 text-base sm:text-lg lg:text-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 sm:gap-4 hover:shadow-2xl min-h-[52px] sm:min-h-[56px] lg:min-h-[64px] rounded-full"
              >
                <Phone className="w-5 h-5 sm:w-6 sm:h-6" />
                <span>Llamar Ahora</span>
              </Button>
            </motion.div>
          </motion.div>

          {/* Indicadores de confianza con mejor diseño responsive */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 lg:gap-8 text-blue-900 px-4"
          >
            <motion.div
              className="flex items-center gap-3 px-4 py-3 sm:px-6 sm:py-4 rounded-xl bg-white/80 backdrop-blur-md border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto justify-center sm:justify-start"
              whileHover={{
                scale: 1.05,
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                y: -2
              }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 fill-yellow-500" />
              <span className="text-sm sm:text-base lg:text-lg font-medium">4.8★ Valoración</span>
            </motion.div>

            <motion.div
              className="flex items-center gap-3 px-4 py-3 sm:px-6 sm:py-4 rounded-xl bg-white/80 backdrop-blur-md border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto justify-center sm:justify-start"
              whileHover={{
                scale: 1.05,
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                y: -2
              }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Utensils className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              <span className="text-sm sm:text-base lg:text-lg font-medium">50+ Años</span>
            </motion.div>

            <motion.div
              className="flex items-center gap-3 px-4 py-3 sm:px-6 sm:py-4 rounded-xl bg-white/80 backdrop-blur-md border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto justify-center sm:justify-start"
              whileHover={{
                scale: 1.05,
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                y: -2
              }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              <span className="text-sm sm:text-base lg:text-lg font-medium">Cocina Artesanal</span>
            </motion.div>
          </motion.div>

          {/* Espaciado adicional para evitar que se pegue con el contenido siguiente */}
          <div className="h-16 sm:h-20 lg:h-24" />
        </motion.div>
      </section>
<div className="w-full h-[3px] bg-gradient-to-r from-white-500 via-black/50 to-white-500" />
    </div>
  )
}