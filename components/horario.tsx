'use client'

import { useState, useEffect } from 'react'
import { Clock, Calendar, X, ChefHat } from 'lucide-react'

interface DaySchedule {
    day: string
    hours: string[]
    englishDay: string
    isClosed?: boolean
}

const OpeningHours = () => {
    const [today, setToday] = useState<string>('')

    const schedule: DaySchedule[] = [
        { day: 'Lunes', hours: [], englishDay: 'Monday', isClosed: true },
        { day: 'Martes', hours: ['7:00 – 17:00'], englishDay: 'Tuesday' },
        { day: 'Miércoles', hours: ['7:00 – 17:00'], englishDay: 'Wednesday' },
        { day: 'Jueves', hours: ['7:00 – 17:00'], englishDay: 'Thursday' },
        { day: 'Viernes', hours: ['7:00 – 17:00', '20:00 – 23:30'], englishDay: 'Friday' },
        { day: 'Sábado', hours: ['7:00 – 17:00', '20:00 – 23:30'], englishDay: 'Saturday' },
        { day: 'Domingo', hours: [], englishDay: 'Sunday', isClosed: true }
    ]

    useEffect(() => {
        const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' })
        setToday(currentDay.toLowerCase())
    }, [])

    const isToday = (englishDay: string) => {
        return today === englishDay.toLowerCase()
    }

    return (
        <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8 lg:py-12" id='horario'>
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl lg:shadow-2xl p-4 sm:p-6 lg:p-10 border border-blue-100">
                {/* Title Section */}
                <div className="text-center mb-6 sm:mb-8 lg:mb-10">
                    <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                        <div className="p-2 bg-blue-500 rounded-full">
                            <Clock className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-900 font-['Montserrat',_sans-serif]" >
                            Nuestro Horario
                        </h2>

                    </div>
                    <div className="w-16 sm:w-20 lg:w-24 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent mx-auto rounded-full"></div>
                </div>

                {/* Schedule Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
                    {schedule.map((item, index) => (
                        <div
                            key={index}
                            className={`
                relative overflow-hidden rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 transition-all duration-300 ease-in-out
                ${isToday(item.englishDay)
                                    ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-400 shadow-lg transform scale-105'
                                    : item.isClosed
                                        ? 'bg-red-50 border-2 border-gray-200'
                                        : 'bg-white border-2 border-blue-100 hover:border-blue-300'
                                }
                hover:shadow-xl hover:scale-[1.02] cursor-pointer
              `}
                        >
                            {/* Day Header */}
                            <div className="flex items-center justify-between mb-2 sm:mb-3">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    {item.isClosed ? (
                                        <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                    ) : (
                                        <div className={`
                      w-2 h-2 sm:w-3 sm:h-3 rounded-full
                      ${isToday(item.englishDay) ? 'bg-blue-500' : 'bg-blue-300'}
                    `}></div>
                                    )}
                                    <span className={`
                    font-semibold text-sm sm:text-base lg:text-lg
                    ${isToday(item.englishDay)
                                            ? 'text-blue-900'
                                            : item.isClosed
                                                ? 'text-gray-500'
                                                : 'text-blue-800'
                                        }
                    font-['Montserrat',_sans-serif]
                  `}>
                                        {item.day}
                                    </span>
                                </div>
                                {isToday(item.englishDay) && (
                                    <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium animate-pulse">
                                        Hoy
                                    </div>

                                )}
                            </div>

                            {/* Hours Display */}
                            <div className="space-y-1 sm:space-y-2">
                                {item.isClosed ? (
                                    <div className="text-gray-400 font-medium text-sm sm:text-base font-['Montserrat',_sans-serif]">
                                        Cerrado
                                    </div>
                                ) : (
                                    item.hours.map((hour, hourIndex) => (
                                        <div
                                            key={hourIndex}
                                            className={`
                        text-xs sm:text-sm lg:text-base font-medium font-['Montserrat',_sans-serif]
                        ${isToday(item.englishDay)
                                                    ? 'text-blue-800'
                                                    : 'text-blue-700'
                                                }
                      `}
                                        >
                                            {hour}
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Decorative Elements */}
                            {isToday(item.englishDay) && (
                                <div className="absolute top-0 right-0 w-16 h-16 bg-blue-200 opacity-20 rounded-full -mr-8 -mt-8"></div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Kitchen Note */}
                <div className="text-center pt-4 sm:pt-6 lg:pt-8 border-t border-[#839dd4]/30">
                    <div className="bg-[#a0a0f6ae] rounded-2xl p-3 sm:p-4 lg:p-5 max-w-md mx-auto flex items-center justify-center gap-2 shadow-sm">
                        <ChefHat className="w-5 h-5 sm:w-6 sm:h-6 text-[#000000]" />
                        <p className="text-[#000000] text-sm sm:text-base lg:text-lg font-['Montserrat',_sans-serif] font-medium">
                            La cocina cierra 30 minutos antes del cierre.
                        </p>
                    </div>
                </div>


                {/* Additional Info */}
                <div className="mt-4 sm:mt-6 text-center">
                    <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>Horario sujeto a cambios</span>
                    </div>
                </div>
            </div>

        </div>

    )
}

export default OpeningHours