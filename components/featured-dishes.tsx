"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { UtensilsCrossed, ChefHat, Flame, PhoneCall, Expand, X, ChevronLeft, ChevronRight } from "lucide-react"

const dishes = [
  {
    id: 1,
    name: "Pincho camionero",
    description: "Exquisito pincho elaborado con los mejores ingredientes de nuestra tierra, una combinación perfecta de sabores que representa el alma de nuestra cocina tradicional",
    image: "/FotosBar/PinchoCamionero.png",
    badge: "Más vendido",
  },
  {
    id: 2,
    name: "Pulpo a la gallega",
    description: "Auténtico pulpo gallego cocido a la perfección, servido sobre cama de patatas gallegas y regado con nuestro aceite de oliva virgen extra",
    image: "/FotosBar/PulpoGallega.png",
    badge: "Tradicional",
  },
  {
    id: 3,
    name: "Especial Camioneros",
    description: "Espectacular mariscada con medio bogavante, sepia, calamarcitos, navajas, almejas gallegas, mejillones y gambas a la plancha, acompañada de nuestro pan de ajo casero",
    image: "/FotosBar/Mariscada.png",
    badge: "Especialidad",
  },
  {
    id: 4,
    name: "Secreto Ibérico a la brasa",
    description: "Jugoso corte de cerdo ibérico de bellota, cocinado lentamente a la brasa con leña, acompañado de patatas fritas caseras",
    image: "/FotosBar/Brasa.png",
    badge: "Premium",
  },
  {
    id: 5,
    name: "Tarta de queso",
    description: "Deliciosa tarta de queso cremoso con base de galleta artesanal y coulis de fresas frescas, el postre perfecto para cerrar cualquier comida",
    image: "/FotosBar/TartaQueso.png",
    badge: "Postre",
  },
  {
    id: 6,
    name: "Chuletón a la brasa",
    description: "Premium corte de carne seleccionado cuidadosamente, cocinado a la brasa tradicional con leña natural, servido con patatas fritas caseras y pimientos del padrón",
    image: "/FotosBar/Carne.png",
    badge: "Premium",
  },
  {
    id: 7,
    name: "Manitas de cerdo",
    description: "Manitas de cerdo tiernas, cocinadas a la perfección con un acabado dorado y sabroso, acompañadas de patatas y perejil fresco.",
    image: "/FotosBar/ManitasCerdo.png",
    badge: "Tradicional",
  },
  {
    id: 8,
    name: "Lubina con berenjena",
    description: "Fresca lubina cocinada a la plancha en el momento, acompañada de berenjena asada y un toque de aceite de oliva virgen extra",
    image: "/FotosBar/Lubina2.png",
    badge: "Tradicional",
  },
  {
    id: 9,
    name: "Plato combinado de sepia",
    description: "Sepia fresca, cocinada a la plancha con su punto perfecto, servida con guarnición de patatas fritas caseras y ensalada fresca",
    image: "/FotosBar/SepiaPlato.png",
    badge: "Especialidad",
  },
  {
    id: 10,
    name: "Plato de jamón",
    description: "Excepcional jamón ibérico de bellota, cortado a mano por nuestro maestro cortador",
    image: "/FotosBar/PlatoJamón.png",
    badge: "Especialidad",
  },
  {
    id: 11,
    name: "Tortilla de patatas",
    description: "La especialidad de la casa: jugosa tortilla de patatas, dorada y casera.",
    image: "/FotosBar/TortillaPatata.png",
    badge: "Especialidad",
  },
  {
    id: 12,
    name: "Coulant con bola de chocolate",
    description: "Un coulant con bola de chocolate, el postre perfecto para cerrar cualquier comida",
    image: "/FotosBar/Bizcocho.png",
    badge: "Postre",
  },
  {
    id: 13,
    name: "Sepia con gambas rojas",
    description: "Sepia fresca, cocinada a la plancha con su punto perfecto, servida con gambas rojas a la plancha",
    image: "/FotosBar/SepiaGamba.png",
    badge: "Tradicional",
  },
  {
    id: 14,
    name: "Almejas",
    description: "Almejas frescas, cocinadas a la plancha con su punto perfecto",
    image: "/FotosBar/Almejas.png",
    badge: "Tradicional",
  }
];

export default function FeaturedDishes() {
  const [visibleCards, setVisibleCards] = useState<number[]>([])
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            dishes.forEach((dish, index) => {
              setTimeout(() => {
                setVisibleCards((prev) => [...prev, dish.id])
              }, index * 150)
            })
            observer.disconnect()
          }
        })
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Touch handlers para swipe en móvil
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe && isImageModalOpen) {
      navigateImage('next')
    }
    if (isRightSwipe && isImageModalOpen) {
      navigateImage('prev')
    }
  }

  // Modal handlers - SIN ANIMACIONES DE SCALE
  const openImageModal = (index: number) => {
    setSelectedImageIndex(index)
    setIsImageModalOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const closeImageModal = () => {
    setIsImageModalOpen(false)
    document.body.style.overflow = 'unset'
  }

  const navigateImage = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setSelectedImageIndex((prev) => (prev - 1 + dishes.length) % dishes.length)
    } else {
      setSelectedImageIndex((prev) => (prev + 1) % dishes.length)
    }
  }

  // Cerrar modal con Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isImageModalOpen) {
        closeImageModal()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isImageModalOpen])

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "Más vendido":
        return "bg-gradient-to-r from-red-500 to-orange-500 text-white"
      case "Especialidad":
        return "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
      case "Tradicional":
        return "bg-gradient-to-r from-amber-500 to-yellow-500 text-white"
      case "Premium":
        return "bg-gradient-to-r from-gray-800 to-gray-900 text-white"
      case "Postre":
        return "bg-gradient-to-r from-pink-400 to-rose-400 text-white"
      case "Saludable":
        return "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
      default:
        return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: isMobile ? 0.1 : 0.2,
        delayChildren: isMobile ? 0.1 : 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: isMobile ? 20 : 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: isMobile ? 0.6 : 0.8,
        type: "spring",
        stiffness: 100,
      },
    },
  }

  return (
    <>
      <section
        id="platos"
        ref={sectionRef}
        className="relative py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 bg-gradient-to-br from-blue-50 via-white to-emerald-50 overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Efectos de fondo decorativos - SIN MOVIMIENTOS QUE CAUSEN ZOOM */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[28rem] lg:h-[28rem] rounded-full bg-gradient-to-tr from-blue-300 via-blue-200 to-cyan-300 mix-blend-multiply filter blur-3xl opacity-30" />
          <div className="absolute top-32 right-16 w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-[26rem] lg:h-[26rem] rounded-full bg-gradient-to-tr from-emerald-300 via-green-200 to-cyan-300 mix-blend-multiply filter blur-3xl opacity-25" />
          <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-72 h-72 sm:w-96 sm:h-96 md:w-[24rem] md:h-[24rem] lg:w-[30rem] lg:h-[30rem] rounded-full bg-gradient-to-tr from-cyan-200 via-blue-100 to-emerald-200 mix-blend-multiply filter blur-3xl opacity-20" />
        </div>

        <div className="max-w-6xl sm:max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 relative z-10">
          {/* Header mejorado con animaciones */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16"
          >
            <motion.div variants={itemVariants} className="flex items-center justify-center mb-4 sm:mb-6">
              <div className="relative">
                <div className="absolute -inset-1 sm:-inset-2 bg-gradient-to-r from-blue-400 to-emerald-500 rounded-full blur-lg opacity-50"></div>
                <div className="relative bg-gradient-to-r from-emerald-500 to-blue-400 p-2 sm:p-3 md:p-4 rounded-full shadow-2xl">
                  <UtensilsCrossed className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-11 lg:w-12 lg:h-12 text-white" />
                </div>
              </div>
            </motion.div>

            <motion.h2
              variants={itemVariants}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-600 bg-clip-text text-transparent mb-4 sm:mb-6 leading-tight"
            >
              Platos Destacados
            </motion.h2>

            <motion.div variants={itemVariants} className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <Flame className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:w-7 lg:w-7 lg:h-7 text-orange-500" />
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 font-medium font-bold">
                Especialidades de la Casa
              </p>
              <Flame className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:w-7 lg:w-7 lg:h-7 text-orange-500" />
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl sm:max-w-3xl mx-auto leading-relaxed px-3 sm:px-4"
            >
              Descubre nuestra selección de especialidades preparadas con ingredientes frescos y recetas tradicionales.
              Cada plato es una obra de arte culinaria creada con pasión y dedicación.
            </motion.p>
          </motion.div>

          {/* Grid de platos mejorado - SIN HOVER SCALE EN MÓVIL */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10"
          >
            {dishes.map((dish, index) => (
              <motion.div
                key={dish.id}
                variants={itemVariants}
                whileHover={{
                  scale: isMobile ? 1 : 1.02, // REDUCIDO DE 1.05 A 1.02
                  y: isMobile ? 0 : -5 // REDUCIDO DE -10 A -5
                }}
                transition={{ type: "spring", stiffness: 300 }} // REDUCIDO STIFFNESS
                onMouseEnter={() => setHoveredCard(dish.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="group relative bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg sm:shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100">
                  {/* Badge */}
                  <div className="absolute top-2 sm:top-3 md:top-4 left-2 sm:left-3 md:left-4 z-20">
                    <span className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-bold ${getBadgeColor(dish.badge)} shadow-lg`}>
                      {dish.badge}
                    </span>
                  </div>

                  {/* Icono de expansión - Solo visible en desktop */}
                  <div className="hidden lg:block absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4 z-20">
                    <div
                      className="bg-black/50 backdrop-blur-sm rounded-full p-1.5 sm:p-2 md:p-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer hover:bg-black/70"
                      onClick={() => openImageModal(index)}
                      role="button"
                      tabIndex={0}
                      aria-label={`Ver imagen grande de ${dish.name}`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          openImageModal(index)
                        }
                      }}
                    >
                      <Expand className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
                    </div>
                  </div>

                  {/* Imagen clicable - SIN SCALE EN MÓVIL */}
                  <div
                    className="relative w-full h-48 sm:h-56 md:h-64 lg:h-72 overflow-hidden cursor-pointer"
                    onClick={() => openImageModal(index)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Ver imagen grande de ${dish.name}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        openImageModal(index)
                      }
                    }}
                  >
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className={`w-full h-full object-cover transition-all duration-700 ${isMobile ? "scale-100" : hoveredCard === dish.id ? "scale-105" : "scale-100"}`} // REDUCIDO DE 1.10 A 1.05
                    />

                    {/* Overlay con efecto hover - Solo en desktop */}
                    {!isMobile && (
                      <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-500 ${hoveredCard === dish.id ? "opacity-100" : "opacity-0"}`}>
                        <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-2 sm:left-3 md:left-4 right-2 sm:right-3 md:right-4">
                          <div className="flex items-center gap-1 sm:gap-2 text-white">
                            <ChefHat className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                            <span className="text-xs sm:text-sm font-medium">Hecho con amor</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Efecto de brillo - Solo en desktop */}
                    {!isMobile && hoveredCard === dish.id && (
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full animate-shimmer"></div>
                    )}
                  </div>

                  {/* Contenido */}
                  <div className="p-3 sm:p-4 md:p-6">
                    <div className="flex flex-col items-center justify-center mb-3 sm:mb-4">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-serif font-bold text-gray-900 group-hover:text-cyan-600 transition-colors duration-300 relative">
                        {dish.name}
                        <span className="absolute left-0 bottom-0 w-0 h-1 bg-[#1DA1F2] transition-all duration-300 group-hover:w-full rounded"></span>
                      </h3>
                    </div>

                    <p className="text-gray-800 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed font-medium line-clamp-3">
                      {dish.description}
                    </p>
                  </div>

                  {/* Efecto de borde animado - Solo en desktop */}
                  {!isMobile && (
                    <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-blue-400 to-cyan-500 opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10"></div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Section */}
          <motion.div
            variants={itemVariants}
            className="mt-12 sm:mt-16 md:mt-20 text-center"
          >
            <div className="bg-gradient-to-r from-cyan-100 to-blue-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12 max-w-3xl sm:max-w-4xl mx-auto border border-blue-200">
              <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                ¿Listo para disfrutar de nuestras especialidades?
              </h3>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 justify-center items-center px-2 sm:px-0">
                <a
                  href="tel:+34651509877"
                  className="flex items-center gap-2 sm:gap-4 px-4 sm:px-8 md:px-12 py-2 sm:py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm sm:text-base md:text-lg lg:text-xl font-bold rounded-full shadow-lg hover:from-cyan-600 hover:to-blue-600 transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
                >
                  <PhoneCall className="w-4 h-4 sm:w-5 sm:h-6 md:w-6 lg:w-8" />
                  ¡Llámanos!
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        <style jsx>{`
          @keyframes float {
            0% { transform: translateY(0) translateX(0); }
            25% { transform: translateY(-15px) translateX(10px); }
            50% { transform: translateY(10px) translateX(-10px); }
            75% { transform: translateY(-5px) translateX(5px); }
            100% { transform: translateY(0) translateX(0); }
          }

          .animate-float {
            animation: float 8s ease-in-out infinite;
          }

          .animate-float-slow {
            animation: float 12s ease-in-out infinite;
          }

          .animate-float-delay {
            animation: float 10s ease-in-out 2s infinite;
          }

          .line-clamp-3 {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          @keyframes shimmer {
            0% {
              transform: translateX(-100%) skewX(-12deg);
            }
            100% {
              transform: translateX(200%) skewX(-12deg);
            }
          }
          
          .animate-shimmer {
            animation: shimmer 2s infinite;
          }
        `}</style>
      </section>

      {/* Modal de imágenes mejorado - SIN ANIMACIONES DE SCALE */}
      <AnimatePresence>
        {isImageModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4"
            onClick={closeImageModal}
          >
            <motion.div
              initial={{ opacity: 0 }} // ELIMINADO SCALE
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }} // ELIMINADO SCALE
              className="relative w-full h-full max-w-4xl max-h-[90vh] sm:max-h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={dishes[selectedImageIndex].image}
                  alt={dishes[selectedImageIndex].name}
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
              </div>

              {/* Botones de navegación - Visibles en móvil y desktop */}
              <button
                onClick={() => navigateImage('prev')}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-[#c2c2c2] hover:bg-white/30 text-white p-2 sm:p-3 rounded-full backdrop-blur-sm transition-all duration-300 active:scale-95 shadow-lg"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <button
                onClick={() => navigateImage('next')}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-[#c2c2c2] hover:bg-white/30 text-white p-2 sm:p-3 rounded-full backdrop-blur-sm transition-all duration-300 active:scale-95 shadow-lg"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              {/* Botón de cerrar */}
              <button
                onClick={closeImageModal}
                className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-red-500 hover:bg-red-600 text-white p-2 sm:p-3 rounded-full backdrop-blur-sm transition-all duration-300 active:scale-95 shadow-lg z-10"
              >
                <X className="w-7 h-7 sm:w-7 sm:h-7 md:w-7 md:h-7" />
              </button>

              {/* Título llamativo e información */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-4 sm:p-6 rounded-b-lg">
                {/* Badge y título principal */}
                <div className="flex flex-row items-center gap-4 mb-3">

                  {/* Título Principal */}
                  <h3 className="text-white text-lg sm:text-xl md:text-2xl font-bold text-left whitespace-nowrap">
                    {dishes[selectedImageIndex].name}
                  </h3>

                  {/* Badge */}
                  <span
                    className={`
        px-3 py-1 rounded-full text-xs sm:text-sm font-bold shadow-lg 
        ${getBadgeColor(dishes[selectedImageIndex].badge)}
      `}
                  >
                    {dishes[selectedImageIndex].badge}
                  </span>

                </div>

                {/* Descripción */}
                <p className="text-white/90 text-xs sm:text-sm text-center sm:text-left mb-4 line-clamp-2">
                  {dishes[selectedImageIndex].description}
                </p>

                {/* Contador de imágenes */}
                <div className="flex items-center justify-between">
                  <div className="text-white/70 text-xs sm:text-sm">
                    {selectedImageIndex + 1} de {dishes.length}
                  </div>

                  {/* Indicadores de navegación */}
                  <div className="flex items-center gap-2">
                    {dishes.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${index === selectedImageIndex
                          ? 'bg-white w-6 sm:w-8 shadow-lg'
                          : 'bg-white/50 hover:bg-white/70 w-1.5 sm:w-2'
                          }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}