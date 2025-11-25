"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Clock, Trash2, Download, RefreshCw } from "lucide-react"
import { toast } from "sonner"

interface AuditEntry {
  id: string
  timestamp: string
  date: string
  time: string
  username: string
  action: string
  type: string
  details: string
}

export default function AuditLog() {
  const [logs, setLogs] = useState<AuditEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState("")

  const loadLogs = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/adminCamioneros/audit-log", {
        cache: "no-store",
      })

      if (!res.ok) throw new Error(`Error ${res.status}`)

      const data = await res.json()
      const rawLogs = data.logs || data.data || data || []

      const formatted = rawLogs
        .sort(
          (a: any, b: any) =>
            new Date(b.timestamp || b.createdAt).getTime() - new Date(a.timestamp || a.createdAt).getTime(),
        )
        .map((log: any) => ({
          id: log.id || log._id || crypto.randomUUID(),
          timestamp: log.timestamp || log.createdAt || new Date().toISOString(),
          date: new Date(log.timestamp || log.createdAt).toLocaleDateString("es-ES"),
          time: new Date(log.timestamp || log.createdAt).toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          username: log.username || log.user || "Sistema",
          action: log.action || "desconocida",
          type: log.type || "-",
          details: log.details || log.message || "-",
        }))

      setLogs(formatted)
    } catch (err) {
      console.error("Audit log error:", err)
      setError("No se han podido cargar los registros")
      setLogs([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLogs()
    const interval = setInterval(loadLogs, 15000)
    return () => clearInterval(interval)
  }, [])

  const clearLogs = async () => {
    if (!confirm("¿Borrar todo el registro de actividades?")) return
    try {
      const res = await fetch("/api/adminCamioneros/audit-log", {
        method: "DELETE",
        credentials: "include",
      })
      if (res.ok) {
        setLogs([])
        toast.success("Registro borrado")
      } else toast.error("Error al borrar")
    } catch {
      toast.error("Error de conexión")
    }
  }

  const downloadLogs = () => {
    const csv = [
      "Fecha,Hora,Usuario,Acción,Tipo,Detalles",
      ...logs.map((l) => `${l.date},${l.time},${l.username},${l.action},${l.type},"${l.details.replace(/"/g, '""')}"`),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `registro-camioneros-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success("Descargado")
  }

  const filteredLogs = logs.filter((log) =>
    `${log.username} ${log.action} ${log.details}`.toLowerCase().includes(filter.toLowerCase()),
  )

  const getBadgeColor = (action: string) => {
    switch (action.toLowerCase()) {
      case "crear":
        return "bg-emerald-100 text-emerald-800"
      case "editar":
        return "bg-blue-100 text-blue-800"
      case "eliminar":
        return "bg-red-100 text-red-800"
      case "login":
        return "bg-indigo-100 text-indigo-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Cabecera limpia y elegante */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Clock className="w-7 h-7 text-slate-600" />
            Registro de Actividades
          </h2>
          <p className="text-slate-600 mt-1">
            Aquí puedes ver todo lo que se hace en la web de Los Camioneros. Se actualiza automáticamente cada 15
            segundos.
          </p>
          <p className="text-sm text-slate-500 mt-2">
            Total de entradas: <span className="font-medium">{logs.length}</span>
          </p>
        </div>

        <div className="flex gap-3">
          <Button onClick={loadLogs} variant="outline" size="sm">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Actualizar
          </Button>
          <Button onClick={downloadLogs} disabled={!logs.length} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            CSV
          </Button>
          <Button onClick={clearLogs} disabled={!logs.length} variant="destructive">
            <Trash2 className="w-4 h-4 mr-2" />
            Limpiar
          </Button>
        </div>
      </div>

      {/* Buscador */}
      <Input
        placeholder="Buscar por usuario, acción o detalles..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="max-w-md"
      />

      {/* Estados */}
      {loading && (
        <Card className="p-10 text-center">
          <RefreshCw className="w-8 h-8 mx-auto text-slate-400 animate-spin" />
          <p className="mt-3 text-slate-600">Cargando registro...</p>
        </Card>
      )}

      {error && !loading && (
        <Card className="p-10 text-center border-red-200 bg-red-50">
          <p className="text-red-700 font-medium">{error}</p>
          <Button onClick={loadLogs} variant="outline" className="mt-4 bg-transparent">
            Reintentar
          </Button>
        </Card>
      )}

      {!loading && !error && filteredLogs.length === 0 && (
        <Card className="p-16 text-center">
          <Clock className="w-14 h-14 mx-auto text-slate-300 mb-4" />
          <p className="text-lg text-slate-600">
            {logs.length === 0 ? "Aún no hay actividad" : "Ningún registro coincide con la búsqueda"}
          </p>
        </Card>
      )}

      {!loading && !error && filteredLogs.length > 0 && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 border-b">
                <tr>
                  <th className="px-6 py-4 text-left font-medium text-slate-700">Fecha</th>
                  <th className="px-6 py-4 text-left font-medium text-slate-700">Hora</th>
                  <th className="px-6 py-4 text-left font-medium text-slate-700">Usuario</th>
                  <th className="px-6 py-4 text-left font-medium text-slate-700">Acción</th>
                  <th className="px-6 py-4 text-left font-medium text-slate-700">Tipo</th>
                  <th className="px-6 py-4 text-left font-medium text-slate-700">Detalles</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium">{log.date}</td>
                    <td className="px-6 py-4 text-slate-600">{log.time}</td>
                    <td className="px-6 py-4 font-medium">{log.username}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getBadgeColor(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{log.type}</td>
                    <td className="px-6 py-4 text-slate-600 max-w-md truncate" title={log.details}>
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
