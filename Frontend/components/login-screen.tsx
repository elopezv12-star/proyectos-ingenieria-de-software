"use client"

import { useState } from "react"
import {
  GraduationCap,
  Lock,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export type UserRole = "estudiante" | "administrador" | "director"

type UserAccount = {
  username: string
  password: string
  role: UserRole
  fullName: string
}

const USERS: UserAccount[] = [
  { username: "estudiante", password: "est2026", role: "estudiante", fullName: "Maria Fernanda Lopez" },
  { username: "admin", password: "admin2026", role: "administrador", fullName: "Lic. Carmen Gutierrez" },
  { username: "director", password: "dir2026", role: "director", fullName: "Dr. Roberto Mendez" },
]

type LoginScreenProps = {
  onLogin: (role: UserRole, fullName: string) => void
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!username || !password) {
      toast.error("Ingrese usuario y contrasena.")
      return
    }

    setIsLoading(true)
    // Simulate authentication delay
    setTimeout(() => {
      const user = USERS.find(
        (u) => u.username === username.toLowerCase() && u.password === password
      )
      if (user) {
        toast.success(`Bienvenido/a, ${user.fullName}`)
        onLogin(user.role, user.fullName)
      } else {
        toast.error("Credenciales invalidas. Intente de nuevo.")
        setIsLoading(false)
      }
    }, 800)
  }

  function handleQuickLogin(role: UserRole) {
    const user = USERS.find((u) => u.role === role)!
    setUsername(user.username)
    setPassword(user.password)
    setIsLoading(true)
    setTimeout(() => {
      toast.success(`Bienvenido/a, ${user.fullName}`)
      onLogin(user.role, user.fullName)
    }, 600)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary p-4">
      <div className="flex w-full max-w-md flex-col gap-6">
        {/* Logo / Header */}
        <div className="flex flex-col items-center gap-3 text-primary-foreground">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20">
            <GraduationCap className="size-9" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">Sistema de Graduacion</h1>
            <p className="text-sm text-primary-foreground/70 mt-1">
              Universidad -- Optimizacion del Proceso de Graduacion
            </p>
          </div>
        </div>

        {/* Login Card */}
        <Card className="border-0 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Lock className="size-4" />
              Iniciar Sesion
            </CardTitle>
            <CardDescription>
              Ingrese sus credenciales para acceder al sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="login-user">Usuario</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="login-user"
                    placeholder="Ingrese su usuario"
                    className="pl-9"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="login-pass">Contrasena</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="login-pass"
                    type={showPassword ? "text" : "password"}
                    placeholder="Ingrese su contrasena"
                    className="pl-9 pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Ocultar contrasena" : "Mostrar contrasena"}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full mt-2" disabled={isLoading}>
                {isLoading ? "Verificando..." : "Ingresar"}
              </Button>
            </form>

            {/* Quick Access for Demo */}
            <div className="mt-6 border-t pt-4">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="size-4 text-muted-foreground" />
                <p className="text-xs font-medium text-muted-foreground">
                  Acceso rapido (demostracion RBAC)
                </p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex flex-col gap-0.5 h-auto py-2.5 text-xs"
                  onClick={() => handleQuickLogin("estudiante")}
                  disabled={isLoading}
                >
                  <User className="size-4 text-muted-foreground" />
                  <span>Estudiante</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex flex-col gap-0.5 h-auto py-2.5 text-xs"
                  onClick={() => handleQuickLogin("administrador")}
                  disabled={isLoading}
                >
                  <ShieldCheck className="size-4 text-muted-foreground" />
                  <span>Admin</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex flex-col gap-0.5 h-auto py-2.5 text-xs"
                  onClick={() => handleQuickLogin("director")}
                  disabled={isLoading}
                >
                  <GraduationCap className="size-4 text-muted-foreground" />
                  <span>Director</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Credentials hint */}
        <div className="rounded-lg bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10 p-3">
          <p className="text-xs text-primary-foreground/60 text-center leading-relaxed">
            Credenciales de prueba: <span className="text-primary-foreground/80 font-medium">estudiante/est2026</span> |{" "}
            <span className="text-primary-foreground/80 font-medium">admin/admin2026</span> |{" "}
            <span className="text-primary-foreground/80 font-medium">director/dir2026</span>
          </p>
        </div>
      </div>
    </div>
  )
}
