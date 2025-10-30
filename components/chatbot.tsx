"use client"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Download, Clock, MenuIcon, Phone, Mail, Brain, Zap, Bot, Cpu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import GradientText from "./GradientText"

interface Message {
  id: number
  text: string
  isBot: boolean
  isButton?: boolean
  action?: string
  timestamp?: Date
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "🤖 ¡Hola! Soy **CamionerosIA**, tu asistente con inteligencia artificial avanzada. Estoy aquí para ayudarte con cualquier consulta sobre nuestro restaurante. ¿En qué puedo asistirte hoy? ✨",
      isBot: true,
      timestamp: new Date(),
    },
  ])
  const [isTyping, setIsTyping] = useState(false)
  const [isThinking, setIsThinking] = useState(false)
  const chatEndRef = useRef<HTMLDivElement | null>(null)
  const chatRef = useRef<HTMLDivElement | null>(null)

  // Auto scroll al fondo
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  // Cerrar chat al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleButtonClick = (action: string, buttonText: string) => {
    const userMessage: Message = {
      id: messages.length + 1,
      text: buttonText,
      isBot: false,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setIsTyping(true)
    setIsThinking(true)

    setTimeout(() => {
      setIsThinking(false)
      setIsTyping(true)
    }, 500)

    setTimeout(() => {
      setIsTyping(false)
      let botResponse = ""

      switch (action) {
        case "horario":
          botResponse =
            "🕐 **Nuestro horario**:\n\n**Martes a Viernes**: \n7:00–16:30\n**Viernes y Sábados**: \n7:00–16:30 y 20:00-00:00\n"
          break
        case "menu":
          botResponse =
            "🥗 **Menú diario del día**:\n\nDisponible de **Martes a viernes** al mediodía. 🍽️✨\n\n¡Acércate y descubre nuestras **especialidades**  😋"
          break
        // case "pdf":
        //   botResponse =
        //     "📖 **Nuestra carta en PDF**\nAquí tienes nuestro **menú digital completo** con todos los platos y bebidas disponibles. 📊✨"
        //   break
        case "reservas":
          botResponse =
            "📞 **Como hacer una reserva?**:\n\n**Teléfono**: +34 651 50 98 77\n**Ubicación**: Carrer Bartrina 12, 08191, Rubí\n\n"
          break
        case "contacto":
          botResponse =
            "📍 **Datos de contacto**:\n\n**Dirección**: Carrer Bartrina 12, 08191, Rubí\n**Teléfono**: +34 651 50 98 77\n**Email**: loscamioneros.rubi@gmail.com\n\n"
          break
        default:
          botResponse =
            "🤖 **Sistema IA activado**:\nPuedo ayudarte con **horario**, **menú**, **carta** o **reservas**. ¿Qué consulta deseas procesar?"
      }

      const botMessage: Message = {
        id: messages.length + 2,
        text: botResponse,
        isBot: true,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])

      // Botón PDF
      if (action === "pdf") {
        setTimeout(() => {
          const downloadMessage: Message = {
            id: messages.length + 3,
            text: "📄 Descargar Carta Digital",
            isBot: true,
            isButton: true,
            action: "download",
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, downloadMessage])
        }, 400)
      }
    }, 1500)
  }

  const pdfUrl = "/FotosBar/CartaLosCamioneros.pdf"

  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = pdfUrl
    link.download = "CartaCamioneros.pdf"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Función para renderizar bold con **
  const renderBoldText = (text: string) => {
    // Divide por líneas primero (\n)
    return text.split("\n").map((line, i) => (
      <span key={i}>
        {line.split(/\*\*(.*?)\*\*/g).map((part, j) => (j % 2 === 1 ? <strong key={j}>{part}</strong> : part))}
        <br />
      </span>
    ))
  }

  // Formatear timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <>
      {/* Botón flotante con efectos IA - Mejorado para móviles pequeños */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-center group animate-bounce">

        {/* Tooltip mejorado - Oculto en móviles pequeños para no obstruir */}
        <div className="hidden sm:block mb-4 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out transform scale-90 group-hover:scale-100">
          <div className="relative bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 backdrop-blur-sm">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-full blur-lg opacity-50 animate-pulse"></div>
            <Brain className="h-4 w-4 relative z-10" />
            <span className="text-sm font-bold relative z-10">Asistente IA</span>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-purple-600"></div>
          </div>
        </div>

        {/* Botón principal con efectos IA - Tamaño reducido en móviles */}
        <button onClick={() => setIsOpen(!isOpen)} aria-label="Abrir chat" className="relative group/btn">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-full blur-xl opacity-75 group-hover/btn:opacity-100 transition-all duration-300 animate-pulse"></div>
          <div className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-3 sm:p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 active:scale-95 cursor-pointer border border-cyan-500/30">
            {/* Iconos animados - Tamaño responsive */}
            <div className="relative w-5 h-5 sm:w-6 sm:h-6">
              <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-cyan-400 absolute inset-0 animate-pulse" />
              <Bot className="h-5 w-5 sm:h-6 sm:w-6 text-white absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Efectos de partículas - Tamaño reducido en móviles */}
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-cyan-400 rounded-full animate-ping"></div>
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-cyan-400 rounded-full"></div>
            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>

            {/* Indicador de IA - Tamaño responsive */}
            <div className="absolute -top-2 -left-2 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
              <Zap className="h-2 w-2 text-white" />
            </div>
          </div>
        </button>
      </div>

      {/* Ventana del chat con diseño futurista - Mejorado para todas las pantallas */}
      <div
        ref={chatRef}
        className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 transition-all duration-500 ease-out ${isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4 pointer-events-none"}`}
      >
        <Card
          className="
          w-[calc(100vw-2rem)] 
          sm:w-[380px] 
          md:w-[400px] 
          lg:w-[420px]
          xl:w-[450px]
          h-[calc(100vh-8rem)] 
          sm:h-[500px] 
          md:h-[550px] 
          lg:h-[600px]
          max-h-[700px]
          flex flex-col shadow-2xl border-0 rounded-2xl sm:rounded-3xl overflow-hidden bg-gray-900/95 backdrop-blur-xl
          ring-2 ring-cyan-500/20
        "
        >
          {/* Header con tema IA - Padding responsive */}
          <div className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-3 sm:p-4 border-b border-cyan-500/20">
            {/* Efectos de fondo */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10"></div>
            <div className="absolute inset-0 bg-black/20"></div>

            {/* Líneas de circuito decorativas */}
            <div className="absolute top-0 left-0 w-full h-full opacity-20">
              <div className="absolute top-2 left-2 w-8 h-8 border border-cyan-400 rounded"></div>
              <div className="absolute top-2 right-2 w-6 h-6 border border-purple-400 rounded-full"></div>
              <div className="absolute bottom-2 left-4 w-4 h-4 border border-blue-400"></div>
            </div>

            <div className="relative z-10 flex justify-between items-center">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="relative">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/50">
                    <Cpu className="h-5 w-5 sm:h-6 sm:h-6 md:h-7 md:w-7 text-white animate-pulse" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-emerald-400 rounded-full border-2 border-gray-900 shadow-lg flex items-center justify-center">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <GradientText
                      className="font-bold text-base sm:text-lg md:text-xl font-sans"
                      colors={["#00ffff", "#0080ff", "#8000ff", "#ff00ff"]}
                    >
                      CamionerosIA
                    </GradientText>
                    <div className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-cyan-500/20 rounded-full">
                      <span className="text-[10px] sm:text-xs text-cyan-300 font-semibold">v2.0</span>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-cyan-300 mt-0.5 sm:mt-1 flex items-center gap-1 sm:gap-2">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-cyan-200 truncate">Asistente IA Avanzado</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-red-500/20 cursor-pointer bg-red-400 backdrop-blur-sm rounded-full p-1.5 sm:p-2 transition-all duration-300 active:scale-90 border border-red-500/30 flex-shrink-0"
                aria-label="Cerrar chat"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </button>
            </div>
          </div>

          {/* Mensajes con diseño IA - Padding responsive */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? "justify-start" : "justify-end"} animate-fade-in`}
              >
                {message.isButton ? (
                  <Button
                    onClick={handleDownload}
                    className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white flex items-center gap-2 text-xs sm:text-sm rounded-xl sm:rounded-2xl px-4 sm:px-5 py-2.5 sm:py-3 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border border-cyan-500/30"
                  >
                    <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    {message.text}
                  </Button>
                ) : (
                  <div className={`max-w-[90%] sm:max-w-[85%] md:max-w-[80%] group`}>
                    <div
                      className={`rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 shadow-lg break-words transition-all duration-300 hover:shadow-xl ${message.isBot
                          ? "bg-gradient-to-br from-gray-800 to-gray-700 border border-cyan-500/30 text-cyan-100 hover:border-cyan-400/50"
                          : "bg-gradient-to-br from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 border border-blue-500/30"
                        }`}
                    >
                      {/* Indicador de IA para mensajes del bot */}
                      {message.isBot && (
                        <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 text-[10px] sm:text-xs text-cyan-400">
                          <Brain className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                          <span>Respuesta IA</span>
                          {message.timestamp && (
                            <span className="ml-auto text-cyan-500/70">{formatTime(message.timestamp)}</span>
                          )}
                        </div>
                      )}

                      <p className="text-xs sm:text-sm leading-relaxed break-words">
                        {message.isBot ? renderBoldText(message.text) : message.text}
                      </p>

                      {/* Indicador de usuario */}
                      {!message.isBot && message.timestamp && (
                        <div className="text-[10px] sm:text-xs text-blue-200/70 mt-1.5 sm:mt-2 text-right">
                          {formatTime(message.timestamp)}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Estado pensando */}
            {isThinking && (
              <div className="flex justify-start">
                <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 shadow-lg border border-cyan-500/30">
                  <div className="flex items-center gap-1.5 sm:gap-2 text-cyan-400">
                    <Brain className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-pulse" />
                    <span className="text-xs sm:text-sm">Procesando con IA...</span>
                  </div>
                </div>
              </div>
            )}

            {/* Estado escribiendo */}
            {isTyping && !isThinking && (
              <div className="flex justify-start">
                <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 shadow-lg border border-cyan-500/30">
                  <div className="flex gap-1 items-center">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full animate-bounce animation-delay-200"></div>
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full animate-bounce animation-delay-400"></div>
                    <span className="text-[10px] sm:text-xs text-cyan-300 ml-1.5 sm:ml-2">Escribiendo...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Botones rápidos con diseño IA - Grid responsive mejorado */}
          <div className="p-3 sm:p-4 bg-gradient-to-r from-gray-900 to-gray-800 border-t border-cyan-500/20">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleButtonClick("horario", "Ver Horario")}
                className="text-xs sm:text-sm h-9 sm:h-10 hover:bg-cyan-500/10 hover:border-cyan-500 hover:text-cyan-400 transition-all duration-300 rounded-lg sm:rounded-xl border-gray-600 text-black"
              >
                <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                <span className="truncate">Horario</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleButtonClick("menu", "Ver Menú Diario")}
                className="text-xs sm:text-sm h-9 sm:h-10 hover:bg-cyan-500/10 hover:border-cyan-500 hover:text-cyan-400 transition-all duration-300 rounded-lg sm:rounded-xl border-gray-600 text-black"
              >
                <MenuIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                <span className="truncate">Menú</span>
              </Button>



              {/* <Button
                variant="outline"
                size="sm"
                onClick={() => handleButtonClick("pdf", "Ver Carta PDF")}
                className="text-xs sm:text-sm h-9 sm:h-10 hover:bg-cyan-500/10 hover:border-cyan-500 hover:text-cyan-400 transition-all duration-300 rounded-lg sm:rounded-xl border-gray-600 text-black"
              >
                <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                <span className="truncate">Carta</span>
              </Button> */}



              <Button
                variant="outline"
                size="sm"
                onClick={() => handleButtonClick("reservas", "Reservas")}
                className="text-xs sm:text-sm h-9 sm:h-10 hover:bg-cyan-500/10 hover:border-cyan-500 hover:text-cyan-400 transition-all duration-300 rounded-lg sm:rounded-xl border-gray-600 text-black"
              >
                <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                <span className="truncate">Reservas</span>
              </Button>
              
              <Button
      
                variant="outline"
                size="sm"
                onClick={() => handleButtonClick("contacto", "Contacto")}
                className="text-xs sm:text-sm h-9 sm:h-10 hover:bg-cyan-500/10 hover:border-cyan-500 hover:text-cyan-400 transition-all duration-300 rounded-lg sm:rounded-xl border-gray-600 text-black"
              >
                <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                <span className="truncate">Contacto</span>
              </Button>

              {/*Este se usara cuando este la carta*/}
              {/* <Button
                variant="outline"
                size="sm"
                onClick={() => handleButtonClick("contacto", "Contacto")}
                className="text-xs sm:text-sm h-9 sm:h-10 hover:bg-cyan-500/10 hover:border-cyan-500 hover:text-cyan-400 transition-all duration-300 rounded-lg sm:rounded-xl border-gray-600 text-black col-span-2"
              >
                <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                <span className="truncate">Contacto</span>
              </Button> */}
            </div>
          </div>
        </Card>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        
        .animation-delay-400 {
          animation-delay: 400ms;
        }
      `}</style>
    </>
  )
}
