"use client"

import { useState } from "react"
import { toast } from "sonner"
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ClipboardList,
  Eye,
  User,
  CreditCard,
  BookOpen,
  FileCheck,
  Search,
  Filter,
  Download,
  FileText,
  Clock,
  History,
  MessageSquare,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"

type EstadoType = "activo" | "observacion" | "aprobado" | "rechazado" | "finalizado"

type Document = {
  name: string
  type: string
  size: string
  uploaded: string
}

type Solicitud = {
  id: string
  nombre: string
  carne: string
  carrera: string
  modalidad: string
  etapa: string
  estado: EstadoType
  fecha: string
  creditos: boolean
  solvencia: boolean
  expediente: boolean
  tesis: boolean
  documents: Document[]
  tiempoEnEtapa: number
}

// RF-43/44: Audit log entries
type AuditEntry = {
  id: number
  timestamp: string
  user: string
  action: string
  target: string
  detail: string
}

const initialAuditLog: AuditEntry[] = [
  { id: 1, timestamp: "2026-02-27 09:14:22", user: "Lic. Carmen Gutierrez", action: "Aprobo", target: "GRAD-2026-1847", detail: "Validacion de creditos aprobada" },
  { id: 2, timestamp: "2026-02-26 15:30:10", user: "Lic. Carmen Gutierrez", action: "Observo", target: "GRAD-2026-1844", detail: "Se requiere constancia de EPS actualizada" },
  { id: 3, timestamp: "2026-02-26 11:05:45", user: "Lic. Carmen Gutierrez", action: "Aprobo", target: "GRAD-2026-1843", detail: "Solvencia financiera verificada" },
  { id: 4, timestamp: "2026-02-25 16:42:18", user: "Lic. Carmen Gutierrez", action: "Rechazo", target: "GRAD-2026-1844", detail: "Creditos insuficientes detectados" },
  { id: 5, timestamp: "2026-02-25 10:20:33", user: "Lic. Carmen Gutierrez", action: "Reviso", target: "GRAD-2026-1842", detail: "Inicio revision de expediente digital" },
  { id: 6, timestamp: "2026-02-24 14:15:50", user: "Lic. Carmen Gutierrez", action: "Aprobo", target: "GRAD-2026-1847", detail: "Aprobacion completa del tramite" },
  { id: 7, timestamp: "2026-02-24 09:00:12", user: "Sistema", action: "Notificacion", target: "GRAD-2026-1842", detail: "Alerta automatica: 8 dias en revision academica" },
  { id: 8, timestamp: "2026-02-23 17:30:00", user: "Lic. Carmen Gutierrez", action: "Aprobo", target: "GRAD-2026-1845", detail: "Validacion de creditos aprobada" },
]

const initialSolicitudes: Solicitud[] = [
  {
    id: "GRAD-2026-1842",
    nombre: "Maria Fernanda Lopez",
    carne: "201900123",
    carrera: "Ingenieria en Sistemas",
    modalidad: "Tesis",
    etapa: "Revision Academica",
    estado: "activo",
    fecha: "2026-02-10",
    creditos: true,
    solvencia: false,
    expediente: true,
    tesis: true,
    tiempoEnEtapa: 8,
    documents: [
      { name: "Cierre_Pensum.pdf", type: "PDF", size: "1.2 MB", uploaded: "10 Feb 2026" },
      { name: "Constancia_EPS.pdf", type: "PDF", size: "890 KB", uploaded: "10 Feb 2026" },
      { name: "DPI_Scan.jpg", type: "JPG", size: "2.1 MB", uploaded: "10 Feb 2026" },
    ],
  },
  {
    id: "GRAD-2026-1843",
    nombre: "Carlos Alberto Ramirez",
    carne: "201800456",
    carrera: "Ingenieria Industrial",
    modalidad: "Examen Privado",
    etapa: "Revision Financiera",
    estado: "activo",
    fecha: "2026-02-08",
    creditos: true,
    solvencia: true,
    expediente: true,
    tesis: true,
    tiempoEnEtapa: 5,
    documents: [
      { name: "Solvencia_Biblioteca.pdf", type: "PDF", size: "450 KB", uploaded: "08 Feb 2026" },
      { name: "Solvencia_Financiera.pdf", type: "PDF", size: "320 KB", uploaded: "08 Feb 2026" },
    ],
  },
  {
    id: "GRAD-2026-1844",
    nombre: "Ana Lucia Morales",
    carne: "201900789",
    carrera: "Lic. en Administracion",
    modalidad: "EPS",
    etapa: "Revision Academica",
    estado: "observacion",
    fecha: "2026-02-12",
    creditos: false,
    solvencia: true,
    expediente: true,
    tesis: false,
    tiempoEnEtapa: 6,
    documents: [
      { name: "Pensum_Parcial.pdf", type: "PDF", size: "1.5 MB", uploaded: "12 Feb 2026" },
    ],
  },
  {
    id: "GRAD-2026-1845",
    nombre: "Jose Miguel Santos",
    carne: "201700234",
    carrera: "Lic. en Ciencias Juridicas",
    modalidad: "Tesis",
    etapa: "Revision Financiera",
    estado: "activo",
    fecha: "2026-02-05",
    creditos: true,
    solvencia: false,
    expediente: true,
    tesis: true,
    tiempoEnEtapa: 10,
    documents: [
      { name: "Tesis_Final.pdf", type: "PDF", size: "5.4 MB", uploaded: "05 Feb 2026" },
      { name: "Acta_Examen_Privado.pdf", type: "PDF", size: "780 KB", uploaded: "05 Feb 2026" },
    ],
  },
  {
    id: "GRAD-2026-1846",
    nombre: "Gabriela Mendez Ruiz",
    carne: "202000567",
    carrera: "Medicina General",
    modalidad: "Tesis",
    etapa: "Revision Academica",
    estado: "activo",
    fecha: "2026-02-15",
    creditos: true,
    solvencia: true,
    expediente: false,
    tesis: true,
    tiempoEnEtapa: 3,
    documents: [
      { name: "Fotos_Cedula.zip", type: "ZIP", size: "3.2 MB", uploaded: "15 Feb 2026" },
    ],
  },
  {
    id: "GRAD-2026-1847",
    nombre: "Roberto Castillo Paz",
    carne: "201800890",
    carrera: "Ingenieria en Sistemas",
    modalidad: "Examen Privado",
    etapa: "Finalizado",
    estado: "finalizado",
    fecha: "2026-01-20",
    creditos: true,
    solvencia: true,
    expediente: true,
    tesis: true,
    tiempoEnEtapa: 0,
    documents: [
      { name: "Expediente_Completo.pdf", type: "PDF", size: "8.7 MB", uploaded: "20 Ene 2026" },
    ],
  },
]

function EstadoBadge({ estado }: { estado: EstadoType }) {
  switch (estado) {
    case "activo":
      return <Badge className="bg-sky-100 text-sky-700 border-sky-200">Activo</Badge>
    case "observacion":
      return <Badge className="bg-amber-100 text-amber-700 border-amber-200">Observacion</Badge>
    case "aprobado":
      return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Aprobado</Badge>
    case "rechazado":
      return <Badge className="bg-red-100 text-red-700 border-red-200">Rechazado</Badge>
    case "finalizado":
      return <Badge className="bg-primary/10 text-primary border-primary/20">Finalizado</Badge>
  }
}

function AuditActionBadge({ action }: { action: string }) {
  switch (action) {
    case "Aprobo":
      return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">{action}</Badge>
    case "Rechazo":
      return <Badge className="bg-red-100 text-red-700 border-red-200">{action}</Badge>
    case "Observo":
      return <Badge className="bg-amber-100 text-amber-700 border-amber-200">{action}</Badge>
    case "Notificacion":
      return <Badge className="bg-sky-100 text-sky-700 border-sky-200">{action}</Badge>
    default:
      return <Badge variant="outline">{action}</Badge>
  }
}

function ValidationItem({
  label,
  icon: Icon,
  validated,
  onApprove,
  onReject,
  onObserve,
}: {
  label: string
  icon: React.ComponentType<{ className?: string }>
  validated: boolean
  onApprove: () => void
  onReject: () => void
  onObserve: () => void
}) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border bg-muted/30 p-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <Icon className="size-4 text-muted-foreground" />
        <span className="text-sm font-medium text-foreground">{label}</span>
        {validated ? (
          <CheckCircle2 className="size-4 text-emerald-500" />
        ) : (
          <XCircle className="size-4 text-red-400" />
        )}
      </div>
      <div className="flex items-center gap-1">
        <Button size="sm" variant="outline" className="h-7 text-xs bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100" onClick={onApprove}>
          <CheckCircle2 className="size-3" />
          Aprobar
        </Button>
        <Button size="sm" variant="outline" className="h-7 text-xs bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100" onClick={onObserve}>
          <AlertTriangle className="size-3" />
          Observar
        </Button>
        <Button size="sm" variant="outline" className="h-7 text-xs bg-red-50 text-red-700 border-red-200 hover:bg-red-100" onClick={onReject}>
          <XCircle className="size-3" />
          Rechazar
        </Button>
      </div>
    </div>
  )
}

export function AdminView() {
  const [solicitudes, setSolicitudes] = useState(initialSolicitudes)
  const [auditLog, setAuditLog] = useState(initialAuditLog)
  const [selectedSolicitud, setSelectedSolicitud] = useState<Solicitud | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCarrera, setFilterCarrera] = useState("todas")
  const [filterEstado, setFilterEstado] = useState("todos")
  const [filterFechaDesde, setFilterFechaDesde] = useState("")
  // HU-04: Mandatory observation text
  const [observationText, setObservationText] = useState("")
  const [showObservationRequired, setShowObservationRequired] = useState(false)

  // HU-04: Advanced filters
  const filteredSolicitudes = solicitudes.filter((s) => {
    const matchSearch =
      s.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.carne.includes(searchTerm)
    const matchCarrera = filterCarrera === "todas" || s.carrera === filterCarrera
    const matchEstado = filterEstado === "todos" || s.estado === filterEstado
    const matchFecha = !filterFechaDesde || s.fecha >= filterFechaDesde
    return matchSearch && matchCarrera && matchEstado && matchFecha
  })

  function openExpediente(solicitud: Solicitud) {
    setSelectedSolicitud(solicitud)
    setDialogOpen(true)
    setObservationText("")
    setShowObservationRequired(false)
  }

  function addAuditEntry(action: string, target: string, detail: string) {
    const entry: AuditEntry = {
      id: auditLog.length + 1,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      user: "Lic. Carmen Gutierrez",
      action,
      target,
      detail,
    }
    setAuditLog((prev) => [entry, ...prev])
  }

  function handleValidationAction(field: keyof Solicitud, value: boolean, action: string) {
    if (!selectedSolicitud) return
    const updated = solicitudes.map((s) =>
      s.id === selectedSolicitud.id ? { ...s, [field]: value } : s
    )
    setSolicitudes(updated)
    const updatedItem = updated.find((s) => s.id === selectedSolicitud.id)
    if (updatedItem) setSelectedSolicitud(updatedItem as Solicitud)
    addAuditEntry(value ? "Aprobo" : "Rechazo", selectedSolicitud.id, `Validacion ${action}`)
    toast.success(`Validacion ${action} exitosamente.`)
  }

  function handleObserve(field: string) {
    if (!selectedSolicitud) return
    if (!observationText.trim()) {
      setShowObservationRequired(true)
      toast.error("Debe ingresar una observacion antes de marcar como 'Observar'.")
      return
    }
    setShowObservationRequired(false)
    const updated = solicitudes.map((s) =>
      s.id === selectedSolicitud.id ? { ...s, estado: "observacion" as const } : s
    )
    setSolicitudes(updated)
    const updatedItem = updated.find((s) => s.id === selectedSolicitud.id)
    if (updatedItem) setSelectedSolicitud(updatedItem as Solicitud)
    addAuditEntry("Observo", selectedSolicitud.id, `${field}: ${observationText}`)
    toast.warning(`Observacion registrada: ${observationText}`)
    setObservationText("")
  }

  function handleFullApprove() {
    if (!selectedSolicitud) return
    const updated = solicitudes.map((s) =>
      s.id === selectedSolicitud.id
        ? { ...s, estado: "aprobado" as const, etapa: "Aprobado", creditos: true, solvencia: true, expediente: true, tesis: true }
        : s
    )
    setSolicitudes(updated)
    addAuditEntry("Aprobo", selectedSolicitud.id, "Aprobacion completa del tramite")
    setDialogOpen(false)
    toast.success(`Solicitud ${selectedSolicitud.id} aprobada completamente.`)
  }

  function handleFullReject() {
    if (!selectedSolicitud) return
    if (!observationText.trim()) {
      setShowObservationRequired(true)
      toast.error("Debe ingresar el motivo de rechazo antes de rechazar.")
      return
    }
    const updated = solicitudes.map((s) =>
      s.id === selectedSolicitud.id ? { ...s, estado: "rechazado" as const } : s
    )
    setSolicitudes(updated)
    addAuditEntry("Rechazo", selectedSolicitud.id, `Motivo: ${observationText}`)
    setDialogOpen(false)
    toast.error(`Solicitud ${selectedSolicitud.id} ha sido rechazada.`)
    setObservationText("")
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <ClipboardList className="size-6 text-primary" />
          Panel de Administracion
        </h2>
        <p className="text-muted-foreground mt-1">Validacion academica y financiera de solicitudes</p>
      </div>

      <Tabs defaultValue="solicitudes">
        <TabsList>
          <TabsTrigger value="solicitudes">Bandeja de Solicitudes</TabsTrigger>
          <TabsTrigger value="auditoria">
            <History className="size-3.5" />
            Bitacora de Auditoria
          </TabsTrigger>
        </TabsList>

        {/* SOLICITUDES TAB */}
        <TabsContent value="solicitudes">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle className="text-lg">Bandeja de Solicitudes</CardTitle>
                    <CardDescription>
                      {filteredSolicitudes.length} solicitudes encontradas
                    </CardDescription>
                  </div>
                  <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por nombre, tramite o carne..."
                      className="pl-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                {/* HU-04: Advanced Filters */}
                <div className="flex flex-col gap-3 rounded-lg border bg-muted/30 p-4 sm:flex-row sm:items-end">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground shrink-0">
                    <Filter className="size-4" />
                    Filtros:
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label className="text-xs text-muted-foreground">Carrera</Label>
                    <Select value={filterCarrera} onValueChange={setFilterCarrera}>
                      <SelectTrigger className="w-full sm:w-48 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todas">Todas las carreras</SelectItem>
                        <SelectItem value="Ingenieria en Sistemas">Ing. en Sistemas</SelectItem>
                        <SelectItem value="Ingenieria Industrial">Ing. Industrial</SelectItem>
                        <SelectItem value="Lic. en Administracion">Lic. en Administracion</SelectItem>
                        <SelectItem value="Lic. en Ciencias Juridicas">Lic. en Ciencias Juridicas</SelectItem>
                        <SelectItem value="Medicina General">Medicina General</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label className="text-xs text-muted-foreground">Estado</Label>
                    <Select value={filterEstado} onValueChange={setFilterEstado}>
                      <SelectTrigger className="w-full sm:w-40 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos</SelectItem>
                        <SelectItem value="activo">Activo</SelectItem>
                        <SelectItem value="observacion">Observacion</SelectItem>
                        <SelectItem value="aprobado">Aprobado</SelectItem>
                        <SelectItem value="rechazado">Rechazado</SelectItem>
                        <SelectItem value="finalizado">Finalizado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label className="text-xs text-muted-foreground">Fecha desde</Label>
                    <Input
                      type="date"
                      className="w-full sm:w-40 h-8 text-xs"
                      value={filterFechaDesde}
                      onChange={(e) => setFilterFechaDesde(e.target.value)}
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => {
                      setFilterCarrera("todas")
                      setFilterEstado("todos")
                      setFilterFechaDesde("")
                      setSearchTerm("")
                    }}
                  >
                    Limpiar filtros
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">No. Tramite</TableHead>
                      <TableHead className="font-semibold">Estudiante</TableHead>
                      <TableHead className="font-semibold">Carne</TableHead>
                      <TableHead className="font-semibold">Carrera</TableHead>
                      <TableHead className="font-semibold">Etapa</TableHead>
                      <TableHead className="font-semibold">Estado</TableHead>
                      <TableHead className="font-semibold">Dias</TableHead>
                      <TableHead className="font-semibold text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSolicitudes.map((solicitud) => (
                      <TableRow
                        key={solicitud.id}
                        className="cursor-pointer hover:bg-muted/30 transition-colors"
                        onClick={() => openExpediente(solicitud)}
                      >
                        <TableCell className="font-mono text-sm font-medium">{solicitud.id}</TableCell>
                        <TableCell className="font-medium">{solicitud.nombre}</TableCell>
                        <TableCell className="text-muted-foreground">{solicitud.carne}</TableCell>
                        <TableCell className="text-muted-foreground text-xs">{solicitud.carrera}</TableCell>
                        <TableCell className="text-muted-foreground text-xs">{solicitud.etapa}</TableCell>
                        <TableCell>
                          <EstadoBadge estado={solicitud.estado} />
                        </TableCell>
                        <TableCell>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="size-3" />
                            {solicitud.tiempoEnEtapa}d
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7"
                            onClick={(e) => {
                              e.stopPropagation()
                              openExpediente(solicitud)
                            }}
                          >
                            <Eye className="size-3" />
                            Ver
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredSolicitudes.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          No se encontraron solicitudes con los filtros aplicados.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AUDITORIA TAB - RF-43/44 */}
        <TabsContent value="auditoria">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <History className="size-5 text-primary" />
                Bitacora de Auditoria y Trazabilidad
              </CardTitle>
              <CardDescription>
                Historial completo de acciones realizadas en el sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">Fecha y Hora</TableHead>
                      <TableHead className="font-semibold">Usuario</TableHead>
                      <TableHead className="font-semibold">Accion</TableHead>
                      <TableHead className="font-semibold">Tramite</TableHead>
                      <TableHead className="font-semibold">Detalle</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditLog.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell className="font-mono text-xs whitespace-nowrap">{entry.timestamp}</TableCell>
                        <TableCell className="text-sm">{entry.user}</TableCell>
                        <TableCell>
                          <AuditActionBadge action={entry.action} />
                        </TableCell>
                        <TableCell className="font-mono text-xs font-medium">{entry.target}</TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-xs truncate">{entry.detail}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Expediente Digital Dialog - Enhanced */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedSolicitud && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileCheck className="size-5 text-primary" />
                  Expediente Digital -- {selectedSolicitud.id}
                </DialogTitle>
                <DialogDescription>
                  Revision completa del expediente del estudiante
                </DialogDescription>
              </DialogHeader>

              {/* Student Info */}
              <div className="grid grid-cols-2 gap-4 rounded-lg border bg-muted/30 p-4">
                <div className="flex items-center gap-2">
                  <User className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Estudiante</p>
                    <p className="text-sm font-medium text-foreground">{selectedSolicitud.nombre}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Carne</p>
                    <p className="text-sm font-medium text-foreground">{selectedSolicitud.carne}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Carrera</p>
                    <p className="text-sm font-medium text-foreground">{selectedSolicitud.carrera}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Modalidad</p>
                  <p className="text-sm font-medium text-foreground">{selectedSolicitud.modalidad}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Estado</p>
                  <div className="mt-0.5">
                    <EstadoBadge estado={selectedSolicitud.estado} />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Tiempo en etapa</p>
                    <p className="text-sm font-medium text-foreground">{selectedSolicitud.tiempoEnEtapa} dias</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* RF-40 to RF-42: Documents Section */}
              <div className="flex flex-col gap-3">
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <FileText className="size-4" />
                  Documentos Adjuntos ({selectedSolicitud.documents.length})
                </h4>
                <div className="flex flex-col gap-2">
                  {selectedSolicitud.documents.map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between rounded-lg border bg-card p-3">
                      <div className="flex items-center gap-3">
                        <div className="flex size-8 items-center justify-center rounded bg-primary/10">
                          <FileText className="size-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">{doc.type} - {doc.size} - {doc.uploaded}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => toast.info(`Visualizando ${doc.name}...`)}>
                          <Eye className="size-3" />
                          Ver
                        </Button>
                        <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => toast.success(`Descargando ${doc.name}...`)}>
                          <Download className="size-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Validations */}
              <div className="flex flex-col gap-3">
                <h4 className="text-sm font-semibold text-foreground">Validaciones</h4>
                <ValidationItem
                  label="Validacion de Creditos"
                  icon={BookOpen}
                  validated={selectedSolicitud.creditos}
                  onApprove={() => handleValidationAction("creditos", true, "de creditos aprobada")}
                  onReject={() => handleValidationAction("creditos", false, "de creditos rechazada")}
                  onObserve={() => handleObserve("Validacion de Creditos")}
                />
                <ValidationItem
                  label="Solvencia Financiera"
                  icon={CreditCard}
                  validated={selectedSolicitud.solvencia}
                  onApprove={() => handleValidationAction("solvencia", true, "de solvencia aprobada")}
                  onReject={() => handleValidationAction("solvencia", false, "de solvencia rechazada")}
                  onObserve={() => handleObserve("Solvencia Financiera")}
                />
                <ValidationItem
                  label="Expediente Digital Completo"
                  icon={FileCheck}
                  validated={selectedSolicitud.expediente}
                  onApprove={() => handleValidationAction("expediente", true, "de expediente aprobada")}
                  onReject={() => handleValidationAction("expediente", false, "de expediente rechazada")}
                  onObserve={() => handleObserve("Expediente Digital")}
                />
                <ValidationItem
                  label="Trabajo de Graduacion / Tesis"
                  icon={GraduationCapIcon}
                  validated={selectedSolicitud.tesis}
                  onApprove={() => handleValidationAction("tesis", true, "de tesis aprobada")}
                  onReject={() => handleValidationAction("tesis", false, "de tesis rechazada")}
                  onObserve={() => handleObserve("Trabajo de Graduacion")}
                />
              </div>

              <Separator />

              {/* HU-04: Mandatory Observation field */}
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <MessageSquare className="size-4" />
                  Observacion / Motivo de Rechazo
                  {showObservationRequired && (
                    <span className="text-xs text-red-500 font-normal">(Requerido para observar o rechazar)</span>
                  )}
                </Label>
                <Textarea
                  placeholder="Ingrese la observacion o motivo de rechazo antes de ejecutar la accion..."
                  value={observationText}
                  onChange={(e) => {
                    setObservationText(e.target.value)
                    if (e.target.value.trim()) setShowObservationRequired(false)
                  }}
                  className={showObservationRequired ? "border-red-400 focus-visible:ring-red-400" : ""}
                  rows={3}
                />
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cerrar
                </Button>
                <Button
                  variant="outline"
                  className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                  onClick={handleFullReject}
                >
                  <XCircle className="size-4" />
                  Rechazar Todo
                </Button>
                <Button onClick={handleFullApprove}>
                  <CheckCircle2 className="size-4" />
                  Aprobar Todo
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function GraduationCapIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  )
}
