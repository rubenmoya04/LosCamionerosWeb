"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { UtensilsCrossed, ChefHat, Flame, PhoneCall, Expand, X, ChevronLeft, ChevronRight, Utensils } from "lucide-react"

// Interfaz para los platos (debe coincidir con la del dashboard)
interface Dish {
  id: number;
  name: string;
  description: string;
  image: string;
  badge: string;
}

// Colores para las etiquetas (debe coincidir con el del dashboard)
const getBadgeColor = (badge: string) => {
  const colors: Record<string, string> = {
    "Más vendido": "bg-gradient-to-r from-red-500 to-orange-500 text-white",
    "Especialidad": "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
    "Tradicional": "bg-gradient-to-r from-amber-500 to-yellow-500 text-white",
    "Premium": "bg-gradient-to-r from-gray-800 to-gray-900 text-white",
    "Postre": "bg-gradient-to-r from-pink-400 to-rose-400 text-white",
    "Tapas": "bg-gradient-to-r from-lime-600 via-emerald-600 to-green-700 text-white shadow-md shadow-lime-800/30",
  }
  return colors[badge] || "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
}

export default function FeaturedDishes() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCards, setVisibleCards] = useState<number[]>([])
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const sectionRef = useRef<HTMLDivElement>(null)

  // Cargar los platos desde la API
  useEffect(() => {
    const loadDishes = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/adminCamioneros/dishes");
        if (response.ok) {
          const data = await response.json();
          setDishes(data.dishes || data);
        } else {
          console.error("Error cargando platos");
        }
      } catch (error) {
        console.error("Error loading dishes:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDishes();
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Forzamos que TODAS las cards se marquen como visibles al entrar en viewport
            dishes.forEach((dish, index) => {
              setTimeout(() => {
                setVisibleCards((prev) => [...prev, dish.id])
              }, index * 100)
            })
            observer.disconnect()
          }
        })
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [dishes])

  // Touch handlers
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

    if (isLeftSwipe && isImageModalOpen) navigateImage('next')
    if (isRightSwipe && isImageModalOpen) navigateImage('prev')
  }

  // Modal handlers
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
    setSelectedImageIndex((prev) =>
      direction === 'prev'
        ? (prev - 1 + dishes.length) % dishes.length
        : (prev + 1) % dishes.length
    )
  }

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isImageModalOpen) closeImageModal()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isImageModalOpen])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: isMobile ? 0.1 : 0.15, delayChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, type: "spring", stiffness: 100 },
    },
  }

  if (loading) {
    return (
      <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 bg-gradient-to-br from-blue-50 via-white to-emerald-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-emerald-500 rounded-full blur-lg opacity-70"></div>
                <div className="relative bg-gradient-to-r from-emerald-500 to-blue-500 p-4 rounded-full shadow-2xl">
                  <UtensilsCrossed className="w-12 h-12 text-white" />
                </div>
              </div>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-600 bg-clip-text text-transparent mb-4">
              Platos Destacados
            </h2>
            <div className="flex items-center justify-center gap-3 mb-4">
              <Flame className="w-7 h-7 text-orange-500" />
              <p className="text-xl font-bold text-gray-700">Especialidades de la Casa</p>
              <Flame className="w-7 h-7 text-orange-500" />
            </div>
          </div>
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </section>
    )
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="text-center mb-12 lg:mb-16"
          >
            <motion.div variants={itemVariants} className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-emerald-500 rounded-full blur-lg opacity-70"></div>
                <div className="relative bg-gradient-to-r from-emerald-500 to-blue-500 p-4 rounded-full shadow-2xl">
                  <UtensilsCrossed className="w-12 h-12 text-white" />
                </div>
              </div>
            </motion.div>

            <motion.h2 variants={itemVariants} className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-600 bg-clip-text text-transparent mb-4">
              Platos Destacados
            </motion.h2>

            <motion.div variants={itemVariants} className="flex items-center justify-center gap-3 mb-4">
              <Flame className="w-7 h-7 text-orange-500" />
              <p className="text-xl font-bold text-gray-700">Especialidades de la Casa</p>
              <Flame className="w-7 h-7 text-orange-500" />
            </motion.div>

            <motion.p variants={itemVariants} className="text-lg text-gray-600 max-w-3xl mx-auto">
              Descubre nuestra selección de especialidades preparadas con ingredientes frescos y recetas tradicionales.
              Cada plato es una obra de arte culinaria creada con pasión y dedicación.
            </motion.p>
          </motion.div>

          {/* Grid */}
          {dishes.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-600">No hay platos disponibles en este momento.</p>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10"
            >
              {dishes.map((dish, index) => (
                <motion.div
                  key={dish.id}
                  variants={itemVariants}
                  whileHover={{ scale: isMobile ? 1 : 1.03, y: isMobile ? 0 : -8 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  onMouseEnter={() => setHoveredCard(dish.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className="group"
                >
                  <div className="relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100">
                    {/* Badge */}
                    <div className="absolute top-4 left-4 z-20">
                      <span className={`px-3 py-1.5 rounded-full text-sm font-bold ${getBadgeColor(dish.badge)} shadow-lg`}>
                        {dish.badge}
                      </span>
                    </div>

                    {/* Expand icon desktop */}
                    <div className="hidden lg:block absolute top-4 right-4 z-20">
                      <button
                        onClick={() => openImageModal(index)}
                        className="bg-black/50 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all hover:bg-black/70"
                      >
                        <Expand className="w-5 h-5 text-white" />
                      </button>
                    </div>

                    {/* IMAGEN CORREGIDA - ESTA ES LA CLAVE */}
                    <div
                      className="relative w-full h-64 lg:h-80 overflow-hidden cursor-pointer"
                      onClick={() => openImageModal(index)}
                    >
                      {/* Skeleton con shimmer */}
                      <div className={`absolute inset-0 bg-gray-200 ${visibleCards.includes(dish.id) ? 'opacity-0' : 'opacity-100'} transition-opacity duration-700`}>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                      </div>

                      {/* Imagen real */}
                      <img
                        src={dish.image}
                        alt={dish.name}
                        loading="eager"
                        onLoad={() => setVisibleCards(prev => [...new Set([...prev, dish.id])])}
                        onError={(e) => {
                          setVisibleCards(prev => [...new Set([...prev, dish.id])])
                          e.currentTarget.src = "https://via.placeholder.com/800x600/2d3748/ffffff?text=DELICIOSO"
                        }}
                        className={`w-full h-full object-cover transition-all duration-700 ${
                          visibleCards.includes(dish.id)
                            ? hoveredCard === dish.id && !isMobile
                              ? 'scale-110'
                              : 'scale-100'
                            : 'scale-95 opacity-0'
                        }`}
                      />

                      {/* Overlay hover */}
                      {!isMobile && (
                        <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent transition-opacity duration-500 ${hoveredCard === dish.id ? 'opacity-100' : 'opacity-0'}`}>
                          <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 text-white">
                            <ChefHat className="w-6 h-6" />
                            <span className="text-lg font-semibold">Hecho con amor</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Texto */}
                    <div className="p-6 text-center">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-cyan-600 transition-colors">
                        {dish.name}
                      </h3>
                      <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                        {dish.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-20 text-center"
          >
            <div className="bg-gradient-to-br from-teal-50 via-blue-50 to-cyan-100 rounded-3xl p-10 max-w-4xl mx-auto border border-cyan-200 shadow-2xl">
              <h3 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-6">
                ¿Te apetece probar algo delicioso hoy?
              </h3>
              <p className="text-gray-600 text-lg mb-8">
                Llámanos y reserva tu mesa o haz tu pedido para recoger. ¡Estaremos encantados de atenderte!
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <a
                  href="tel:+34651509877"
                  className="flex items-center justify-center gap-3 px-12 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-lg font-bold rounded-full hover:from-blue-600 hover:to-cyan-700 transition-all hover:scale-105 shadow-xl"
                >
                  <PhoneCall className="w-7 h-7" />
                  Llámanos ahora
                </a>
                <a
                  href="#platos"
                  className="flex items-center justify-center gap-3 px-12 py-5 bg-white border-2 border-blue-500 text-blue-700 text-lg font-bold rounded-full hover:bg-blue-50 transition-all hover:scale-105"
                >
                  <Utensils className="w-7 h-7" />
                  Ver menú completo
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        <style jsx>{`
          @keyframes shimmer {
            0% { transform: translateX(-100%) }
            100% { transform: translateX(100%) }
          }
          .animate-shimmer {
            animation: shimmer 2s infinite linear;
          }
          .line-clamp-3 {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `}</style>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {isImageModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={closeImageModal}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-5xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={dishes[selectedImageIndex].image}
                alt={dishes[selectedImageIndex].name}
                className="w-full h-auto max-h-[85vh] object-contain rounded-2xl"
              />

              {/* Controles */}
              <button
                onClick={() => navigateImage('prev')}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur p-3 rounded-full"
              >
                <ChevronLeft className="w-8 h-8 text-white" />
              </button>
              <button
                onClick={() => navigateImage('next')}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur p-3 rounded-full"
              >
                <ChevronRight className="w-8 h-8 text-white" />
              </button>
              <button
                onClick={closeImageModal}
                className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 p-3 rounded-full"
              >
                <X className="w-8 h-8 text-white" />
              </button>

              {/* Info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-8 rounded-b-2xl">
                <div className="flex items-center gap-4 mb-4">
                  <h3 className="text-3xl font-bold text-white">
                    {dishes[selectedImageIndex].name}
                  </h3>
                  <span className={`px-4 py-2 rounded-full text-lg font-bold ${getBadgeColor(dishes[selectedImageIndex].badge)}`}>
                    {dishes[selectedImageIndex].badge}
                  </span>
                </div>
                <p className="text-white/90 text-lg max-w-4xl">
                  {dishes[selectedImageIndex].description}
                </p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-white/70">
                    {selectedImageIndex + 1} / {dishes.length}
                  </span>
                  <div className="flex gap-2">
                    {dishes.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedImageIndex(i)}
                        className={`h-2 rounded-full transition-all ${
                          i === selectedImageIndex ? 'bg-white w-8' : 'bg-white/50 w-2'
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