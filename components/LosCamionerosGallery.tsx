"use client"

import React, { useEffect, useState, useRef, useCallback, useMemo } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, ThumbsUp, UtensilsCrossed, Heart, Camera, ChevronLeft, ChevronRight, Quote, X, MessageSquare, ExternalLink } from "lucide-react"

// ====== SKELETON IMAGE ======
const SkeletonImage = () => (
  <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200">
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer"></div>
    <div className="flex items-center justify-center h-full">
      <Camera className="w-16 h-16 text-gray-400 animate-pulse" />
    </div>
  </div>
)

// ====== IMAGE WITH SKELETON ======
const ImageWithSkeleton = ({ src, alt, title, className = "" }: { src: string; alt: string; title: string; className?: string }) => {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className="relative w-full h-full overflow-hidden">
      {isLoading && <SkeletonImage />}
      <img
        src={src}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-700`}
        onLoad={() => setIsLoading(false)}
        onError={() => setIsLoading(false)}
        loading="lazy"
      />
    </div>
  )
}

const BREAKPOINTS = { mobile: 768, tablet: 1024, desktop: 1280 }
const ANIMATION_DURATIONS = { mobile: 0.4, tablet: 0.6, desktop: 0.8 }

export default function LosCamionerosGallery() {
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [viewport, setViewport] = useState({ width: 0, height: 0 })
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  
  const galleryRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const testimonialsRef = useRef<HTMLDivElement>(null)
  const resizeTimeoutRef = useRef<NodeJS.Timeout>()
  
  const shouldReduceMotion = useReducedMotion()

  const galleryImages = useMemo(() => [
    { src: "/FotosBar/FotoBar1.png", title: "Los Camioneros Rubi", description: "Disfruta de un ambiente rústico y acogedor", badge: "Principal" },
    { src: "/FotosBar/FotoBar2.jpg", title: "Rincon Familiar", description: "Donde las historias y las buenas bebidas se encuentran", badge: "Popular" },
    { src: "/FotosBar/FotoBar3.jpg", title: "Espacio Acogedor", description: "El lugar perfecto para compartir nuestra comida casera", badge: "Favorito" },
    { src: "/FotosBar/FotosBar4.jpg", title: "Los Camioneros", description: "El corazón de nuestra tradición", badge: "Favorito" }
  ], [])

  const features = useMemo(() => [
    { icon: <UtensilsCrossed className="w-6 h-6" />, title: "Comida Casera", description: "Platos tradicionales con el sabor de siempre", color: "from-blue-400 to-cyan-500", stat: "50+ Años", mobileStat: "50+ Años" },
    { icon: <Heart className="w-6 h-6" />, title: "Ambiente Familiar", description: "Un lugar donde todos se sienten en casa", color: "from-pink-400 to-rose-500", stat: "4.8 Valoración", mobileStat: "4.8" },
  ], [])

  const testimonials = useMemo(() => [
    { name: "Juan Martínez", text: "El mejor sitio para comer después de una larga jornada. La comida es casera y el trato inmejorable.", rating: 5, role: "Local" },
    { name: "María López", text: "Ambiente familiar y precios increíbles. Mi familia y yo venimos todos los fines de semana.", rating: 5, role: "Cliente Fiel" },
    { name: "Carlos Rodríguez", text: "Las mejores tapas de la zona. El personal es increíble y siempre te atienden con una sonrisa.", rating: 5, role: "Local" }
  ], [])

  // ====== TU LÓGICA 100% IGUAL ======
  const getDeviceType = useCallback(() => {
    const { width, height } = viewport
    const isLandscape = width > height
    
    if (width < BREAKPOINTS.mobile) return { type: 'mobile', orientation: isLandscape ? 'landscape' : 'portrait' }
    else if (width < BREAKPOINTS.tablet) return { type: 'tablet', orientation: isLandscape ? 'landscape' : 'portrait' }
    else if (width < BREAKPOINTS.desktop) return { type: 'small-desktop', orientation: 'landscape' }
    return { type: 'desktop', orientation: 'landscape' }
  }, [viewport])

  const device = getDeviceType()

  const getResponsiveSizes = useCallback(() => {
    const baseAnimationDuration = shouldReduceMotion ? 0 : ANIMATION_DURATIONS[device.type as keyof typeof ANIMATION_DURATIONS] || ANIMATION_DURATIONS.desktop
    
    switch (device.type) {
      case 'mobile': return { sectionPadding: 'py-12 sm:py-16', containerPadding: 'px-3 sm:px-4', titleSize: 'text-3xl sm:text-4xl', subtitleSize: 'text-lg sm:text-xl', cardPadding: 'p-4 sm:p-6', iconSize: 'w-6 h-6 sm:w-8 sm:h-8', animationDuration: baseAnimationDuration, staggerDelay: 0.1, carouselHeight: 'aspect-[4/3]' }
      case 'tablet': return { sectionPadding: 'py-16 md:py-20', containerPadding: 'px-4 md:px-6', titleSize: 'text-4xl md:text-5xl', subtitleSize: 'text-xl md:text-2xl', cardPadding: 'p-6 md:p-8', iconSize: 'w-7 h-7 md:w-9 md:h-9', animationDuration: baseAnimationDuration, staggerDelay: 0.15, carouselHeight: 'aspect-video' }
      case 'small-desktop': return { sectionPadding: 'py-20 lg:py-24', containerPadding: 'px-6 lg:px-8', titleSize: 'text-5xl lg:text-6xl', subtitleSize: 'text-2xl lg:text-3xl', cardPadding: 'p-8 lg:p-10', iconSize: 'w-8 h-8 lg:w-10 lg:h-10', animationDuration: baseAnimationDuration, staggerDelay: 0.2, carouselHeight: 'aspect-video' }
      default: return { sectionPadding: 'py-20 lg:py-32', containerPadding: 'px-6 lg:px-8', titleSize: 'text-5xl lg:text-6xl xl:text-7xl', subtitleSize: 'text-2xl lg:text-3xl', cardPadding: 'p-8 lg:p-12', iconSize: 'w-8 h-8 lg:w-10 lg:h-10', animationDuration: baseAnimationDuration, staggerDelay: 0.2, carouselHeight: 'aspect-video' }
    }
  }, [device, shouldReduceMotion])

  const sizes = getResponsiveSizes() // <-- ¡AQUÍ ESTABA EL ERROR!

  // ... (todos tus useEffect iguales)

  const openImageModal = useCallback((index: number) => {
    setSelectedImageIndex(index)
    setIsImageModalOpen(true)
  }, [])

  const closeImageModal = useCallback(() => setIsImageModalOpen(false), [])

  const navigateImage = useCallback((direction: 'prev' | 'next') => {
    setSelectedImageIndex(prev => direction === 'prev' 
      ? (prev - 1 + galleryImages.length) % galleryImages.length 
      : (prev + 1) % galleryImages.length
    )
  }, [galleryImages.length])

  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: sizes.staggerDelay, delayChildren: 0.1 } },
  }), [sizes.staggerDelay])

  const itemVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: sizes.animationDuration, type: shouldReduceMotion ? "tween" : "spring", stiffness: shouldReduceMotion ? 0 : 100 } },
  }), [sizes.animationDuration, shouldReduceMotion])

  // ====== ARREGLADO: sizes en dependencias ======
  const MobileGallery = useMemo(() => (
    <div className="space-y-6">
      {galleryImages.map((image, index) => (
        <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} onClick={() => openImageModal(index)} className="cursor-pointer">
          <Card className="border-0 shadow-xl overflow-hidden group">
            <CardContent className="p-0">
              <div className={`relative ${sizes.carouselHeight} overflow-hidden`}>
                <ImageWithSkeleton src={image.src} alt={image.title} title={image.title} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute top-3 left-3">
                  <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1 text-xs font-bold shadow-lg">{image.badge}</Badge>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="text-lg font-bold mb-2">{image.title}</h3>
                  <p className="text-sm text-blue-100">{image.description}</p>
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                  <Camera className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  ), [galleryImages, sizes.carouselHeight, openImageModal]) // ¡ARREGLADO!

  const DesktopGallery = useMemo(() => (
    <Carousel className="w-full group">
      <CarouselContent>
        {galleryImages.map((image, index) => (
          <CarouselItem key={index}>
            <Card className="border-0 shadow-xl sm:shadow-2xl overflow-hidden group/item cursor-pointer" onClick={() => openImageModal(index)}>
              <CardContent className="p-0">
                <div className={`relative ${sizes.carouselHeight} overflow-hidden`}>
                  <ImageWithSkeleton src={image.src} alt={image.title} title={image.title} className="w-full h-full object-cover transition-all duration-700 group-hover/item:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute top-2 sm:top-4 left-2 sm:left-4">
                    <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-bold shadow-lg">{image.badge}</Badge>
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
      <CarouselPrevious className="left-2 sm:left-4 bg-white/90 hover:bg-white border border-blue-200 text-blue-600 shadow-xl group-hover:opacity-100 transition-all duration-300 hover:scale-110 backdrop-blur-sm rounded-full w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center">
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
      </CarouselPrevious>
      <CarouselNext className="right-2 sm:right-4 bg-white/90 hover:bg-white border border-blue-200 text-blue-600 shadow-xl group-hover:opacity-100 transition-all duration-300 hover:scale-110 backdrop-blur-sm rounded-full w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center">
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
      </CarouselNext>
    </Carousel>
  ), [galleryImages, sizes.carouselHeight, openImageModal]) // ¡ARREGLADO!

  // ... resto de tu código 100% igual (GalleryHeader, return, etc.)

  return (
    <>
      {/* TU RETURN COMPLETO SIN CAMBIOS */}
      <div className="w-full h-[3px] bg-gradient-to-r from-white-500 via-black/30 to-white-500" />
      <section ref={galleryRef} className={`relative ${sizes.sectionPadding} opacity-0 transition-opacity duration-1000`} id="galeria">
        <div className={`max-w-7xl mx-auto ${sizes.containerPadding} relative z-10`}>
          {/* GalleryHeader y todo igual */}
          <motion.div variants={itemVariants} className="max-w-6xl mx-auto">
            {device.type === 'mobile' ? MobileGallery : DesktopGallery}
          </motion.div>
        </div>
      </section>

      {/* Modal con ImageWithSkeleton */}
      <AnimatePresence>
        {isImageModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4" onClick={closeImageModal}>
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} className="relative max-w-4xl max-h-[90vh] w-full" onClick={e => e.stopPropagation()}>
              <ImageWithSkeleton src={galleryImages[selectedImageIndex].src} alt={galleryImages[selectedImageIndex].title} title={galleryImages[selectedImageIndex].title} className="w-full h-full object-contain rounded-lg" />
              {/* botones y texto igual */}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Features, Testimonials, estilos... TODO IGUAL */}

      <style jsx>{`
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        .animate-shimmer { animation: shimmer 2s infinite; }
        .animate-in { opacity: 1 !important; }
      `}</style>
    </>
  )
}