import Link from "next/link"
import { Leaf, Facebook, Instagram, Twitter, Linkedin } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/50 backdrop-blur-sm py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="text-xl font-bold text-foreground">ReciclaAí</span>
            </Link>
            <p className="text-sm text-foreground/70">
              Transformando resíduos em oportunidades para um futuro sustentável.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Plataforma</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#como-funciona" className="text-sm text-foreground/70 hover:text-primary transition-colors">
                  Como Funciona
                </Link>
              </li>
              <li>
                <Link href="#impacto" className="text-sm text-foreground/70 hover:text-primary transition-colors">
                  Impacto
                </Link>
              </li>
              <li>
                <Link href="/cadastro" className="text-sm text-foreground/70 hover:text-primary transition-colors">
                  Cadastrar
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Suporte</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#faq" className="text-sm text-foreground/70 hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-foreground/70 hover:text-primary transition-colors">
                  Contato
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-foreground/70 hover:text-primary transition-colors">
                  Termos de Uso
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Redes Sociais</h3>
            <div className="flex gap-3">
              <a
                href="#"
                className="h-10 w-10 rounded-full bg-foreground flex items-center justify-center hover:bg-primary/30 transition-colors"
              >
                <Facebook className="h-5 w-5 text-primary" />
              </a>
              <a
                href="#"
                className="h-10 w-10 rounded-full bg-foreground flex items-center justify-center hover:bg-primary/30 transition-colors"
              >
                <Instagram className="h-5 w-5 text-primary" />
              </a>
              <a
                href="#"
                className="h-10 w-10 rounded-full bg-foreground flex items-center justify-center hover:bg-primary/30 transition-colors"
              >
                <Twitter className="h-5 w-5 text-primary" />
              </a>
              <a
                href="#"
                className="h-10 w-10 rounded-full bg-foreground flex items-center justify-center hover:bg-primary/30 transition-colors"
              >
                <Linkedin className="h-5 w-5 text-primary" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border/40 pt-8 text-center">
          <p className="text-sm text-foreground/60">© 2025 ReciclaAí. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
