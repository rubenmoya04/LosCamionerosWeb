"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Calendar,
  Navigation,
  Instagram,
  Facebook,
  Wine ,
  ChevronRight,
  Sparkles,
  Lock ,
  Globe,
  ChefHat,
  Utensils,
  ExternalLink
} from "lucide-react"
import GradientText from "./GradientText"

// Types
interface ContactInfo {
  icon: React.ComponentType<{ className?: string }>
  label: string
  content: string
  href: string
  color: string
}

interface ScheduleItem {
  days: string
  hours: string[]
  icon: string
  color: string
}

interface SocialLink {
  icon: React.ComponentType<{ className?: string }>
  href: string
  label: string
}

// Data
const contactInfo: ContactInfo[] = [
  {
    icon: MapPin,
    label: "Dirección",
    content: "Carrer Bartrina 12, 08191 Rubí, Cataluña, España",
    href: "https://maps.app.goo.gl/MfwBqNPvrtw3jeyT9",
    color: "from-blue-400 to-cyan-700"
  },
  {
    icon: Phone,
    label: "Teléfono",
    content: "+34 651 50 98 77",
    href: "tel:+34651509877",
    color: "from-green-400 to-emerald-700"
  },
  {
    icon: Mail,
    label: "Email",
    content: "loscamioneros.rubi@gmail.com",
    href: "mailto:loscamioneros.rubi@gmail.com",
    color: "from-purple-400 to-pink-700"
  }
]

const schedule: ScheduleItem[] = [
  {
    days: "Martes - Viernes",
    hours: ["7:00 - 16:30"],
    icon: <ChefHat />,
    color: "from-blue-600 to-[#b346e5]"
  },
  {
    days: "Viernes y Sábados",
    hours: ["7:00 - 16:30", "20:00 - 23:30"],
    icon: <Wine />,
    color: "from-[#d655cb] to-[#ba1567]"
  },
  {
    days: "Domingo y Lunes",
    hours: ["Cerrado"],
    icon: <Lock />,
    color: "from-[#ff2626] to-[#d15909]"
  }
]

const socialLinks: SocialLink[] = [
  { icon: Instagram, href: "https://www.instagram.com/loscamionerosrubi", label: "Instagram" },
  { icon: Facebook, href: "https://www.facebook.com/share/1A4tKngTFw/", label: "Facebook" }

]

// Custom hook for hover states
const useHoverStates = () => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  return {
    hoveredItem,
    setHoveredItem,
    isHovered: (item: string) => hoveredItem === item
  }
}

// Animated Background Component - Responsive bubbles
const AnimatedBackground: React.FC = () => {
  const bubbles = [
    { top: "0%", left: "25%", delay: 0 },
    { bottom: "0%", right: "25%", delay: 2 },
    { top: "50%", left: "50%", delay: 4 }
  ]

  return (
    <div className="absolute inset-0 overflow-hidden">
      {bubbles.map((bubble, index) => (
        <motion.div
          key={index}
          className="absolute w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"
          style={{
            [bubble.top !== undefined ? "top" : "bottom"]: bubble.top ?? bubble.bottom,
            [bubble.left !== undefined ? "left" : "right"]: bubble.left ?? bubble.right,
            transform: "translate(-50%, -50%)"
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: bubble.delay,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  )
}

// Contact Card Component - Fully responsive
const ContactCard: React.FC<{
  item: ContactInfo;
  isHovered: boolean;
  onHover: (label: string) => void;
  onLeave: () => void;
}> = ({ item, isHovered, onHover, onLeave }) => {
  const IconComponent = item.icon

  return (
    <motion.a
      href={item.href}
      className="group flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-800/50 hover:bg-slate-700/50 transition-all duration-300"
      onMouseEnter={() => onHover(item.label)}
      onMouseLeave={onLeave}
      whileHover={{ scale: 1.02, x: 3 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div
        className={`relative w-8 h-8 sm:w-10 sm:h-12 bg-gradient-to-br ${item.color} rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg`}
      >
        <IconComponent
          className={`text-white ${item.label === "Email" ? "w-10 h-5 sm:w-14 sm:h-7" : "w-4 h-4 sm:w-6 sm:h-6"}`}
        />
        {isHovered && (
          <motion.div
            className="absolute inset-0 bg-white/20 rounded-lg sm:rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </motion.div>

      <div className="flex-1 min-w-0">
        <motion.p
          className="text-xs text-slate-400 mb-1"
          initial={{ opacity: 0.6 }}
          whileHover={{ opacity: 1 }}
        >
          {item.label}
        </motion.p>
        <motion.p
          className="text-slate-200 font-medium text-xs sm:text-sm "
          whileHover={{ color: "#ffffff" }}
          transition={{ duration: 0.2 }}
        >
          {item.content}
        </motion.p>

      </div>


      <motion.div
        animate={{ x: isHovered ? 3 : 0 }}
        transition={{ duration: 0.2 }}
      >
        {item.href.startsWith("http") ? (
          <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400 group-hover:text-cyan-400 transition-colors flex-shrink-0" />
        ) : (
          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400 group-hover:text-cyan-400 transition-colors flex-shrink-0" />
        )}
      </motion.div>
    </motion.a>
  )
}

// Schedule Card Component - Fully responsive
const ScheduleCard: React.FC<{ item: ScheduleItem; index: number }> = ({ item, index }) => {
  return (
    <motion.div
      className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-800/50 hover:bg-slate-700/50 transition-all duration-300 border border-slate-700/30 hover:border-purple-500/30"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <motion.div
            className={`w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br ${item.color} rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg`}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm sm:text-lg">{item.icon}</span>
          </motion.div>
          <div className="min-w-0">
            <motion.p
              className="text-white font-semibold text-xs sm:text-sm md:text-base truncate"
              whileHover={{ color: "#a78bfa" }}
              transition={{ duration: 0.2 }}
            >
              {item.days}
            </motion.p>
            <p className="text-xs text-slate-400 bg-slate-600/50 p-1 rounded-md ">
              {item.hours[0] === "Cerrado" ? "No atendemos / Cerrado" : "Servicio disponible"}
            </p>
          </div>
        </div>
        <motion.div
          whileHover={{ rotate: 15, scale: 1.1 }}
          transition={{ duration: 0.2 }}
        >
          <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400 flex-shrink-0" />
        </motion.div>
      </div>

      <div className="space-y-1 sm:space-y-2 ml-9 sm:ml-13">
        {item.hours.map((hour, hourIndex) => (
          <motion.div
            key={hourIndex}
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: hourIndex * 0.1 }}
          >
            <motion.div
              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gradient-to-r ${item.color}`}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: hourIndex * 0.2 }}
            />
            <span className={`text-xs sm:text-sm ${hour === "Cerrado" ? "text-red-400 font-medium" : "text-slate-300"}`}>
              {hour}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// Social Link Component - Fully responsive
const SocialLinkComponent: React.FC<{ social: SocialLink; index: number }> = ({ social, index }) => {
  const IconComponent = social.icon

  return (
    <motion.a
      key={index}
      href={social.href}
      className="relative group w-14 h-14 sm:w-10 sm:h-12 bg-slate-800/50 rounded-full flex items-center justify-center border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300"
      aria-label={social.label}
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, type: "spring" }}
      whileTap={{ scale: 0.95 }}
    >
      <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      />
    </motion.a>
  )
}

// Main Footer Component
export default function Footer() {
  const { hoveredItem, setHoveredItem, isHovered } = useHoverStates()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        type: "spring",
        stiffness: 100,
      },
    },
  }

  return (
    <footer className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      <AnimatedBackground />

      {/* Decorative Lines */}
      <motion.div
        className="relative h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      />

      <div className="relative z-10 max-w-6xl sm:max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pt-12 sm:pt-16 md:pt-20 pb-6 sm:pb-8 md:pb-12">
        {/* Header - Fully responsive */}
        <motion.div
          className="text-center mb-8 sm:mb-12 md:mb-16 lg:mb-20"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative inline-block">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
            <div className="relative">
              <GradientText
                colors={['#30ffff', '#2b4eff', '#dccdef', '#30ffff']}
                animationSpeed={4}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-3 sm:mb-4"
              >
                Contáctanos
              </GradientText>

              <motion.div
                className="flex items-center justify-center gap-1 sm:gap-2 mt-2 sm:mt-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                </motion.div>
                <div className="h-px bg-gradient-to-r from-grey-400 to-white from-grey-400 w-16 sm:w-24 md:w-32" />
                <motion.div
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Utensils className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                </motion.div>
                <div className="h-px bg-gradient-to-r from-white to-grey-400 w-16 sm:w-24 md:w-32" />
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Main Content Grid - Responsive layout */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12 md:mb-16 lg:mb-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* About Section - Responsive */}
          <motion.div variants={sectionVariants}>
            <motion.div
              className="relative p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 hover:border-blue-500/30 transition-all duration-500"
              whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.1)" }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl sm:rounded-3xl opacity-0"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              />

              <div className="relative z-10">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <motion.div
                    className="w-8 h-8 sm:w-10 sm:h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg"

                    transition={{ duration: 0.6 }}
                  >
                    <Utensils className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                  </motion.div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Los Camioneros
                  </h3>
                </div>

                <p className="text-slate-300 leading-relaxed text-sm sm:text-base md:text-lg mb-4 sm:mb-6">
                  Restaurante tradicional con más de{" "}
                  <motion.span
                    className="font-bold text-cyan-400 inline-block"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    50 años
                  </motion.span>{" "}
                  de experiencia, ofreciendo los mejores platos de la cocina española con{" "}
                  <motion.span
                    className="font-bold text-purple-400 inline-block"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    pasión y tradición
                  </motion.span>
                  .
                </p>

                <motion.div
                  className="flex items-center gap-2 sm:gap-4"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex -space-x-1 sm:-space-x-2">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br rounded-full border border-slate-900"
                        style={{
                          background: i === 0 ? "linear-gradient(to bottom right, #60a5fa, #06b6d4)" :
                            i === 1 ? "linear-gradient(to bottom right, #a78bfa, #ec4899)" :
                              "linear-gradient(to bottom right, #4ade80, #10b981)"
                        }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: i * 0.1, type: "spring" }}
                      />
                    ))}
                  </div>
                  <motion.span
                    className="text-xs sm:text-sm text-slate-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    +15,000 clientes satisfechos
                  </motion.span>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Section - Responsive */}
          <motion.div variants={sectionVariants}>
            <motion.div
              className="relative p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 hover:border-green-500/30 transition-all duration-500"
              whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(34, 197, 94, 0.1)" }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-2xl sm:rounded-3xl opacity-0"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              />

              <div className="relative z-10">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <motion.div
                    className="w-8 h-8 sm:w-10 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg"
                    transition={{ duration: 0.6 }}
                  >
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                  </motion.div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                    Contacto
                  </h3>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  {contactInfo.map((item, index) => (
                    <ContactCard
                      key={index}
                      item={item} 
                      isHovered={isHovered(item.label)}
                      onHover={setHoveredItem}
                      onLeave={() => setHoveredItem(null)}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Schedule Section - Responsive */}
          <motion.div variants={sectionVariants}>
            <motion.div
              className="relative p-4 sm:p-5 md:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 hover:border-purple-500/30 transition-all duration-500"
              whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(168, 85, 247, 0.1)" }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-2xl sm:rounded-3xl opacity-0"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              />

              <div className="relative z-10">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <motion.div
                    className="w-8 h-8 sm:w-10 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg"
                  >
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                  </motion.div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Horario
                  </h3>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  {schedule.map((item, index) => (
                    <ScheduleCard key={index} item={item} index={index} />
                  ))}
                </div>

                <motion.div
                  className="mt-4 sm:mt-6 p-3 sm:p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                >
                  <p className="text-xs sm:text-sm text-purple-300 text-center flex items-center justify-center gap-2">
                    <motion.span>
                      💡
                    </motion.span>
                    Para reservas, llámanos con antelación
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Social Links - Responsive */}
        <motion.div
          className="flex flex-col items-center gap-4 sm:gap-6 mb-6 sm:mb-8 md:mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-3 sm:gap-4">
            {socialLinks.map((social, index) => (

              <SocialLinkComponent key={index} social={social} index={index} />
            ))}
          </div>

          <motion.div
            className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-xs sm:text-sm text-slate-400"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            <motion.div
              className="flex items-center gap-1 sm:gap-2"
              whileHover={{ color: "#06b6d4" }}
              transition={{ duration: 0.2 }}
            >
              <Globe className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Rubí, Barcelona</span>
            </motion.div>
            <motion.div
              className="flex items-center gap-1 sm:gap-2"
              whileHover={{ color: "#a78bfa" }}
              transition={{ duration: 0.2 }}
            >
              <Navigation className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Cataluña, España</span>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Footer Bottom - Responsive */}
        <motion.div
          className="relative"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
        >
          <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent mb-4 sm:mb-6 md:mb-8" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <p className="text-slate-400 text-xs sm:text-sm text-center sm:text-left">
              © {new Date().getFullYear()} Los Camioneros. Todos los derechos reservados.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 md:gap-6 text-xs sm:text-sm text-slate-400">
              {["Política de Privacidad", "Términos de Servicio", "Cookies"].map((item, index) => (
                <motion.a
                  key={item}
                  href="#"
                  className="hover:text-cyan-400 transition-colors"
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  {item}
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Decorative Line */}
      <motion.div
        className="relative h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.2 }}
      />
    </footer>
  )
}
