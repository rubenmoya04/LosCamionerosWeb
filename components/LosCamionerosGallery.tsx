"use client"

import React, { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, ThumbsUp , UtensilsCrossed, Heart, Camera, ChevronLeft, ChevronRight, Quote, X,MessageSquare,ExternalLink } from "lucide-react"

export default function LosCamionerosGallery() {
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const galleryRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const testimonialsRef = useRef<HTMLDivElement>(null)

  const galleryImages = [
    {
      src: "/FotosBar/FotoBar1.png",
      title: "Los Camioneros Rubi",
      description: "Disfruta de un ambiente rústico y acogedor",
      badge: "Principal"
    },
    {
      src: "/FotosBar/FotoBar2.jpg",
      title: "Rincon Familiar",
      description: "Donde las historias y las buenas bebidas se encuentran",
      badge: "Popular"
    },
    {
      src: "/FotosBar/FotoBar3.jpg",
      title: "Espacio Acogedor",
      description: "El lugar perfecto para compartir nuestra comida casera",
      badge: "Favorito"
    },
    {
      src: "/FotosBar/FotosBar4.jpg",
      title: "",
      description: "",
      badge: "Favorito"
    }
  ]

  const features = [
    {
      icon: <UtensilsCrossed className="w-6 h-6" />,
      title: "Comida Casera",
      description: "Platos tradicionales con el sabor de siempre",
      color: "from-blue-400 to-cyan-500",
      stat: "50+ Años",
      mobileStat: "50+ Años"
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Ambiente Familiar",
      description: "Un lugar donde todos se sienten en casa",
      color: "from-pink-400 to-rose-500",
      stat: "4.8★ Valoración",
      mobileStat: "4.8★"
    },
  ]

  const testimonials = [
    {
      name: "Juan Martínez",
      text: "El mejor sitio para comer después de una larga jornada. La comida es casera y el trato inmejorable.",
      rating: 5,
      role: "Local"
    },
    {
      name: "María López",
      text: "Ambiente familiar y precios increíbles. Mi familia y yo venimos todos los fines de semana.",
      rating: 5,
      role: "Cliente Fiel"
    },
    {
      name: "Carlos Rodríguez",
      text: "Las mejores tapas de la zona. El personal es increíble y siempre te atienden con una sonrisa.",
      rating: 5,
      role: "Local"
    }
  ]

  // Detectar dispositivo móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    setIsVisible(true)

    // Auto-rotate testimonials - más lento en móvil
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, isMobile ? 6000 : 5000)

    return () => clearInterval(interval)
  }, [testimonials.length, isMobile])

  useEffect(() => {
    const observers = [
      { ref: galleryRef, delay: isMobile ? 100 : 200 },
      { ref: featuresRef, delay: isMobile ? 200 : 400 },
      { ref: testimonialsRef, delay: isMobile ? 300 : 600 }
    ]

    const observerInstances = observers.map(({ ref, delay }) => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setTimeout(() => {
                entry.target.classList.add('animate-in')
              }, delay)
              observer.unobserve(entry.target)
            }
          })
        },
        { threshold: isMobile ? 0.05 : 0.1 }
      )

      if (ref.current) {
        observer.observe(ref.current)
      }

      return observer
    })

    return () => {
      observerInstances.forEach(observer => observer.disconnect())
    }
  }, [isMobile])

  // Touch handlers para testimonios en móvil
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

    if (isLeftSwipe) {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }
    if (isRightSwipe) {
      setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    }
  }

  // Modal handlers
  const openImageModal = (index: number) => {
    setSelectedImageIndex(index)
    setIsImageModalOpen(true)
  }

  const closeImageModal = () => {
    setIsImageModalOpen(false)
  }

  const navigateImage = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setSelectedImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)
    } else {
      setSelectedImageIndex((prev) => (prev + 1) % galleryImages.length)
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
      {/* Gallery Carousel Section */}
            <div className="w-full h-[3px] bg-gradient-to-r from-white-500 via-black/50 to-white-500" />

      <section
        ref={galleryRef}
        className="relative py-12 sm:py-16 md:py-20 lg:py-32 opacity-0 transition-opacity duration-1000 "
        id="galeria"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 relative z-10">
          {/* Header con animación - responsive */}
          <motion.div
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            variants={containerVariants}
            className="text-center mb-8 sm:mb-12 md:mb-16"
          >
            <motion.div variants={itemVariants} className="flex items-center justify-center mb-4 sm:mb-6 mt-[-30px]">
              <div className="relative">
                <div className="absolute -inset-1 sm:-inset-2 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full blur-lg opacity-50 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-cyan-500 to-blue-400 p-3 sm:p-4 rounded-full shadow-2xl">
                  <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
              </div>
            </motion.div>

            <motion.h2
              variants={itemVariants}
              className="
                text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-6xl
                font-extrabold
                bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-600
                bg-clip-text text-transparent
                mb-8 sm:mb-10
                leading-tight sm:leading-snug md:leading-snug
                tracking-tight
                transition-transform duration-300 ease-out
                hover:scale-105
                cursor-default
              "
            >
              Nuestro Espacio
            </motion.h2>
          </motion.div>

          {/* Carousel mejorado - responsive */}
          <motion.div
            variants={itemVariants}
            className="max-w-6xl mx-auto"
          >
            {/* Mobile Gallery - Grid Layout */}
            {isMobile ? (
              <div className="space-y-6">
                {galleryImages.map((image, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => openImageModal(index)}
                    className="cursor-pointer"
                  >
                    <Card className="border-0 shadow-xl overflow-hidden group">
                      <CardContent className="p-0">
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <img
                            src={image.src}
                            alt={image.title}
                            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                          {/* Badge */}
                          <div className="absolute top-3 left-3">
                            <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1 text-xs font-bold shadow-lg">
                              {image.badge}
                            </Badge>
                          </div>

                          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                            <h3 className="text-lg font-bold mb-2">{image.title}</h3>
                            <p className="text-sm text-blue-100">{image.description}</p>
                          </div>

                          {/* Overlay para indicar que es clickable */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                            <Camera className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              /* Desktop Carousel */
              <Carousel className="w-full group">
                <CarouselContent>
                  {galleryImages.map((image, index) => (
                    <CarouselItem key={index}>
                      <Card className="border-0 shadow-xl sm:shadow-2xl overflow-hidden group/item cursor-pointer" onClick={() => openImageModal(index)}>
                        <CardContent className="p-0">
                          <div className="relative aspect-video overflow-hidden">
                            <img
                              src={image.src}
                              alt={image.title}
                              className="w-full h-full object-cover transition-all duration-700 group-hover/item:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                            {/* Badge - responsive */}
                            <div className="absolute top-2 sm:top-4 left-2 sm:left-4">
                              <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-bold shadow-lg">
                                {image.badge}
                              </Badge>
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 text-white">
                              <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3">{image.title}</h3>
                              <p className="text-sm sm:text-base md:text-lg text-blue-100">{image.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>

                {/* Botones de navegación mejorados - responsive */}
                <CarouselPrevious className="left-2 sm:left-4 bg-white/90 hover:bg-white border border-blue-200 text-blue-600 shadow-xl group-hover:opacity-100 transition-all duration-300 hover:scale-110 backdrop-blur-sm rounded-full w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center">
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </CarouselPrevious>
                <CarouselNext className="right-2 sm:right-4 bg-white/90 hover:bg-white border border-blue-200 text-blue-600 shadow-xl  group-hover:opacity-100 transition-all duration-300 hover:scale-110 backdrop-blur-sm rounded-full w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center">
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </CarouselNext>
              </Carousel>
            )}
          </motion.div>
        </div>
      </section>

      {/* Image Modal */}
      <AnimatePresence>
        {isImageModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={closeImageModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={galleryImages[selectedImageIndex].src}
                alt={galleryImages[selectedImageIndex].title}
                className="w-full h-full object-contain rounded-lg"
              />
              
              {/* Navigation buttons */}
              <button
                onClick={() => navigateImage('prev')}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-sm transition-all duration-300"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => navigateImage('next')}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-sm transition-all duration-300"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              
              {/* Close button */}
              <button
                onClick={closeImageModal}
                className="absolute top-2 right-2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-sm transition-all duration-300"
              >
                <X className="w-6 h-6" />
              </button>
              
              {/* Image info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 rounded-b-lg">
                <h3 className="text-white text-lg font-bold">{galleryImages[selectedImageIndex].title}</h3>
                <p className="text-white/80 text-sm">{galleryImages[selectedImageIndex].description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Features Section - responsive */}
      <section
        ref={featuresRef}
        className="relative py-12 sm:py-16 md:py-20 lg:py-32 opacity-0 transition-opacity duration-1000"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 relative z-10">
          <motion.div
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            variants={containerVariants}
            className="text-center mb-8 sm:mb-12 md:mb-16"
          >
            <motion.div variants={itemVariants} className="flex items-center justify-center mb-4 sm:mb-6">
              <div className="relative">
                <div className="absolute -inset-1 sm:-inset-2 bg-gradient-to-r from-blue-400 to-emerald-500 rounded-full blur-lg opacity-50 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-emerald-500 to-blue-400 p-3 sm:p-4 rounded-full shadow-2xl">
                  <ThumbsUp  className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
              </div>
            </motion.div>

            <motion.h2
              variants={itemVariants}
              className="
                text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-6xl
                font-extrabold
                bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-600
                bg-clip-text text-transparent
                mb-8 sm:mb-10
                leading-tight sm:leading-snug md:leading-snug
                tracking-tight
                transition-transform duration-300 ease-out
                hover:scale-105
                cursor-default
              "
            >
              ¿Por Qué Elegirnos?
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4 mt-8 font-bold"
            >
              Dos razones que nos hacen únicos
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{
                  scale: isMobile ? 1.02 : 1.05,
                  y: isMobile ? -5 : -10
                }}
                transition={{ type: "spring", stiffness: 400 }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <Card className={`
                  relative overflow-hidden border-0 
                  bg-white/80 backdrop-blur-sm
                  shadow-lg sm:shadow-xl hover:shadow-2xl
                  transition-all duration-700 ease-out
                  group cursor-pointer
                  ${hoveredCard === index ? 'scale-105 -translate-y-2' : 'hover:scale-102 hover:-translate-y-1'}
                `}>
                  {/* Efecto de fondo animado mejorado */}
                  <div className={`
                    absolute inset-0 bg-gradient-to-br ${feature.color} 
                    opacity-0 group-hover:opacity-15 
                    transition-all duration-700 ease-out
                    group-hover:scale-110
                  `}></div>
                  
                  {/* Patrón decorativo de fondo */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-transparent to-current transform rotate-45 translate-x-16 -translate-y-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-transparent to-current transform -rotate-45 -translate-x-12 translate-y-12"></div>
                  </div>

                  {/* Línea decorativa superior */}
                  <div className={`
                    absolute top-0 left-0 right-0 h-1 
                    bg-gradient-to-r ${feature.color}
                    transform scale-x-0 group-hover:scale-x-100 
                    transition-transform duration-700 ease-out
                    origin-left
                  `}></div>

                  {/* Contenido principal */}
                  <div className="relative z-10 p-6 sm:p-8 md:p-10">
                    {/* Icono con efectos mejorados */}
                    <div className={`
                      relative mx-auto mb-6 sm:mb-8
                      transform transition-all duration-700 ease-out
                      group-hover:scale-110 group-hover:rotate-6
                    `}>
                      {/* Anillo exterior animado */}
                      <div className={`
                        absolute inset-0 w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28
                        bg-gradient-to-r ${feature.color}
                        rounded-full opacity-20
                        group-hover:opacity-30
                        group-hover:scale-125
                        transition-all duration-700 ease-out
                        animate-pulse
                      `}></div>
                      
                      {/* Círculo principal */}
                      <div className={`
                        relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24
                        bg-gradient-to-r ${feature.color}
                        rounded-full flex items-center justify-center
                        shadow-xl group-hover:shadow-2xl
                        transition-all duration-700 ease-out
                        group-hover:shadow-${feature.color.split('-')[1]}/50
                      `}>
                        <div className="text-white transform transition-transform duration-700 group-hover:scale-110">
                          {feature.icon}
                        </div>
                      </div>
                      
                      {/* Partículas flotantes */}
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white rounded-full opacity-40 group-hover:opacity-80 transition-opacity duration-300 delay-100"></div>
                    </div>

                    {/* Contenido de texto */}
                    <div className="text-center space-y-3 sm:space-y-4">
                      <h3 className={`
                        text-xl sm:text-2xl md:text-3xl font-bold 
                        bg-gradient-to-r ${feature.color}
                        bg-clip-text text-transparent
                        transition-all duration-700 ease-out
                        group-hover:scale-105
                      `}>
                        {feature.title}
                      </h3>
                      
                      <div className={`
                        inline-flex items-center justify-center
                        px-4 py-2 sm:px-6 sm:py-3
                        bg-gradient-to-r ${feature.color}
                        text-white font-bold
                        text-sm sm:text-base md:text-lg
                        rounded-full
                        shadow-lg group-hover:shadow-xl
                        transition-all duration-700 ease-out
                        group-hover:scale-105 group-hover:-translate-y-1
                      `}>
                        {isMobile ? feature.mobileStat : feature.stat}
                      </div>
                      
                      <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed max-w-sm mx-auto">
                        {feature.description}
                      </p>
                    </div>
                  </div>

                  {/* Efecto de brillo mejorado */}
                  <div className={`
                    absolute inset-0 
                    bg-gradient-to-tr from-transparent via-white/30 to-transparent
                    transform -skew-x-12 -translate-x-full
                    group-hover:translate-x-full
                    transition-transform duration-1000 ease-out
                    pointer-events-none
                  `}></div>

                  {/* Efecto de bordes brillantes */}
                  <div className={`
                    absolute inset-0 rounded-lg
                    bg-gradient-to-r ${feature.color}
                    opacity-0 group-hover:opacity-20
                    transition-opacity duration-700 ease-out
                    -z-10 blur-sm
                  `}></div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <div className="w-full h-[2px] bg-gradient-to-r from-white-500 via-black/30 to-white-500" />


      {/* Testimonials Section - responsive */}
      <section
        ref={testimonialsRef}
        className="relative py-12 sm:py-16 md:py-20 lg:py-32 opacity-0 transition-opacity duration-1000 bg-gradient-to-br from-blue-50/40 via-cyan-50/30 to-emerald-50/40 backdrop-blur-sm"
      >
        {/* Efectos de fondo decorativos sutiles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-5 w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full bg-gradient-to-tr from-blue-200/20 to-cyan-200/20 blur-2xl animate-float-slow"></div>
          <div className="absolute top-20 right-8 w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-full bg-gradient-to-tr from-emerald-200/20 to-cyan-200/20 blur-2xl animate-float"></div>
          <div className="absolute bottom-10 left-1/3 w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 rounded-full bg-gradient-to-tr from-cyan-200/15 to-blue-200/15 blur-2xl animate-float-delay"></div>
        </div>

        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 relative z-10">
          <motion.div
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            variants={containerVariants}
            className="text-center mb-8 sm:mb-12 md:mb-16"
          >
            <motion.div variants={itemVariants} className="flex items-center justify-center mb-4 sm:mb-6">
              <div className="relative">
                <div className="absolute -inset-1 sm:-inset-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-lg opacity-50 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-orange-500 to-yellow-400 p-3 sm:p-4 rounded-full shadow-2xl">
                  <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
              </div>
            </motion.div>

            <motion.h2
              variants={itemVariants}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-600 bg-clip-text text-transparent mb-4 sm:mb-6"
            >
              Lo Que Dicen Nuestros Clientes
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4"
            >
              Las voces de quienes nos visitan cada día
            </motion.p>
          </motion.div>

          {/* Testimonial Carousel - responsive con touch */}
          <div className="max-w-4xl mx-auto">
            <div
              className="relative"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="p-6 sm:p-8 md:p-8 lg:p-12 border border-blue-100/50 shadow-xl bg-gradient-to-br from-white/80 to-blue-50/60 backdrop-blur-md">
                    <div className="flex justify-center mb-4 sm:mb-6">
                      {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-yellow-400 fill-current" />
                      ))}
                    </div>

                    <p className="text-gray-700 text-base sm:text-lg md:text-xl mb-6 sm:mb-8 italic text-center leading-relaxed px-2">
                      "{testimonials[currentTestimonial].text}"
                    </p>

                    <div className="text-center">
                      <p className="font-bold text-blue-600 text-base sm:text-lg md:text-xl">{testimonials[currentTestimonial].name}</p>
                      <p className="text-gray-500 text-sm sm:text-base">{testimonials[currentTestimonial].role}</p>
                    </div>
                  </Card>
                </motion.div>
              </AnimatePresence>

              {/* Indicadores - responsive */}
              <div className="flex justify-center mt-6 sm:mt-8 space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`h-2 sm:h-3 rounded-full transition-all duration-300 ${index === currentTestimonial
                        ? 'bg-blue-600 w-6 sm:w-8'
                        : 'bg-gray-300 hover:bg-gray-400 w-2 sm:w-3'
                      }`}
                    aria-label={`Testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Botón de Dejar Reseña */}
          <motion.div
            variants={itemVariants}
            className="mt-8 sm:mt-12 md:mt-16 text-center"
          >
            <div className="bg-gradient-to-r from-white/60 to-blue-50/60 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 max-w-md sm:max-w-lg mx-auto border border-blue-100/50 shadow-lg">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full blur-lg opacity-30 animate-pulse"></div>
                  <div className="relative bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-full shadow-lg">
                    <MessageSquare className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                </div>
                
                <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                  ¿Ya has compartido tu experiencia?
                </h3>
                
                <p className="text-sm sm:text-base text-gray-600 text-center max-w-xs ">
                  Tu opinión nos ayuda a mejorar y a otros clientes a conocernos
                </p>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.open('https://search.google.com/local/writereview?placeid=ChIJn1tZB26RpBIR7IhVCB9-AxY', '_blank')}
                  className="cursor-pointer flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Star className="w-5 h-5 fill-yellow-300 text-yellow-300" />
                  <span>Dejanos una reseña</span>
                  <ExternalLink className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>

      
      </section>


<div className="w-full h-[3px] bg-gradient-to-r from-white-500 via-black/30 to-white-500" />
                

      <style jsx>{`
      @keyframes float {
            0% { transform: translateY(0) translateX(0); }
            25% { transform: translateY(-10px) translateX(5px); }
            50% { transform: translateY(5px) translateX(-5px); }
            75% { transform: translateY(-5px) translateX(3px); }
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
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animate-in {
          opacity: 1 !important;
        }
      `}</style>
    </>
  )
}
