"use client"

import { useState, useCallback, useMemo, useEffect } from "react"
import { Menu, X, House, ChefHat, BadgeInfo, CookingPot, Phone, Images } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [viewport, setViewport] = useState({ width: 0, height: 0 })

  // Detect viewport con debouncing
  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    
    const updateViewport = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        setViewport({ 
          width: window.innerWidth, 
          height: window.innerHeight 
        })
      }, 100)
    }

    updateViewport()
    window.addEventListener('resize', updateViewport, { passive: true })
    return () => {
      window.removeEventListener('resize', updateViewport)
      clearTimeout(timeoutId)
    }
  }, [])

  // Optimized scroll handler
  useEffect(() => {
    let ticking = false
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20)
          ticking = false
        })
        ticking = true
      }
    }
    
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Device detection más precisa
  const getDeviceType = useCallback(() => {
    const { width, height } = viewport
    const isLandscape = width > height
    
    // Caso especial: 1024x417 y similares
    if (width === 1024 && height <= 500) {
      return { type: 'ultra-wide', orientation: 'landscape' }
    }
    
    if (width < 768) {
      return { type: 'mobile', orientation: isLandscape ? 'landscape' : 'vertical' }
    } else if (width <= 1024) {
      return { type: 'tablet', orientation: isLandscape ? 'landscape' : 'vertical' }
    } else if (width <= 1280) {
      return { type: 'small-desktop', orientation: 'landscape' }
    }
    
    return { type: 'desktop', orientation: 'landscape' }
  }, [viewport])

  const device = getDeviceType()

  // Responsive sizes según dispositivo
  const getSizes = useCallback(() => {
    switch (device.type) {
      case 'ultra-wide':
        return {
          navHeight: 'h-10',
          logoSize: 'h-8 w-8',
          textSize: 'text-sm',
          padding: 'px-2',
          gap: 'gap-1',
          iconSize: 'h-4 w-4',
          buttonSize: 'px-2 py-1 text-xs'
        }
      case 'mobile':
        return {
          navHeight: device.orientation === 'landscape' ? 'h-12' : 'h-14 sm:h-16',
          logoSize: device.orientation === 'landscape' ? 'h-8 w-8 sm:h-10 sm:w-10' : 'h-10 w-10 sm:h-12 sm:w-12',
          textSize: device.orientation === 'landscape' ? 'text-base sm:text-lg' : 'text-lg sm:text-xl',
          padding: 'px-3 sm:px-4',
          gap: 'gap-2 sm:gap-3',
          iconSize: 'h-4 w-4 sm:h-5 sm:w-5',
          buttonSize: 'px-3 py-2 text-sm sm:text-base'
        }
      case 'tablet':
        return {
          navHeight: device.orientation === 'landscape' ? 'h-12' : 'h-16',
          logoSize: 'h-10 w-10 md:h-12 md:w-12',
          textSize: 'text-base md:text-lg',
          padding: 'px-3 md:px-4',
          gap: 'gap-2 md:gap-3',
          iconSize: 'h-4 w-4 md:h-5 md:w-5',
          buttonSize: 'px-3 py-2 text-sm md:text-base'
        }
      case 'small-desktop':
        return {
          navHeight: 'h-14',
          logoSize: 'h-10 w-10',
          textSize: 'text-base',
          padding: 'px-4',
          gap: 'gap-3',
          iconSize: 'h-4 w-4',
          buttonSize: 'px-3 py-2 text-sm'
        }
      default:
        return {
          navHeight: 'h-16',
          logoSize: 'h-12 w-12',
          textSize: 'text-lg',
          padding: 'px-6',
          gap: 'gap-4',
          iconSize: 'h-5 w-5',
          buttonSize: 'px-4 py-2 text-base'
        }
    }
  }, [device])

  const sizes = getSizes()

  // Navigation items
  const navItems = useMemo(() => [
    { id: "hero", icon: House, label: "Inicio" },
    { id: "horario", icon: ChefHat, label: "Horario" },
    { id: "galeria", icon: Images, label: "Espacio" },
    { id: "platos", icon: CookingPot, label: "Platos" },
    { id: "footer", icon: BadgeInfo, label: "Contacto" }
  ], [])

  // Scroll function
  const scrollToSection = useCallback((id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setIsMobileMenuOpen(false)
    }
  }, [])

  const makeCall = useCallback(() => {
    window.location.href = "tel:+34651509877"
  }, [])

  // Close mobile menu
  useEffect(() => {
    if (isMobileMenuOpen) {
      const handleClickOutside = (e: MouseEvent) => {
        if (!(e.target as Element).closest('nav')) {
          setIsMobileMenuOpen(false)
        }
      }
      
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setIsMobileMenuOpen(false)
      }

      document.addEventListener('click', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'

      return () => {
        document.removeEventListener('click', handleClickOutside)
        document.removeEventListener('keydown', handleEscape)
        document.body.style.overflow = ''
      }
    }
  }, [isMobileMenuOpen])

  // Renderizado condicional del menú principal
  const renderMainMenu = () => {
    // Ultra-wide (1024x417) - Solo íconos muy compactos
    if (device.type === 'ultra-wide') {
      return (
        <div className="hidden md:flex items-center space-x-1">
          {navItems.map(({ id, icon: Icon }) => (
            <button
              key={id}
              onClick={() => scrollToSection(id)}
              className="p-1 rounded hover:bg-gray-100 transition-colors"
              aria-label={`Navigate to ${id}`}
            >
              <Icon className={sizes.iconSize} />
            </button>
          ))}
          <Button
            onClick={makeCall}
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white ml-2 px-2 py-1"
          >
            <Phone className="h-3 w-3" />
          </Button>
        </div>
      )
    }

    // Desktop normal
    if (device.type === 'desktop') {
      return (
        <div className="hidden lg:flex items-center space-x-6">
          {navItems.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => scrollToSection(id)}
              className="group flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors py-2"
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </button>
          ))}
          <Button
            onClick={makeCall}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Phone className="h-4 w-4 mr-2" />
            Llámanos
          </Button>
        </div>
      )
    }

    // Small desktop
    if (device.type === 'small-desktop') {
      return (
        <div className="hidden md:flex items-center space-x-3">
          {navItems.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => scrollToSection(id)}
              className="group flex items-center gap-1 text-gray-700 hover:text-blue-600 transition-colors py-1"
            >
              <Icon className="h-4 w-4" />
              <span className="text-sm">{label}</span>
            </button>
          ))}
          <Button
            onClick={makeCall}
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Phone className="h-3 w-3 mr-1" />
            Llamar
          </Button>
        </div>
      )
    }

    // Tablet
    if (device.type === 'tablet') {
      return (
        <div className="hidden md:flex items-center space-x-2">
          {navItems.map(({ id, icon: Icon }) => (
            <button
              key={id}
              onClick={() => scrollToSection(id)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label={`Navigate to ${id}`}
            >
              <Icon className="h-5 w-5" />
            </button>
          ))}
          <Button
            onClick={makeCall}
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Phone className="h-4 w-4" />
          </Button>
        </div>
      )
    }

    return null
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-lg shadow-lg"
            : "bg-white/90 backdrop-blur-sm shadow-sm"
        }`}
      >
        <div className={`max-w-7xl mx-auto ${sizes.padding}`}>
          <div className={`flex justify-between items-center ${sizes.navHeight}`}>

            {/* Logo */}
            <div
              className={`flex items-center ${sizes.gap} cursor-pointer`}
              onClick={() => scrollToSection("hero")}
            >
              <Image
                src="/logoCamioneros.svg"
                alt="Logo Los Camioneros"
                width={120}
                height={120}
                className={`${sizes.logoSize} transition-transform hover:scale-110`}
                loading="eager"
                priority
              />
              <span className={`${sizes.textSize} font-serif font-bold text-gray-900 tracking-tight select-none`}>
                Los <span className={`${device.type === 'ultra-wide' ? 'hidden' : ''} sm:inline`}>Camioneros</span>
              </span>
            </div>

            {/* Main Menu */}
            {renderMainMenu()}

            {/* Mobile Menu Button */}
            {device.type === 'mobile' && (
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors md:hidden"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5 sm:h-6 sm:w-6" />
                ) : (
                  <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
                )}
              </button>
            )}

            {/* Tablet fallback menu button */}
            {device.type === 'tablet' && (
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors md:hidden"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            )}
          </div>

          {/* Mobile/Tablet Menu */}
          {(device.type === 'mobile' || device.type === 'tablet') && (
            <div
              className={`md:hidden overflow-hidden transition-all duration-300 ${
                isMobileMenuOpen ? "max-h-96" : "max-h-0"
              }`}
            >
              <div className="py-4 space-y-2 border-t border-gray-200">
                {navItems.map(({ id, icon: Icon, label }) => (
                  <button
                    key={id}
                    onClick={() => scrollToSection(id)}
                    className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-base">{label}</span>
                  </button>
                ))}
                <div className="px-4 pt-2">
                  <Button
                    onClick={makeCall}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Llámanos Ahora
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  )
}