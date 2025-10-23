import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Leaf } from "lucide-react"

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full">
              <img src="/logo.svg" alt="ReciclaAí Logo" className="h-8 w-8" />
            </div>
            <span className="text-2xl font-bold text-foreground">ReciclaAí</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="#como-funciona" className="text-sm text-foreground/80 hover:text-foreground transition-colors">
              Como Funciona
            </Link>
            <Link href="#impacto" className="text-sm text-foreground/80 hover:text-foreground transition-colors">
              Impacto
            </Link>
            <Link href="#apoiadores" className="text-sm text-foreground/80 hover:text-foreground transition-colors">
              Apoiadores
            </Link>
            <Link href="#faq" className="text-sm text-foreground/80 hover:text-foreground transition-colors">
              FAQ
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild className="text-foreground">
              <Link href="/cadastro">Entrar</Link>
            </Button>
            <Button size="sm" asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/cadastro">Cadastrar</Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  )
}
