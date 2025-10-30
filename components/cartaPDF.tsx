"use client"

import { Download } from "lucide-react"
import type React from "react"
import { motion } from "framer-motion"

interface CartaProps {
  pdfUrl: string
  title?: string
  description?: string
}

export const Carta: React.FC<CartaProps> = ({
  pdfUrl,
  title = "¡Nuestra Carta!",
  description = "Descubre todos nuestros platos deliciosos y especiales.",
}) => {
  return (
    <section
      id="cartaPDF"
      className="relative overflow-hidden py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-10 flex flex-col items-center bg-gradient-to-b from-blue-100 via-white to-blue-100"
    >
      {/* Efecto de fondo elegante */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15)_0%,transparent_70%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="relative z-10 max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl w-full text-center bg-white/80 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10 lg:p-12 border border-blue-200"
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-blue-900 mb-3 sm:mb-4 tracking-tight drop-shadow-sm leading-tight">
          {title}
        </h1>

        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-700 mb-6 sm:mb-8 md:mb-10 leading-relaxed px-2 sm:px-4">
          {description}
        </p>

        {/* Botón de descarga animado - Totalmente responsive */}
        <motion.a
          href={pdfUrl}
          download
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center justify-center gap-2 sm:gap-3 
            bg-gradient-to-r from-blue-800 to-blue-600 
            text-white font-semibold 
            px-6 sm:px-8 md:px-10 lg:px-12
            py-3 sm:py-3.5 md:py-4 
            text-sm sm:text-base md:text-lg
            rounded-full shadow-lg 
            transition-all duration-500 ease-out
            hover:shadow-blue-400/60 hover:shadow-xl hover:scale-105
            hover:bg-gradient-to-l hover:from-blue-700 hover:to-cyan-600
            hover:ring-2 hover:ring-blue-300/60 cursor-pointer
            w-full sm:w-auto max-w-xs sm:max-w-none"
        >
          <Download className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 flex-shrink-0" />
          <span className="truncate">Descargar Carta</span>
        </motion.a>
      </motion.div>

      {/* Reflejo inferior sutil */}
      <div className="absolute bottom-0 left-0 right-0 h-32 sm:h-40 bg-gradient-to-t from-blue-200/20 to-transparent" />
    </section>
  )
}
