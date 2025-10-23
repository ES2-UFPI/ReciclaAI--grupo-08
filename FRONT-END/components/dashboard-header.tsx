"use client"

import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Leaf, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export function DashboardHeader() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const userTypeLabels = {
    gerador: "Gerador",
    coletor: "Coletor",
    receptor: "Receptor",
  }

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <img src="/mais um logo recicla aí.svg" alt="ReciclaAí Logo" className="w-8 h-8" />
          <span className="text-xl font-bold text-neutral-900">ReciclaAí</span>
        </Link>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-neutral-900">{user?.nome}</p>
            <p className="text-xs text-neutral-500">{user?.tipoUsuario && userTypeLabels[user.tipoUsuario]}</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>
    </header>
  )
}
