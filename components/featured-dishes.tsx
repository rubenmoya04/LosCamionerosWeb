"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { UtensilsCrossed, Flame, PhoneCall, X, ChevronLeft, ChevronRight, Utensils } from "lucide-react"

interface Dish {
  id: number
  name: string
  description: string
  image: string
  badge: string
}

const getBadgeColor = (badge: string) => {
  const colors: Record<string, string> = {
    "Más vendido": "bg-gradient-to-r from-red-500 to-orange-500 text-white",
    Especialidad: "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
    Tradicional: "bg-gradient-to-r from-amber-500 to-yellow-500 text-white",
    Premium: "bg-gradient-to-r from-gray-800 to-gray-900 text-white",
    Postre: "bg-gradient-to-r from-pink-400 to-rose-400 text-white",
    Tapas: "bg-gradient-to-r from-lime-600 via-emerald-600 to-green-700 text-white shadow-md shadow-lime-800/30",
  }
  return colors[badge] || "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
}

export default function FeaturedDishes() {
  const [dishes, setDishes] = useState<Dish[]>([])
  const [loading, setLoading] = useState(true)
  const [visibleCards, setVisibleCards] = useState<number[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/adminCamioneros/dishes")
        if (res.ok) {
          const data = await res.json()
          setDishes(data.dishes || data)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => e?.isIntersecting && dishes.forEach((d, i) => setTimeout(() => setVisibleCards(p => [...p, d.id]), i * 100)),
      { threshold: 0.1 }
    )
    sectionRef.current && observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [dishes])

  const openModal = (i: number) => {
    setSelectedIndex(i)
    setIsModalOpen(true)
    document.body.style.overflow = "hidden"
  }

  const closeModal = () => {
    setIsModalOpen(false)
    document.body.style.overflow = ""
  }

  const goTo = (i: number) => {
    const normalized = ((i % dishes.length) + dishes.length) % dishes.length
    setSelectedIndex(normalized)
  }

  const prev = () => goTo(selectedIndex - 1)
  const next = () => goTo(selectedIndex + 1)

  // Swipe con inercia real y SIN AnimatePresence dentro del drag
  const handleDragEnd = (e: any, { offset, velocity }: { offset: { x: number }, velocity: { x: number } }) => {
    if (offset.x < -80 || velocity.x < -500) next()
    else if (offset.x > 80 || velocity.x > 500) prev()
  }

  if (loading) {
    return (
      <section className="py-24 bg-gradient-to-br from-blue-50 via-white to-emerald-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <UtensilsCrossed className="w-20 h-20 mx-auto mb-6 text-cyan-600 animate-pulse" />
          <h3 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
            Preparando nuestros platos...
          </h3>
        </div>
      </section>
    )
  }

  return (
    <>
      {/* === SECCIÓN PRINCIPAL === */}
      <section ref={sectionRef} className="py-16 lg:py-24 bg-gradient-to-br from-blue-50 via-white to-emerald-50" id="platos">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 relative overflow-hidden">
  {/* Fondo decorativo con gradiente radial */}
  <div className="absolute inset-0 bg-gradient-to-b from-blue-50/20 via-transparent to-transparent -z-10 rounded-3xl"></div>
  <div className="absolute inset-0 bg-gradient-radial from-cyan-100/10 via-transparent to-transparent -z-10"></div>
  
  {/* Icono principal con efectos mejorados */}
  <div className="flex justify-center mb-8">
    <div className="relative group">
      {/* Anillos concéntricos animados */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-emerald-500 blur-xl opacity-60 scale-110 group-hover:scale-125 transition-transform duration-500"></div>
      <div className="absolute inset-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 blur-lg opacity-40 scale-105 group-hover:scale-115 transition-transform duration-700"></div>
      
      {/* Círculo principal con efecto de brillo */}
      <div className="relative bg-gradient-to-br from-emerald-500 via-blue-500 to-cyan-600 p-8 rounded-full shadow-2xl transform transition-all duration-500 group-hover:scale-105 group-hover:rotate-3">
        {/* Efecto de brillo interno */}
        <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
        
        {/* Icono con animación sutil */}
        <motion.div
          animate={{ rotate: [0, 5, 0, -5, 0] }}
          transition={{ duration: 8, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
        >
          <UtensilsCrossed className="w-20 h-20 text-white drop-shadow-lg" />
        </motion.div>
      </div>
    </div>
  </div>
  
  {/* Título con efecto de escritura */}
  <div className="overflow-hidden mb-4">
    <motion.h2 
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="text-4xl sm:text-5xl lg:text-7xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-600 bg-clip-text text-transparent leading-tight"
    >
      Platos Destacados
    </motion.h2>
  </div>
  
  {/* Subtítulo con iconos animados */}
  <motion.div 
    initial={{ y: 30, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.8, delay: 0.4 }}
    className="flex items-center justify-center gap-4 mb-6"
  >
    <motion.div
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
    >
      <Flame className="w-10 h-10 text-orange-500 drop-shadow-md" />
    </motion.div>
    
    <div className="relative">
      <p className="text-2xl sm:text-3xl font-bold text-gray-800">Especialidades de la Casa</p>
      {/* Subrayado animado */}
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 1, delay: 0.8 }}
        className="absolute -bottom-1 left-0 h-1 bg-gradient-to-r from-orange-400 to-red-500 rounded-full"
      ></motion.div>
    </div>
    
    <motion.div
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 2, repeat: Infinity, repeatType: "loop", delay: 1 }}
    >
      <Flame className="w-10 h-10 text-orange-500 drop-shadow-md" />
    </motion.div>
  </motion.div>
  
  {/* Texto descriptivo añadido */}
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1, delay: 0.6 }}
    className="max-w-2xl mx-auto mb-8 px-4"
  >
    <p className="text-lg text-gray-600 leading-relaxed">
      Descubre nuestras creaciones culinarias, donde cada plato cuenta una historia de tradición, 
      pasión y los ingredientes más frescos del mercado. Una experiencia gastronómica que deleitará tus sentidos.
    </p>
  </motion.div>
  
  {/* Frase destacada con animación de aparición */}
  <motion.div 
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.8, delay: 0.8 }}
    className="inline-block mb-8"
  >
    <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-full px-6 py-3 border border-blue-200 shadow-md">
      <p className="text-blue-700 font-semibold text-lg">
        "El sabor que te transporta a los caminos de la tradición"
      </p>
    </div>
  </motion.div>
  
  {/* Línea decorativa con puntos y elementos animados */}
  <div className="flex justify-center items-center gap-2">
    <motion.div 
      initial={{ width: 0 }}
      animate={{ width: "4rem" }}
      transition={{ duration: 1, delay: 1 }}
      className="h-px bg-gradient-to-r from-transparent to-blue-300"
    ></motion.div>
    
    <div className="flex gap-1">
      {["bg-blue-400", "bg-cyan-400", "bg-emerald-400"].map((color, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 1 + i * 0.1 }}
          className={`w-2 h-2 ${color} rounded-full`}
        ></motion.div>
      ))}
    </div>
    
    <motion.div 
      initial={{ width: 0 }}
      animate={{ width: "4rem" }}
      transition={{ duration: 1, delay: 1 }}
      className="h-px bg-gradient-to-l from-transparent to-emerald-300"
    ></motion.div>
  </div>
</div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8" >
            {dishes.map((dish, i) => (
              <motion.div
                key={dish.id}
                initial={{ opacity: 0, y: 40 }}
                animate={visibleCards.includes(dish.id) ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                whileHover={{ y: -12 }}
                onClick={() => openModal(i)}
                className="group cursor-pointer"
              >
                <div className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100">
                  <div className="absolute top-4 left-4 z-10">
                    <span className={`px-4 py-2 rounded-full text-sm font-bold ${getBadgeColor(dish.badge)} shadow-lg`}>
                      {dish.badge}
                    </span>
                  </div>

                  <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                    <div className={`absolute inset-0 bg-gray-200 ${visibleCards.includes(dish.id) ? 'opacity-0' : 'opacity-100'} transition-opacity duration-1000`}>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                    </div>
                    <img
                      src={dish.image}
                      alt={dish.name}
                      onLoad={() => setVisibleCards(p => [...new Set([...p, dish.id])])}
                      onError={e => { e.currentTarget.src = "https://via.placeholder.com/800x600/1f2937/ffffff?text=DELICIOSO" }}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>

                  <div className="p-6 text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-cyan-600 transition-colors">
                      {dish.name}
                    </h3>
                    <p className="text-gray-600 line-clamp-3">{dish.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-20 text-center">
            <div className="inline-block bg-gradient-to-br from-teal-50 via-blue-50 to-cyan-100 rounded-3xl p-10 border border-cyan-200 shadow-2xl">
              <h3 className="text-4xl font-extrabold mb-6">¿Listo para probar?</h3>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <a href="tel:+34651509877" className="flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xl font-bold rounded-full hover:scale-110 transition-all shadow-xl">
                  <PhoneCall className="w-8 h-8" /> Llamar ahora
                </a>
                <a href="#platos" className="flex items-center justify-center gap-3 px-10 py-5 bg-white border-4 border-blue-600 text-blue-600 text-xl font-bold rounded-full hover:bg-blue-50 transition-all">
                  <Utensils className="w-8 h-8" /> Ver menú
                </a>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes shimmer {
            0% { transform: translateX(-150%) }
            100% { transform: translateX(150%) }
          }
          .animate-shimmer { animation: shimmer 2s infinite; }
          .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        `}</style>
      </section>

      {/* === MODAL QUE NUNCA PETARÁ === */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          {/* Imagen con swipe (sin AnimatePresence dentro del drag) */}
          <div className="flex-1 relative overflow-hidden">
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              className="w-full h-full cursor-grab active:cursor-grabbing"
              style={{ touchAction: "pan-y" }}
            >
              <motion.img
                key={selectedIndex}
                src={dishes[selectedIndex].image}
                alt={dishes[selectedIndex].name}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full object-contain pointer-events-none select-none"
                draggable={false}
              />
            </motion.div>

            {/* Controles */}
            <button onClick={closeModal} className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 backdrop-blur p-4 rounded-full transition">
              <X className="w-7 h-7 text-white" />
            </button>
            <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur p-4 rounded-full transition">
              <ChevronLeft className="w-8 h-8 text-white" />
            </button>
            <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur p-4 rounded-full transition">
              <ChevronRight className="w-8 h-8 text-white" />
            </button>

            {/* Indicadores */}
            <div className="absolute bottom-28 left-1/2 -translate-x-1/2 flex gap-2">
              {dishes.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === selectedIndex ? "bg-white w-10" : "bg-white/40 w-1.5"}`}
                />
              ))}
            </div>
          </div>

          {/* Info fija abajo */}
          <div className="bg-gradient-to-t from-black/95 via-black/70 to-transparent p-6 pt-24">
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex items-center justify-center gap-4 mb-3">
                <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${getBadgeColor(dishes[selectedIndex].badge)}`}>
                  {dishes[selectedIndex].badge}
                </span>
                <span className="text-white/70 text-sm font-medium">
                  {selectedIndex + 1} / {dishes.length}
                </span>
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">{dishes[selectedIndex].name}</h3>
              <p className="text-white/90 text-base leading-relaxed">{dishes[selectedIndex].description}</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}