'use client'

import { useState, useEffect, useMemo } from 'react'
import { Clock, X, ChefHat, MapPin, Navigation } from 'lucide-react'

interface DaySchedule {
    day: string
    hours: string[]
    englishDay: string
    isClosed?: boolean
}

const OpeningHours = () => {
    const [today, setToday] = useState<string>('')
    const [mounted, setMounted] = useState(false)

    const schedule: DaySchedule[] = useMemo(() => [
        { day: 'Lunes', hours: [], englishDay: 'Monday', isClosed: true },
        { day: 'Martes', hours: ['7:00 – 17:00'], englishDay: 'Tuesday' },
        { day: 'Miércoles', hours: ['7:00 – 17:00'], englishDay: 'Wednesday' },
        { day: 'Jueves', hours: ['7:00 – 17:00'], englishDay: 'Thursday' },
        { day: 'Viernes', hours: ['7:00 – 17:00', '20:00 – 23:30'], englishDay: 'Friday' },
        { day: 'Sábado', hours: ['7:00 – 17:00', '20:00 – 23:30'], englishDay: 'Saturday' },
        { day: 'Domingo', hours: [], englishDay: 'Sunday', isClosed: true }
    ], [])

    useEffect(() => {
        setMounted(true)
        const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' })
        setToday(currentDay.toLowerCase())
    }, [])

    const isToday = (englishDay: string) => mounted && today === englishDay.toLowerCase()

    if (!mounted) {
        return (
            <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8 lg:py-12">
                <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl lg:shadow-2xl p-4 sm:p-6 lg:p-10 border border-blue-100 min-h-[400px] animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-8"></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                        {[...Array(7)].map((_, i) => (
                            <div key={i} className="h-24 bg-gray-100 rounded-xl"></div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-10" id='horario'>
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl lg:shadow-2xl p-3 sm:p-5 lg:p-8 border border-blue-100">

                {/* === HORARIO === */}
                <div className="text-center mb-6 sm:mb-8 lg:mb-10">
                    <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                        <div className="p-2.5 sm:p-3.5 lg:p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl shadow-md shadow-blue-200">
                            <Clock className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                        </div>
                        <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-extrabold tracking-tight text-blue-900 font-['Montserrat',_sans-serif]">
                            Nuestro Horario
                        </h2>
                    </div>
                    <div className="relative w-16 sm:w-20 lg:w-24 h-0.5 sm:h-1 mx-auto overflow-hidden rounded-full">
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-600 to-cyan-400 animate-[shine_2.5s_ease-in-out_infinite]" />
                    </div>
                </div>

                {/* Schedule Grid - Responsive breakpoints optimized */}
                <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 mb-6 sm:mb-8">
                    {schedule.map((item, index) => (
                        <div
                            key={index}
                            className={`
                                relative overflow-hidden rounded-lg sm:rounded-xl lg:rounded-2xl p-2.5 sm:p-3.5 lg:p-4 transition-all duration-300 transform-gpu
                                ${isToday(item.englishDay)
                                    ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-400 shadow-lg scale-[1.02] sm:scale-105 z-10'
                                    : item.isClosed
                                        ? 'bg-red-50 border border-gray-200'
                                        : 'bg-white border border-blue-100 hover:border-blue-300'
                                } hover:shadow-xl hover:scale-[1.02] cursor-pointer active:scale-95
                            `}
                        >
                            <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                                <div className="flex items-center gap-1.5 sm:gap-2">
                                    {item.isClosed ? (
                                        <X className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                                    ) : (
                                        <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 lg:w-2.5 lg:h-2.5 rounded-full ${isToday(item.englishDay) ? 'bg-blue-500' : 'bg-blue-300'} flex-shrink-0`}></div>
                                    )}
                                    <span className={`font-semibold text-xs sm:text-sm lg:text-base ${isToday(item.englishDay) ? 'text-blue-900' : item.isClosed ? 'text-gray-500' : 'text-blue-800'} font-['Montserrat',_sans-serif] truncate`}>
                                        {item.day}
                                    </span>
                                </div>
                                {isToday(item.englishDay) && (
                                    <div className="bg-blue-500 text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full font-medium animate-pulse whitespace-nowrap">
                                        Hoy
                                    </div>
                                )}
                            </div>

                            <div className="space-y-0.5 sm:space-y-1">
                                {item.isClosed ? (
                                    <div className="text-gray-400 font-medium text-xs sm:text-sm font-['Montserrat',_sans-serif]">Cerrado</div>
                                ) : (
                                    item.hours.map((hour, i) => (
                                        <div key={i} className={`text-[10px] sm:text-xs lg:text-sm font-medium font-['Montserrat',_sans-serif] ${isToday(item.englishDay) ? 'text-blue-800' : 'text-blue-700'} leading-tight`}>
                                            {hour}
                                        </div>
                                    ))
                                )}
                            </div>
                            {isToday(item.englishDay) && (
                                <div className="absolute top-0 right-0 w-12 h-12 sm:w-16 sm:h-16 bg-blue-200 opacity-20 rounded-full -mr-6 -mt-6 sm:-mr-8 sm:-mt-8"></div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Kitchen Note */}
                <div className="text-center pt-3 sm:pt-4 lg:pt-6 border-t border-[#839dd4]/30">
                    <div className="bg-[#a0a0f6ae] rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 lg:p-4 max-w-sm mx-auto flex items-center justify-center gap-2 shadow-sm">
                        <ChefHat className="w-4 h-4 sm:w-5 sm:h-5 text-[#000000] flex-shrink-0" />
                        <p className="text-[#000000] text-xs sm:text-sm lg:text-base font-['Montserrat',_sans-serif] font-medium leading-tight">
                            La cocina cierra 30 minutos antes del cierre.
                        </p>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="mt-3 sm:mt-4 text-center">
                    <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-blue-100 text-blue-800 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium">
                        <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        <span className="whitespace-nowrap">Horario sujeto a cambios</span>
                    </div>
                </div>

                {/* === MAPA + CÓMO LLEGAR === */}
                <div className="mt-8 sm:mt-10 lg:mt-12 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-inner border-2 border-blue-200" id='ubicación'>
                    <div className="flex items-center justify-center gap-2.5 sm:gap-3 mb-4 sm:mb-6">
                        <div className="p-2.5 sm:p-3.5 lg:p-4 bg-blue-600 rounded-xl sm:rounded-2xl shadow-lg">
                            <MapPin className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
                        </div>
                        <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-extrabold text-blue-900 font-['Montserrat',_sans-serif]">
                            ¿Dónde estamos?
                        </h3>
                    </div>

                    <div className="text-center mb-4 sm:mb-6">
                        <p className="text-base sm:text-lg lg:text-xl font-bold text-blue-800 leading-tight px-2">
                            Carrer de Bartrina, 12, 08191 Rubí, Barcelona
                        </p>
                        <div className="mt-2 text-xs sm:text-sm text-gray-700 font-medium px-2 space-y-1">
                            <p>• Terraza • Acceso adaptado • Wi-Fi • Aire acondicionado • Menú Diario</p>
                        </div>
                    </div>

                    {/* Google Maps - Responsive height */}
                    <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl mb-4 sm:mb-6 border-2 sm:border-4 border-white">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2989.423441846377!2d2.029156!3d41.492876!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12a4988f8b8b8b8b%3A0x8b8b8b8b8b8b8b8b!2sCarrer%20de%20Bartrina%2C%2012%2C%2008191%20Rub%C3%AD%2C%20Barcelona!5e0!3m2!1ses!2ses!4v1733598400000"
                            width="100%"
                            height="250"
                            style={{ border: 0, minHeight: '250px' }}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="rounded-xl sm:rounded-2xl w-full"
                        />
                    </div>

                    {/* Botones Cómo llegar - Mobile optimized */}
                    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        {/* Waze */}
                        <a
                            href="https://waze.com/ul?q=Carrer+de+Bartrina,+12,+08191+Rubí,+Barcelona"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-[#00C0FF] to-[#00A8E6]   hover:bg-[#00a8e6] active:bg-[#0096d6] text-white font-bold py-3 sm:py-3.5 lg:py-4 px-4 sm:px-6 lg:px-8 rounded-xl sm:rounded-2xl shadow-lg transform hover:scale-[1.02] active:scale-95 transition-all duration-200 text-sm sm:text-base"
                        >
                            <svg
                                role="img"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-5 h-5 sm:w-6 sm:h-6 fill-white flex-shrink-0"
                            >
                                <title>Waze</title>
                                <path d="M13.218 0C9.915 0 6.835 1.49 4.723 4.148c-1.515 1.913-2.31 4.272-2.31 6.706v1.739c0 .894-.62 1.738-1.862 1.813-.298.025-.547.224-.547.522-.05.82.82 2.31 2.012 3.502.82.844 1.788 1.515 2.832 2.036a3 3 0 0 0 2.955 3.528 2.966 2.966 0 0 0 2.931-2.385h2.509c.323 1.689 2.086 2.856 3.974 2.21 1.64-.546 2.36-2.409 1.763-3.924a12.84 12.84 0 0 0 1.838-1.465 10.73 10.73 0 0 0 3.18-7.65c0-2.882-1.118-5.589-3.155-7.625A10.899 10.899 0 0 0 13.218 0zm0 1.217c2.558 0 4.967.994 6.78 2.807a9.525 9.525 0 0 1 2.807 6.78A9.526 9.526 0 0 1 20 17.585a9.647 9.647 0 0 1-6.78 2.807h-2.46a3.008 3.008 0 0 0-2.93-2.41 3.03 3.03 0 0 0-2.534 1.367v.024a8.945 8.945 0 0 1-2.41-1.788c-.844-.844-1.316-1.614-1.515-2.11a2.858 2.858 0 0 0 1.441-.846 2.959 2.959 0 0 0 .795-2.036v-1.789c0-2.11.696-4.197 2.012-5.861 1.863-2.385 4.62-3.726 7.6-3.726zm-2.41 5.986a1.192 1.192 0 0 0-1.191 1.192 1.192 1.192 0 0 0 1.192 1.193A1.192 1.192 0 0 0 12 8.395a1.192 1.192 0 0 0-1.192-1.192zm7.204 0a1.192 1.192 0 0 0-1.192 1.192 1.192 1.192 0 0 0 1.192 1.193 1.192 1.192 0 0 0 1.192-1.193 1.192 1.192 0 0 0-1.192-1.192zm-7.377 4.769a.596.596 0 0 0-.546.845 4.813 4.813 0 0 0 4.346 2.757 4.77 4.77 0 0 0 4.347-2.757.596.596 0 0 0-.547-.845h-.025a.561.561 0 0 0-.521.348 3.59 3.59 0 0 1-3.254 2.061 3.591 3.591 0 0 1-3.254-2.061.64.64 0 0 0-.546-.348z" />
                            </svg>
                            <span className="whitespace-nowrap">Waze</span>
                        </a>

                        {/* Apple Maps */}
                        <a
                            href="https://maps.apple.com/?q=Carrer+de+Bartrina+12+Rubí+Barcelona"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-[#5a5a5a] via-[#000000] to-[#5a5a5a] hover:from-[#6d6d6d] hover:via-[#1a1a1a] hover:to-[#6d6d6d] active:from-[#4d4d4d] active:via-[#0d0d0d] active:to-[#4d4d4d] text-white font-bold py-3 sm:py-3.5 lg:py-4 px-4 sm:px-6 lg:px-8 rounded-xl sm:rounded-2xl shadow-lg transform hover:scale-[1.02] active:scale-95 transition-all duration-200 text-sm sm:text-base"
                        >
                            <svg
                                role="img"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-5 h-5 sm:w-6 sm:h-6 fill-white flex-shrink-0"
                            >
                                <title>Apple</title>
                                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
                            </svg>
                            <span className="whitespace-nowrap">Apple Maps</span>
                        </a>

                        {/* Google Maps */}
                        <a
                            href="https://www.google.com/maps/dir/?api=1&destination=Carrer+de+Bartrina+12,+08191+Rubí,+Barcelona"
                            target="_blank"
                            rel="noopener noreferrer"
className="flex items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-[#EA4335]  to-[#34A853] hover:from-[#34A853] hover:via-[#FBBC05] hover:to-[#EA4335] active:from-[#E94235]  active:to-[#4285F4] text-white font-bold py-3 sm:py-3.5 lg:py-4 px-4 sm:px-6 lg:px-8 rounded-xl sm:rounded-2xl shadow-lg transform hover:scale-[1.03] active:scale-95 transition-all duration-200 text-sm sm:text-base"
                        >
                            <svg
                                role="img"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-5 h-5 sm:w-6 sm:h-6 fill-white flex-shrink-0"
                            >
                                <title>Google Maps</title>
                                <path d="M19.527 4.799c1.212 2.608.937 5.678-.405 8.173-1.101 2.047-2.744 3.74-4.098 5.614-.619.858-1.244 1.75-1.669 2.727-.141.325-.263.658-.383.992-.121.333-.224.673-.34 1.008-.109.314-.236.684-.627.687h-.007c-.466-.001-.579-.53-.695-.887-.284-.874-.581-1.713-1.019-2.525-.51-.944-1.145-1.817-1.79-2.671L19.527 4.799zM8.545 7.705l-3.959 4.707c.724 1.54 1.821 2.863 2.871 4.18.247.31.494.622.737.936l4.984-5.925-.029.01c-1.741.601-3.691-.291-4.392-1.987a3.377 3.377 0 0 1-.209-.716c-.063-.437-.077-.761-.004-1.198l.001-.007zM5.492 3.149l-.003.004c-1.947 2.466-2.281 5.88-1.117 8.77l4.785-5.689-.058-.05-3.607-3.035zM14.661.436l-3.838 4.563a.295.295 0 0 1 .027-.01c1.6-.551 3.403.15 4.22 1.626.176.319.323.683.377 1.045.068.446.085.773.012 1.22l-.003.016 3.836-4.561A8.382 8.382 0 0 0 14.67.439l-.009-.003zM9.466 5.868L14.162.285l-.047-.012A8.31 8.31 0 0 0 11.986 0a8.439 8.439 0 0 0-6.169 2.766l-.016.018 3.665 3.084z" />
                            </svg>
                            <span className="whitespace-nowrap">Google Maps</span>
                        </a>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes shine {
                    0% { transform: translateX(-100%); opacity: 0.2; }
                    50% { transform: translateX(0); opacity: 1; }
                    100% { transform: translateX(100%); opacity: 0.2; }
                }
                
                /* Custom scrollbar for better mobile experience */
                ::-webkit-scrollbar {
                    width: 6px;
                    height: 6px;
                }
                
                ::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 3px;
                }
                
                ::-webkit-scrollbar-thumb {
                    background: #c1c1c1;
                    border-radius: 3px;
                }
                
                ::-webkit-scrollbar-thumb:hover {
                    background: #a8a8a8;
                }
            `}</style>
        </div>
    )
}

export default OpeningHours