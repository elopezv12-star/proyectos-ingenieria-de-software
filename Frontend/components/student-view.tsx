"use client"

import { useState } from "react"
import { toast } from "sonner"
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Upload,
  FileText,
  GraduationCap,
  Send,
  XCircle,
  Eye,
  Bell,
  Download,
  QrCode,
  Calendar,
  FileCheck,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// RF-24/25: Complete states including Observado and Rechazado
const steps = [
  { id: 1, label: "Iniciado", description: "Solicitud recibida", days: 2, date: "10 Feb 2026" },
  { id: 2, label: "Revision Academica", description: "Verificacion de creditos y pensum", days: 8, date: "12 Feb 2026" },
  { id: 3, label: "Revision Financiera", description: "Verificacion de solvencia", days: 12, date: "20 Feb 2026" },
  { id: 4, label: "Observacion", description: "Documentacion requiere correccion", days: 0, date: null },
  { id: 5, label: "Aprobado", description: "Tramite completado", days: 0, date: null },
  { id: 6, label: "Acta Generada", description: "Acta de graduacion emitida", days: 0, date: null },
]

const currentStep = 3

const requirements = [
  { id: 1, name: "Cierre de pensum completo", status: "cumplido" as const },
  { id: 2, name: "Examen privado aprobado", status: "cumplido" as const },
  { id: 3, name: "Trabajo de graduacion aprobado", status: "en-revision" as const },
  { id: 4, name: "Solvencia de biblioteca", status: "cumplido" as const },
  { id: 5, name: "Solvencia financiera", status: "pendiente" as const },
  { id: 6, name: "Constancia de EPS / Practica profesional", status: "en-revision" as const },
  { id: 7, name: "Fotocopia de DPI", status: "cumplido" as const },
  { id: 8, name: "Fotografias tamano cedula", status: "pendiente" as const },
]

// RF-38/39: Notification history
const notifications = [
  { id: 1, message: "Su solicitud GRAD-2026-1842 fue recibida exitosamente.", date: "10 Feb 2026", type: "info" as const, read: true },
  { id: 2, message: "Su solicitud avanzo a la etapa de Revision Academica.", date: "12 Feb 2026", type: "info" as const, read: true },
  { id: 3, message: "Validacion de creditos: Aprobada.", date: "15 Feb 2026", type: "success" as const, read: true },
  { id: 4, message: "Su solicitud avanzo a la etapa de Revision Financiera.", date: "20 Feb 2026", type: "info" as const, read: false },
  { id: 5, message: "Observacion: Solvencia financiera pendiente de verificacion. Por favor, acerquese a Tesoreria.", date: "22 Feb 2026", type: "warning" as const, read: false },
]

function StatusBadge({ status }: { status: "cumplido" | "pendiente" | "en-revision" }) {
  if (status === "cumplido") {
    return (
      <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
        <CheckCircle2 className="size-3" />
        Cumplido
      </Badge>
    )
  }
  if (status === "pendiente") {
    return (
      <Badge className="bg-amber-100 text-amber-700 border-amber-200">
        <AlertCircle className="size-3" />
        Pendiente
      </Badge>
    )
  }
  return (
    <Badge className="bg-sky-100 text-sky-700 border-sky-200">
      <Clock className="size-3" />
      En Revision
    </Badge>
  )
}

function NotificationBadge({ type }: { type: "info" | "success" | "warning" | "error" }) {
  switch (type) {
    case "success":
      return <span className="size-2 rounded-full bg-emerald-500 shrink-0" />
    case "warning":
      return <span className="size-2 rounded-full bg-amber-500 shrink-0" />
    case "error":
      return <span className="size-2 rounded-full bg-red-500 shrink-0" />
    default:
      return <span className="size-2 rounded-full bg-sky-500 shrink-0" />
  }
}

export function StudentView() {
  const [formData, setFormData] = useState({
    nombre: "",
    carne: "",
    carrera: "",
    modalidad: "",
    telefono: "",
    email: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [actaDialogOpen, setActaDialogOpen] = useState(false)
  const [notifTab, setNotifTab] = useState<string>("seguimiento")

  const unreadCount = notifications.filter((n) => !n.read).length

  // RF-26/27: Calculate total time
  const totalTimeInProcess = steps
    .filter((s) => s.id <= currentStep)
    .reduce((acc, s) => acc + s.days, 0)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formData.nombre || !formData.carne || !formData.carrera || !formData.modalidad) {
      toast.error("Por favor complete todos los campos obligatorios.")
      return
    }
    const tramite = `GRAD-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`
    setSubmitted(true)
    toast.success(`Solicitud recibida exitosamente. Su numero de tramite es: ${tramite}`, {
      duration: 8000,
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <GraduationCap className="size-6 text-primary" />
          Portal del Estudiante
        </h2>
        <p className="text-muted-foreground mt-1">Gestione su proceso de graduacion</p>
      </div>

      <Tabs value={notifTab} onValueChange={setNotifTab} className="w-full">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="seguimiento">Seguimiento</TabsTrigger>
          <TabsTrigger value="requisitos">Requisitos</TabsTrigger>
          <TabsTrigger value="solicitud">Nueva Solicitud</TabsTrigger>
          <TabsTrigger value="notificaciones" className="relative">
            Notificaciones
            {unreadCount > 0 && (
              <span className="ml-1.5 inline-flex size-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="acta">Acta</TabsTrigger>
        </TabsList>

        {/* SEGUIMIENTO TAB - RF-14/15 + RF-26/27 time tracking */}
        <TabsContent value="seguimiento">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-lg">Estado del Tramite</CardTitle>
                  <CardDescription>
                    Tramite No. GRAD-2026-1842 -- Ultima actualizacion: 22 Feb 2026
                  </CardDescription>
                </div>
                {/* RF-26/27: Time summary */}
                <div className="flex items-center gap-3 rounded-lg border bg-muted/50 px-4 py-2">
                  <Clock className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Tiempo total en proceso</p>
                    <p className="text-lg font-bold text-foreground">{totalTimeInProcess} dias</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-0">
                {steps.map((step, index) => {
                  const isCompleted = step.id < currentStep
                  const isCurrent = step.id === currentStep
                  const isPending = step.id > currentStep
                  const isObservado = step.label === "Observacion"
                  const isRechazado = step.label === "Rechazado"

                  return (
                    <div key={step.id} className="flex items-start gap-4">
                      {/* Timeline indicator */}
                      <div className="flex flex-col items-center">
                        <div
                          className={`flex size-10 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                            isCompleted
                              ? "border-emerald-500 bg-emerald-500 text-white"
                              : isCurrent
                                ? "border-primary bg-primary text-primary-foreground"
                                : isObservado && isPending
                                  ? "border-amber-300 bg-amber-50 text-amber-500"
                                  : isRechazado && isPending
                                    ? "border-red-300 bg-red-50 text-red-500"
                                    : "border-border bg-muted text-muted-foreground"
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="size-5" />
                          ) : isObservado && isPending ? (
                            <AlertCircle className="size-5" />
                          ) : isRechazado && isPending ? (
                            <XCircle className="size-5" />
                          ) : (
                            <span className="text-sm font-bold">{step.id}</span>
                          )}
                        </div>
                        {index < steps.length - 1 && (
                          <div
                            className={`w-0.5 h-12 ${
                              isCompleted ? "bg-emerald-500" : "bg-border"
                            }`}
                          />
                        )}
                      </div>
                      {/* Step content */}
                      <div className="pt-1.5 pb-8 flex-1">
                        <div className="flex items-center gap-3">
                          <p
                            className={`font-semibold text-sm ${
                              isPending ? "text-muted-foreground" : "text-foreground"
                            }`}
                          >
                            {step.label}
                          </p>
                          {/* RF-26: Time per stage */}
                          {step.days > 0 && (isCompleted || isCurrent) && (
                            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                              {step.days} dias
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                        {step.date && (isCompleted || isCurrent) && (
                          <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                            <Calendar className="size-3" />
                            {step.date}
                          </p>
                        )}
                        {isCurrent && (
                          <Badge className="mt-2 bg-primary/10 text-primary border-primary/20">
                            <Clock className="size-3" />
                            En progreso
                          </Badge>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* REQUISITOS TAB */}
        <TabsContent value="requisitos">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Lista de Requisitos</CardTitle>
              <CardDescription>
                Estado de cumplimiento de requisitos para graduacion
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                {requirements.map((req) => (
                  <div
                    key={req.id}
                    className="flex items-center justify-between rounded-lg border bg-card p-3"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="size-4 text-muted-foreground shrink-0" />
                      <span className="text-sm font-medium text-foreground">{req.name}</span>
                    </div>
                    <StatusBadge status={req.status} />
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-6 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="size-2.5 rounded-full bg-emerald-500" /> Cumplidos: {requirements.filter(r => r.status === "cumplido").length}
                </span>
                <span className="flex items-center gap-1">
                  <span className="size-2.5 rounded-full bg-sky-500" /> En Revision: {requirements.filter(r => r.status === "en-revision").length}
                </span>
                <span className="flex items-center gap-1">
                  <span className="size-2.5 rounded-full bg-amber-500" /> Pendientes: {requirements.filter(r => r.status === "pendiente").length}
                </span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SOLICITUD TAB - RF-09 to RF-13 + Modalidad */}
        <TabsContent value="solicitud">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Crear Solicitud de Graduacion</CardTitle>
              <CardDescription>
                Complete el formulario para iniciar su proceso de graduacion
              </CardDescription>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                  <div className="flex size-16 items-center justify-center rounded-full bg-emerald-100">
                    <CheckCircle2 className="size-8 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-lg">Solicitud Enviada</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Su solicitud ha sido recibida. Puede dar seguimiento desde la pestana de Seguimiento.
                    </p>
                  </div>
                  <Button variant="outline" onClick={() => setSubmitted(false)}>
                    Crear otra solicitud
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="nombre">Nombre completo *</Label>
                      <Input
                        id="nombre"
                        placeholder="Ingrese su nombre"
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="carne">Numero de carne *</Label>
                      <Input
                        id="carne"
                        placeholder="Ej. 201900001"
                        value={formData.carne}
                        onChange={(e) => setFormData({ ...formData, carne: e.target.value })}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="carrera">Carrera *</Label>
                      <Select
                        onValueChange={(value) => setFormData({ ...formData, carrera: value })}
                      >
                        <SelectTrigger id="carrera">
                          <SelectValue placeholder="Seleccione una carrera" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ing-sistemas">Ingenieria en Sistemas</SelectItem>
                          <SelectItem value="ing-industrial">Ingenieria Industrial</SelectItem>
                          <SelectItem value="lic-admin">Lic. en Administracion</SelectItem>
                          <SelectItem value="lic-derecho">Lic. en Ciencias Juridicas</SelectItem>
                          <SelectItem value="med-general">Medicina General</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {/* NEW: Modalidad de Graduacion */}
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="modalidad">Modalidad de Graduacion *</Label>
                      <Select
                        onValueChange={(value) => setFormData({ ...formData, modalidad: value })}
                      >
                        <SelectTrigger id="modalidad">
                          <SelectValue placeholder="Seleccione modalidad" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tesis">Tesis de Graduacion</SelectItem>
                          <SelectItem value="eps">Ejercicio Profesional Supervisado (EPS)</SelectItem>
                          <SelectItem value="examen-privado">Examen General Privado</SelectItem>
                          <SelectItem value="proyecto">Proyecto de Graduacion</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="telefono">Telefono</Label>
                      <Input
                        id="telefono"
                        placeholder="Ej. 5555-1234"
                        value={formData.telefono}
                        onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="email">Correo electronico</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="correo@universidad.edu"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label>Expediente Digital (Documentos Adjuntos)</Label>
                    <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 p-8 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="size-8 text-muted-foreground" />
                        <p className="text-sm font-medium text-foreground">
                          Arrastre archivos aqui o haga clic para subir
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PDF, JPG o PNG (max. 10MB por archivo)
                        </p>
                        <Button type="button" variant="outline" size="sm" className="mt-2">
                          Seleccionar archivos
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Button type="submit" className="w-full sm:w-auto sm:self-end">
                    <Send className="size-4" />
                    Enviar Solicitud
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* NOTIFICACIONES TAB - RF-16/RF-38/RF-39 */}
        <TabsContent value="notificaciones">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Bell className="size-5 text-primary" />
                    Historial de Notificaciones
                  </CardTitle>
                  <CardDescription>
                    Alertas y actualizaciones de su proceso de graduacion
                  </CardDescription>
                </div>
                <Badge variant="outline">
                  {unreadCount} sin leer
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`flex items-start gap-3 rounded-lg border p-3.5 transition-colors ${
                      notif.read ? "bg-card" : "bg-primary/5 border-primary/20"
                    }`}
                  >
                    <NotificationBadge type={notif.type} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${notif.read ? "text-foreground" : "text-foreground font-medium"}`}>
                        {notif.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <Calendar className="size-3" />
                        {notif.date}
                      </p>
                    </div>
                    {!notif.read && (
                      <Badge className="bg-primary text-primary-foreground text-[10px] shrink-0">
                        Nuevo
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ACTA TAB - HU-06 */}
        <TabsContent value="acta">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileCheck className="size-5 text-primary" />
                Acta de Graduacion
              </CardTitle>
              <CardDescription>
                Generacion y descarga de acta oficial con numero correlativo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-6 py-6">
                {/* Simulated Acta */}
                <div className="w-full max-w-lg rounded-lg border-2 border-primary/20 bg-card p-6">
                  <div className="text-center border-b pb-4 mb-4">
                    <GraduationCap className="size-10 mx-auto text-primary mb-2" />
                    <h3 className="font-bold text-foreground text-lg">UNIVERSIDAD</h3>
                    <p className="text-xs text-muted-foreground">ACTA DE GRADUACION</p>
                  </div>

                  <div className="flex flex-col gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">No. Correlativo:</span>
                      <span className="font-mono font-bold text-foreground">ACTA-2026-00347</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Estudiante:</span>
                      <span className="font-medium text-foreground">Maria Fernanda Lopez</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Carne:</span>
                      <span className="font-medium text-foreground">201900123</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Carrera:</span>
                      <span className="font-medium text-foreground">Ingenieria en Sistemas</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Modalidad:</span>
                      <span className="font-medium text-foreground">Tesis de Graduacion</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fecha de Emision:</span>
                      <span className="font-medium text-foreground">27 Feb 2026</span>
                    </div>
                  </div>

                  {/* QR Code Placeholder */}
                  <div className="mt-5 flex items-center justify-between border-t pt-4">
                    <div className="flex flex-col gap-1">
                      <p className="text-xs text-muted-foreground">Firma Digital</p>
                      <p className="text-xs font-mono text-foreground">SHA256:3f2a...b8c1</p>
                    </div>
                    <div className="flex size-16 items-center justify-center rounded-lg border-2 border-dashed border-primary/30 bg-primary/5">
                      <QrCode className="size-10 text-primary" />
                    </div>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground text-center max-w-md">
                  El acta se genera automaticamente al completar todos los requisitos y recibir la aprobacion final.
                  Incluye numero correlativo unico, codigo QR de verificacion y firma digital.
                </p>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => {
                    setActaDialogOpen(true)
                  }}>
                    <Eye className="size-4" />
                    Vista previa
                  </Button>
                  <Button onClick={() => toast.success("Descargando acta en formato PDF...")}>
                    <Download className="size-4" />
                    Descargar PDF
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Acta Preview Dialog */}
      <Dialog open={actaDialogOpen} onOpenChange={setActaDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Vista Previa del Acta</DialogTitle>
            <DialogDescription>
              Documento oficial con firmas digitales y codigo QR de autenticidad
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
            <GraduationCap className="size-12 mx-auto text-primary mb-3" />
            <p className="font-bold text-foreground text-base mb-1">ACTA DE GRADUACION No. ACTA-2026-00347</p>
            <p className="mb-4">
              Se hace constar que <span className="font-semibold text-foreground">Maria Fernanda Lopez</span>,
              con carne <span className="font-semibold text-foreground">201900123</span>,
              ha cumplido con todos los requisitos academicos y administrativos para obtener el titulo de
              <span className="font-semibold text-foreground"> Ingeniera en Sistemas </span>
              bajo la modalidad de <span className="font-semibold text-foreground">Tesis de Graduacion</span>.
            </p>
            <div className="flex items-center justify-center gap-6 border-t pt-4 mt-4">
              <div className="text-center">
                <div className="w-32 border-b border-foreground mb-1" />
                <p className="text-xs">Secretario General</p>
              </div>
              <div className="flex size-14 items-center justify-center rounded border border-dashed border-primary/40 bg-primary/5">
                <QrCode className="size-8 text-primary" />
              </div>
              <div className="text-center">
                <div className="w-32 border-b border-foreground mb-1" />
                <p className="text-xs">Rector</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
