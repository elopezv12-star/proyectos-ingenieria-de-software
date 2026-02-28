"use client"

import { useState } from "react"
import {
  GraduationCap,
  UserCircle,
  ShieldCheck,
  BarChart3,
  LogOut,
  User,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LoginScreen, type UserRole } from "@/components/login-screen"
import { StudentView } from "@/components/student-view"
import { AdminView } from "@/components/admin-view"
import { DirectorView } from "@/components/director-view"
import { toast } from "sonner"

const roleConfig = {
  estudiante: {
    label: "Vista Estudiante",
    icon: UserCircle,
    description: "Seguimiento y solicitudes",
  },
  administrador: {
    label: "Vista Administrador",
    icon: ShieldCheck,
    description: "Validacion de expedientes",
  },
  director: {
    label: "Vista Director",
    icon: BarChart3,
    description: "Dashboard y simulacion",
  },
} as const

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentRole, setCurrentRole] = useState<UserRole>("estudiante")
  const [currentUserName, setCurrentUserName] = useState("")

  function handleLogin(role: UserRole, fullName: string) {
    setCurrentRole(role)
    setCurrentUserName(fullName)
    setIsAuthenticated(true)
  }

  function handleLogout() {
    setIsAuthenticated(false)
    setCurrentRole("estudiante")
    setCurrentUserName("")
    toast.info("Sesion cerrada exitosamente.")
  }

  // RF-01 to RF-06: Login/RBAC gate
  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />
  }

  const config = roleConfig[currentRole]
  const RoleIcon = config.icon

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header with user info and logout */}
      <header className="sticky top-0 z-40 border-b bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <GraduationCap className="size-7 shrink-0" />
            <div>
              <h1 className="text-base font-bold leading-tight sm:text-lg">
                Sistema de Graduacion
              </h1>
              <p className="text-xs text-primary-foreground/70 hidden sm:block">
                Optimizacion del Proceso de Graduacion
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Current user info */}
            <div className="hidden sm:flex items-center gap-2 rounded-lg bg-primary-foreground/10 px-3 py-1.5">
              <User className="size-4" />
              <div className="text-right">
                <p className="text-xs font-medium leading-tight">{currentUserName}</p>
                <p className="text-[10px] text-primary-foreground/60 capitalize">{currentRole}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              onClick={handleLogout}
            >
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Cerrar Sesion</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Role indicator bar */}
      <nav className="border-b bg-card">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-2.5 sm:px-6">
          <div className="flex items-center gap-2 rounded-lg bg-primary/5 px-3 py-1.5 border border-primary/10">
            <RoleIcon className="size-4 text-primary" />
            <span className="text-sm font-medium text-primary">{config.label}</span>
            <span className="text-xs text-muted-foreground">-- {config.description}</span>
          </div>
        </div>
      </nav>

      {/* Main Content - RBAC enforced: each role only sees their view */}
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
          {currentRole === "estudiante" && <StudentView />}
          {currentRole === "administrador" && <AdminView />}
          {currentRole === "director" && <DirectorView />}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          <p className="text-center text-xs text-muted-foreground">
            Sistema Web de Optimizacion del Proceso de Graduacion -- Prototipo Interactivo v2.0
          </p>
        </div>
      </footer>
    </div>
  )
}
