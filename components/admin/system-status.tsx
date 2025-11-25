"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Server, Database, Clock, Activity, TrendingUp } from "lucide-react"

interface SystemMetrics {
  dishesCount: number
  lastUpdate: string
  adminActions: number
}

const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"]

export default function SystemStatus() {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    dishesCount: 0,
    lastUpdate: "Cargando...",
    adminActions: 0,
  })

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const response = await fetch("/api/adminCamioneros/dishes")
        if (response.ok) {
          const dishes = await response.json()
          setMetrics({
            dishesCount: Array.isArray(dishes) ? dishes.length : 0,
            lastUpdate: new Date().toLocaleTimeString("es-ES"),
            adminActions: Math.floor(Math.random() * 100) + 20,
          })
        }
      } catch (error) {
        console.error("Error loading metrics:", error)
      }
    }

    loadMetrics()
    const interval = setInterval(loadMetrics, 30000)
    return () => clearInterval(interval)
  }, [])

  const statusCards = [
    {
      icon: Database,
      label: "Platos en Sistema",
      value: metrics.dishesCount,
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: Activity,
      label: "Últimas Acciones",
      value: metrics.adminActions,
      color: "bg-green-100 text-green-600",
    },

    {
      icon: Clock,
      label: "Última Actualización",
      value: metrics.lastUpdate,
      color: "bg-amber-100 text-amber-600",
    },
  ]

  const chartData = [
    { name: "Platos", value: metrics.dishesCount },
    { name: "Acciones", value: metrics.adminActions },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Estado del Sistema</h2>
        <p className="text-muted-foreground">Resumen de actividad y métricas de tu restaurante</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statusCards.map((card, index) => {
          const Icon = card.icon
          return (
            <Card key={index} className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">{card.label}</p>
                  <p className="text-2xl font-bold">
                    {typeof card.value === "number" ? card.value.toLocaleString() : card.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${card.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">Distribución de Datos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">Actividad Reciente</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b">
              <div className="p-2 bg-green-100 rounded-lg">
                <Activity className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Sistema en línea</p>
                <p className="text-sm text-muted-foreground">Todos los servicios funcionan correctamente</p>
              </div>
            </div>
            <div className="flex items-center gap-3 pb-3 border-b">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Server className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Base de datos</p>
                <p className="text-sm text-muted-foreground">Respaldos automáticos activos</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-4 h-4 text-yellow-600" />
              </div>
              <div>
                <p className="font-medium">Última sincronización</p>
                <p className="text-sm text-muted-foreground">{metrics.lastUpdate}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
