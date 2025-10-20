import { Button } from "@/components/ui/button"
import { ArrowRight, Container, Recycle } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section
      id="apresentacao"
      className="bg-primary relative flex items-center justify-center px-4 pt-20 bg-cover bg-center min-h-screen max-h-[600px]"
      style={{
        backgroundImage: 'url(/juventude-que-limpa-floresta-lixo.jpg)',
        backgroundPosition: '75% center',
      }}
    >
      <div className="absolute inset-0 bg-black/40 z-0"></div>

      {/* Z-index ajustado para garantir que o conteúdo fique acima do overlay. */}
      <div className="container mx-auto relative z-10 text-left">
        <div className="max-w-6xl mx-auto text-left">
          <div className="flex flex-col gap-2 px-4 py-2 text-left">

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4 md:mb-6 text-balance leading-tight">
              Conectando pessoas e transformando resíduos em oportunidades
            </h1>

            <p className="text-xl md:text-2xl text-white/90 mb-8 md:mb-12 max-w-3xl text-left text-pretty">
              A plataforma que une geradores, coletores e receptores de resíduos, transformando lixo em renda e
              contribuindo para um planeta mais limpo.
            </p>

          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button size="lg" asChild className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-3">
              <Link href="/cadastro">
                Começar agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-3 border-white text-white hover:bg-white/10 bg-transparent"
              asChild
            >
              <Link href="#saiba-mais">
                Saiba mais
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}