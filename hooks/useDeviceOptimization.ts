'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

interface DeviceInfo {
  type: 'mobile' | 'tablet' | 'desktop'
  orientation: 'portrait' | 'landscape'
  isTouch: boolean
  width: number
  height: number
}

interface PerformanceMetrics {
  isLowEnd: boolean
  reducedMotion: boolean
  connectionType: string
}

export function useDeviceOptimization() {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    type: 'desktop',
    orientation: 'landscape',
    isTouch: false,
    width: 0,
    height: 0
  })

  const [performance, setPerformance] = useState<PerformanceMetrics>({
    isLowEnd: false,
    reducedMotion: false,
    connectionType: 'unknown'
  })

  const resizeTimeoutRef = useRef<NodeJS.Timeout>()

  // Optimized device detection with debouncing
  const updateDeviceInfo = useCallback(() => {
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current)
    }

    resizeTimeoutRef.current = setTimeout(() => {
      const width = window.innerWidth
      const height = window.innerHeight
      const isLandscape = width > height
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0

      let type: 'mobile' | 'tablet' | 'desktop' = 'desktop'
      if (width < 768) {
        type = 'mobile'
      } else if (width <= 1024) {
        type = 'tablet'
      } else if (width <= 1366) {
        type = 'tablet' // Tablets grandes y small laptops
      }

      setDeviceInfo({
        type,
        orientation: isLandscape ? 'landscape' : 'portrait',
        isTouch,
        width,
        height
      })
    }, 100)
  }, [])

  // Performance detection
  useEffect(() => {
    const detectPerformance = () => {
      // Detect low-end devices
      const isLowEnd = 
        navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4 ||
        (performance as any).memory && (performance as any).memory.totalJSHeapSize < 1000000000

      // Detect reduced motion preference
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      // Detect connection type
      const connection = (navigator as any).connection
      const connectionType = connection?.effectiveType || 'unknown'

      setPerformance({
        isLowEnd,
        reducedMotion,
        connectionType
      })
    }

    detectPerformance()
    updateDeviceInfo()

    // Passive event listeners for better performance
    window.addEventListener('resize', updateDeviceInfo, { passive: true })
    window.addEventListener('orientationchange', updateDeviceInfo, { passive: true })

    return () => {
      window.removeEventListener('resize', updateDeviceInfo)
      window.removeEventListener('orientationchange', updateDeviceInfo)
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current)
      }
    }
  }, [updateDeviceInfo])

  // Get optimized animation duration based on device performance
  const getAnimationDuration = useCallback((baseDuration: number) => {
    if (performance.reducedMotion) return 0
    if (performance.isLowEnd) return baseDuration * 0.5
    if (deviceInfo.type === 'mobile') return baseDuration * 0.8
    return baseDuration
  }, [performance, deviceInfo.type])

  // Get responsive sizes
  const getResponsiveSizes = useCallback(() => {
    const { type, orientation, width } = deviceInfo
    
    const sizes = {
      navHeight: 'h-16',
      logoSize: 'h-12 w-12',
      textSize: 'text-xl',
      padding: 'px-4',
      gap: 'gap-4'
    }

    switch (type) {
      case 'mobile':
        sizes.navHeight = orientation === 'landscape' ? 'h-12' : 'h-14 sm:h-16'
        sizes.logoSize = orientation === 'landscape' ? 'h-8 w-8 sm:h-10 sm:w-10' : 'h-10 w-10 sm:h-12 sm:w-12'
        sizes.textSize = orientation === 'landscape' ? 'text-base sm:text-lg' : 'text-lg sm:text-xl'
        sizes.padding = 'px-3 sm:px-4'
        sizes.gap = 'gap-2 sm:gap-3'
        break
      case 'tablet':
        // Especialmente para 1024x417 y similares
        if (orientation === 'landscape' && width <= 1024) {
          sizes.navHeight = 'h-12'
          sizes.logoSize = 'h-10 w-10'
          sizes.textSize = 'text-base lg:text-lg'
          sizes.padding = 'px-4'
          sizes.gap = 'gap-2'
        } else if (orientation === 'landscape') {
          sizes.navHeight = 'h-14'
          sizes.logoSize = 'h-10 w-10 md:h-12 md:w-12'
          sizes.textSize = 'text-lg md:text-xl'
          sizes.padding = 'px-4 md:px-6'
          sizes.gap = 'gap-3 md:gap-4'
        } else {
          sizes.navHeight = 'h-16 md:h-18'
          sizes.logoSize = 'h-12 w-12 md:h-14 md:w-14'
          sizes.textSize = 'text-xl md:text-2xl'
          sizes.padding = 'px-4 md:px-6'
          sizes.gap = 'gap-3 md:gap-4'
        }
        break
      case 'desktop':
        if (width < 1280) {
          sizes.navHeight = 'h-14 lg:h-16'
          sizes.logoSize = 'h-10 w-10 lg:h-12 lg:w-12'
          sizes.textSize = 'text-lg lg:text-xl'
          sizes.padding = 'px-4 lg:px-6'
          sizes.gap = 'gap-3 lg:gap-4'
        } else {
          sizes.navHeight = 'h-16 lg:h-20'
          sizes.logoSize = 'h-12 w-12 lg:h-16 lg:w-16'
          sizes.textSize = 'text-xl lg:text-2xl'
          sizes.padding = 'px-6 lg:px-8'
          sizes.gap = 'gap-4 lg:gap-6'
        }
        break
    }

    return sizes
  }, [deviceInfo])

  // Optimized scroll handler
  const useOptimizedScroll = useCallback((callback: () => void, threshold = 20) => {
    const [isScrolled, setIsScrolled] = useState(false)
    const tickingRef = useRef(false)

    useEffect(() => {
      const handleScroll = () => {
        if (!tickingRef.current) {
          requestAnimationFrame(() => {
            const scrolled = window.scrollY > threshold
            setIsScrolled(scrolled)
            callback()
            tickingRef.current = false
          })
          tickingRef.current = true
        }
      }

      window.addEventListener('scroll', handleScroll, { passive: true })
      return () => window.removeEventListener('scroll', handleScroll)
    }, [callback, threshold])

    return isScrolled
  }, [])

  // Touch-friendly interaction hook
  const useTouchInteraction = useCallback(() => {
    const [isPressed, setIsPressed] = useState(false)

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
      e.preventDefault()
      setIsPressed(true)
      
      // Haptic feedback if available
      if ('vibrate' in navigator) {
        navigator.vibrate(10)
      }
    }, [])

    const handleTouchEnd = useCallback((e: React.TouchEvent) => {
      e.preventDefault()
      setIsPressed(false)
    }, [])

    const getTouchClasses = useCallback(() => {
      return deviceInfo.isTouch 
        ? 'touch-manipulation no-tap-highlight active:scale-95' 
        : 'hover:scale-105'
    }, [deviceInfo.isTouch])

    return {
      isPressed,
      handleTouchStart,
      handleTouchEnd,
      getTouchClasses
    }
  }, [deviceInfo.isTouch])

  return {
    deviceInfo,
    performance,
    getAnimationDuration,
    getResponsiveSizes,
    useOptimizedScroll,
    useTouchInteraction
  }
}