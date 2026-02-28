"use client"

import { useState, useMemo } from "react"
import { toast } from "sonner"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  LabelList,
  PieChart,
  Pie,
  Legend,
  Tooltip,
} from "recharts"
import {
  LayoutDashboard,
  ClipboardCheck,
  Clock,
  AlertTriangle,
  TrendingDown,
  Zap,
  Download,
  FileSpreadsheet,
  Filter,
  Users,
  XCircle,
  BarChart3,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const BASE_TIME_ASIS = 45 // days

const NAVY = "#1a2744"
const TEAL = "#0ea5e9"
const EMERALD = "#10b981"
const AMBER = "#f59e0b"
const RED = "#ef4444"

// HU-09: Historical statistics data
const graduadosPorCarrera = [
  { carrera: "Ing. Sistemas", graduados: 42, rechazados: 5 },
  { carrera: "Ing. Industrial", graduados: 38, rechazados: 3 },
  { carrera: "Lic. Admin", graduados: 29, rechazados: 7 },
  { carrera: "Ciencias Jur.", graduados: 35, rechazados: 4 },
  { carrera: "Medicina", graduados: 22, rechazados: 2 },
]

const comparativaSemestral = [
  { periodo: "2024-1", solicitudes: 85, aprobados: 68, rechazados: 12, tiempo: 52 },
  { periodo: "2024-2", solicitudes: 92, aprobados: 75, rechazados: 10, tiempo: 48 },
  { periodo: "2025-1", solicitudes: 98, aprobados: 82, rechazados: 8, tiempo: 46 },
  { periodo: "2025-2", solicitudes: 105, aprobados: 90, rechazados: 7, tiempo: 45 },
  { periodo: "2026-1", solicitudes: 110, aprobados: 24, rechazados: 3, tiempo: 45 },
]

const estadoDistribution = [
  { name: "En Revision", value: 15, fill: TEAL },
  { name: "Observacion", value: 4, fill: AMBER },
  { name: "Aprobados", value: 3, fill: EMERALD },
  { name: "Rechazados", value: 2, fill: RED },
]

export function DirectorView() {
  const [stageReduction, setStageReduction] = useState([0])
  const [automationLevel, setAutomationLevel] = useState([0])
  const [resourceAllocation, setResourceAllocation] = useState([0])
  const [autoValidation, setAutoValidation] = useState(false)
  // RF-31: Filters
  const [filterCarrera, setFilterCarrera] = useState("todas")
  const [filterPeriodo, setFilterPeriodo] = useState("todos")

  const optimization = useMemo(() => {
    const stageEffect = stageReduction[0] * 0.08
    const automationEffect = automationLevel[0] * 0.06
    const resourceEffect = resourceAllocation[0] * 0.04
    const autoValidationEffect = autoValidation ? 5 : 0

    const totalReduction = stageEffect + automationEffect + resourceEffect + autoValidationEffect
    const timeToBe = Math.max(BASE_TIME_ASIS - totalReduction, 8)
    const improvement = ((BASE_TIME_ASIS - timeToBe) / BASE_TIME_ASIS) * 100

    return {
      timeToBe: Math.round(timeToBe),
      improvement: Math.round(improvement),
    }
  }, [stageReduction, automationLevel, resourceAllocation, autoValidation])

  const chartData = [
    { name: "AS-IS (Actual)", value: BASE_TIME_ASIS, type: "asis" },
    { name: "TO-BE (Optimizado)", value: optimization.timeToBe, type: "tobe" },
  ]

  // Filtered stats
  const filteredGraduados = filterCarrera === "todas"
    ? graduadosPorCarrera
    : graduadosPorCarrera.filter((g) => g.carrera === filterCarrera)

  const filteredSemestral = filterPeriodo === "todos"
    ? comparativaSemestral
    : comparativaSemestral.filter((s) => s.periodo === filterPeriodo)

  // Calculate overall stats from filtered data
  const totalGraduados = filteredGraduados.reduce((a, b) => a + b.graduados, 0)
  const totalRechazados = filteredGraduados.reduce((a, b) => a + b.rechazados, 0)
  const tasaRechazo = totalGraduados + totalRechazados > 0
    ? Math.round((totalRechazados / (totalGraduados + totalRechazados)) * 100)
    : 0

  // RF-32: Export functions
  function handleExportPDF() {
    toast.success("Generando reporte en PDF... El archivo se descargara automaticamente.")
  }

  function handleExportExcel() {
    toast.success("Generando reporte en Excel... El archivo se descargara automaticamente.")
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <LayoutDashboard className="size-6 text-primary" />
            Dashboard Ejecutivo
          </h2>
          <p className="text-muted-foreground mt-1">Vision general, estadisticas y modulo de simulacion</p>
        </div>
        {/* RF-32/HU-10: Export buttons */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExportPDF}>
            <Download className="size-4" />
            Exportar PDF
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportExcel}>
            <FileSpreadsheet className="size-4" />
            Exportar Excel
          </Button>
        </div>
      </div>

      {/* RF-31: Dashboard Filters */}
      <div className="flex flex-col gap-3 rounded-lg border bg-muted/30 p-4 sm:flex-row sm:items-end">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground shrink-0">
          <Filter className="size-4" />
          Filtros del Dashboard:
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-xs text-muted-foreground">Carrera</Label>
          <Select value={filterCarrera} onValueChange={setFilterCarrera}>
            <SelectTrigger className="w-full sm:w-48 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas las carreras</SelectItem>
              <SelectItem value="Ing. Sistemas">Ing. en Sistemas</SelectItem>
              <SelectItem value="Ing. Industrial">Ing. Industrial</SelectItem>
              <SelectItem value="Lic. Admin">Lic. en Administracion</SelectItem>
              <SelectItem value="Ciencias Jur.">Ciencias Juridicas</SelectItem>
              <SelectItem value="Medicina">Medicina General</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-xs text-muted-foreground">Periodo Academico</Label>
          <Select value={filterPeriodo} onValueChange={setFilterPeriodo}>
            <SelectTrigger className="w-full sm:w-36 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="2026-1">2026-1</SelectItem>
              <SelectItem value="2025-2">2025-2</SelectItem>
              <SelectItem value="2025-1">2025-1</SelectItem>
              <SelectItem value="2024-2">2024-2</SelectItem>
              <SelectItem value="2024-1">2024-1</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs"
          onClick={() => {
            setFilterCarrera("todas")
            setFilterPeriodo("todos")
          }}
        >
          Limpiar
        </Button>
      </div>

      {/* KPI Cards - Enhanced */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-start gap-4 pt-6">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <ClipboardCheck className="size-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Solicitudes Activas</p>
              <p className="text-3xl font-bold text-foreground">24</p>
              <p className="text-xs text-muted-foreground mt-1">+3 esta semana</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-start gap-4 pt-6">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-sky-100">
              <Clock className="size-6 text-sky-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tiempo Promedio</p>
              <p className="text-3xl font-bold text-foreground">45 dias</p>
              <p className="text-xs text-muted-foreground mt-1">Proceso completo</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-start gap-4 pt-6">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-amber-100">
              <AlertTriangle className="size-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Mayor Retraso</p>
              <p className="text-base font-bold text-foreground text-balance">Rev. Financiera</p>
              <p className="text-xs text-muted-foreground mt-1">Promedio: 12 dias</p>
            </div>
          </CardContent>
        </Card>

        {/* New KPI: Rejection rate */}
        <Card>
          <CardContent className="flex items-start gap-4 pt-6">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-red-100">
              <XCircle className="size-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tasa de Rechazo</p>
              <p className="text-3xl font-bold text-foreground">{tasaRechazo}%</p>
              <p className="text-xs text-muted-foreground mt-1">{totalRechazados} de {totalGraduados + totalRechazados} tramites</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="estadisticas">
        <TabsList>
          <TabsTrigger value="estadisticas">
            <BarChart3 className="size-3.5" />
            Estadisticas Historicas
          </TabsTrigger>
          <TabsTrigger value="simulacion">
            <Zap className="size-3.5" />
            Simulacion de Consultoria
          </TabsTrigger>
        </TabsList>

        {/* HU-09: Historical Statistics Tab */}
        <TabsContent value="estadisticas">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Graduados por Carrera */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="size-4 text-primary" />
                  Graduados por Carrera
                </CardTitle>
                <CardDescription>Total de graduados y rechazados por carrera</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    graduados: { label: "Graduados", color: EMERALD },
                    rechazados: { label: "Rechazados", color: RED },
                  }}
                  className="h-[280px] w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={filteredGraduados}
                      margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
                      barGap={4}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="carrera" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="graduados" fill={EMERALD} radius={[4, 4, 0, 0]} name="Graduados" />
                      <Bar dataKey="rechazados" fill={RED} radius={[4, 4, 0, 0]} name="Rechazados" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Distribution Pie */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Distribucion de Estado Actual</CardTitle>
                <CardDescription>Solicitudes activas por estado</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    revision: { label: "En Revision", color: TEAL },
                    observacion: { label: "Observacion", color: AMBER },
                    aprobados: { label: "Aprobados", color: EMERALD },
                    rechazados: { label: "Rechazados", color: RED },
                  }}
                  className="h-[280px] w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={estadoDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={3}
                        dataKey="value"
                        nameKey="name"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {estadoDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Comparativa Semestral */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Comparativa Semestral</CardTitle>
                <CardDescription>Evolucion de solicitudes, aprobaciones y tiempo promedio por semestre</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    solicitudes: { label: "Solicitudes", color: NAVY },
                    aprobados: { label: "Aprobados", color: EMERALD },
                    rechazados: { label: "Rechazados", color: RED },
                  }}
                  className="h-[300px] w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={filteredSemestral}
                      margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
                      barGap={2}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="periodo" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="solicitudes" fill={NAVY} radius={[4, 4, 0, 0]} name="Solicitudes" />
                      <Bar dataKey="aprobados" fill={EMERALD} radius={[4, 4, 0, 0]} name="Aprobados" />
                      <Bar dataKey="rechazados" fill={RED} radius={[4, 4, 0, 0]} name="Rechazados" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
                {/* Time per semester summary */}
                <div className="mt-4 flex flex-wrap gap-3">
                  {filteredSemestral.map((sem) => (
                    <div key={sem.periodo} className="flex items-center gap-2 rounded-lg border bg-muted/30 px-3 py-1.5">
                      <span className="text-xs font-medium text-foreground">{sem.periodo}:</span>
                      <span className="text-xs text-muted-foreground">{sem.tiempo} dias prom.</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Simulation Module Tab */}
        <TabsContent value="simulacion">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="size-5 text-sky-600" />
                Modulo de Simulacion de Consultoria
              </CardTitle>
              <CardDescription>
                Ajuste las variables del proceso para simular la optimizacion AS-IS vs TO-BE
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Controls (Left) */}
                <div className="flex flex-col gap-6">
                  <h3 className="font-semibold text-foreground text-sm">Variables del Proceso</h3>

                  {/* Stage Reduction */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Reducir numero de etapas</Label>
                      <span className="text-sm font-semibold text-primary">
                        {stageReduction[0]}
                        {stageReduction[0] === 1 ? " etapa" : " etapas"}
                      </span>
                    </div>
                    <Slider
                      value={stageReduction}
                      onValueChange={setStageReduction}
                      max={5}
                      min={0}
                      step={1}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Sin cambios</span>
                      <span>Maximo</span>
                    </div>
                  </div>

                  {/* Automation Level */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Nivel de automatizacion</Label>
                      <span className="text-sm font-semibold text-primary">
                        {automationLevel[0]}%
                      </span>
                    </div>
                    <Slider
                      value={automationLevel}
                      onValueChange={setAutomationLevel}
                      max={100}
                      min={0}
                      step={5}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Manual</span>
                      <span>Totalmente automatizado</span>
                    </div>
                  </div>

                  {/* Resource Allocation */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Asignacion de recursos/revisores</Label>
                      <span className="text-sm font-semibold text-primary">
                        +{resourceAllocation[0]} revisores
                      </span>
                    </div>
                    <Slider
                      value={resourceAllocation}
                      onValueChange={setResourceAllocation}
                      max={10}
                      min={0}
                      step={1}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Actual</span>
                      <span>+10 revisores</span>
                    </div>
                  </div>

                  {/* Auto Validation Switch */}
                  <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-4">
                    <div>
                      <Label className="text-sm font-medium">Validacion automatica</Label>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Activar validaciones automaticas para documentos digitales
                      </p>
                    </div>
                    <Switch
                      checked={autoValidation}
                      onCheckedChange={setAutoValidation}
                    />
                  </div>
                </div>

                {/* Chart (Right) */}
                <div className="flex flex-col gap-4">
                  <h3 className="font-semibold text-foreground text-sm">Comparativa AS-IS vs TO-BE</h3>

                  <ChartContainer
                    config={{
                      asis: {
                        label: "AS-IS (Actual)",
                        color: NAVY,
                      },
                      tobe: {
                        label: "TO-BE (Optimizado)",
                        color: TEAL,
                      },
                    }}
                    className="h-[280px] w-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
                        barSize={80}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                          dataKey="name"
                          tick={{ fontSize: 12 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          tick={{ fontSize: 12 }}
                          axisLine={false}
                          tickLine={false}
                          label={{
                            value: "Dias",
                            angle: -90,
                            position: "insideLeft",
                            style: { fontSize: 12 },
                          }}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="value" radius={[6, 6, 0, 0]} name="Dias">
                          {chartData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.type === "asis" ? NAVY : TEAL}
                            />
                          ))}
                          <LabelList
                            dataKey="value"
                            position="top"
                            formatter={(value: number) => `${value} dias`}
                            style={{ fontSize: 13, fontWeight: 600 }}
                          />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>

                  {/* Improvement Summary */}
                  <div className="rounded-lg border-2 border-dashed border-primary/30 bg-primary/5 p-5 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <TrendingDown className="size-5 text-primary" />
                      <span className="text-sm font-semibold text-foreground">Resultado de la Simulacion</span>
                    </div>
                    <p className="text-4xl font-bold text-primary">
                      {optimization.improvement}%
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Reduccion estimada en tiempo de proceso
                    </p>
                    <div className="mt-3 flex items-center justify-center gap-3 text-xs">
                      <Badge variant="outline" className="bg-card">
                        Actual: {BASE_TIME_ASIS} dias
                      </Badge>
                      <span className="text-muted-foreground">{"-->"}</span>
                      <Badge className="bg-primary text-primary-foreground">
                        Optimizado: {optimization.timeToBe} dias
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
