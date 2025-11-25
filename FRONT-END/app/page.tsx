import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Recycle, Leaf, TrendingUp, Users, CheckCircle, ArrowRight } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/mais um logo recicla aí.svg" alt="ReciclaAí Logo" className="w-8 h-8" />
            <span className="text-2xl font-bold text-foreground">ReciclaAí</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#como-funciona" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Como Funciona
            </a>
            <a href="#apoiadores" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Apoiadores
            </a>
            <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              FAQ
            </a>
          </nav>
          <Link href="/auth">
            <Button>Entrar</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-32 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-balance leading-tight">
              Transforme resíduos em <span className="text-primary">recompensas</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Conectamos geradores, coletores e receptores de resíduos em uma plataforma inteligente que premia a
              sustentabilidade
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/auth">
                <Button size="lg" className="w-full sm:w-auto">
                  Começar Agora
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                Saiba Mais
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Ad Space 1 */}
      <div className="py-8 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <div className="h-24 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border">
            <span className="text-sm text-muted-foreground">Espaço Publicitário</span>
          </div>
        </div>
      </div>

      {/* Success Metrics */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-balance">Nosso Impacto</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-8 text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                <Recycle className="h-8 w-8 text-primary" />
              </div>
              <div>
                <div className="text-4xl font-bold text-primary">1.250</div>
                <div className="text-sm text-muted-foreground mt-1">Toneladas Recicladas</div>
              </div>
            </Card>
            <Card className="p-8 text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                <Leaf className="h-8 w-8 text-primary" />
              </div>
              <div>
                <div className="text-4xl font-bold text-primary">3.840</div>
                <div className="text-sm text-muted-foreground mt-1">Toneladas de CO₂ Economizadas</div>
              </div>
            </Card>
            <Card className="p-8 text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <div>
                <div className="text-4xl font-bold text-primary">R$ 2,4M</div>
                <div className="text-sm text-muted-foreground mt-1">Renda Gerada</div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="como-funciona" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-balance">Como Funciona</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Um ecossistema completo para gestão sustentável de resíduos
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold">Geradores</h3>
              <p className="text-muted-foreground leading-relaxed">
                Cadastre seus resíduos, agende coletas e acumule pontos por cada ação sustentável realizada
              </p>
            </div>
            <div className="space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold">Coletores</h3>
              <p className="text-muted-foreground leading-relaxed">
                Encontre solicitações de coleta próximas, realize o serviço e seja recompensado por cada coleta
                concluída
              </p>
            </div>
            <div className="space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold">Receptores</h3>
              <p className="text-muted-foreground leading-relaxed">
                Receba materiais recicláveis de qualidade, processe-os e contribua para a economia circular
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ad Space 2 */}
      <div className="py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="h-24 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border">
            <span className="text-sm text-muted-foreground">Espaço Publicitário</span>
          </div>
        </div>
      </div>

      {/* Supporters */}
      <section id="apoiadores" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-balance">Nossos Apoiadores</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-60">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-32 h-16 bg-muted rounded-lg flex items-center justify-center">
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-balance">Perguntas Frequentes</h2>
          <div className="space-y-6">
            {[
              {
                q: "Como funciona o sistema de pontos?",
                a: "Você acumula pontos a cada coleta realizada ou resíduo cadastrado. Os pontos podem ser trocados por recompensas e benefícios.",
              },
              {
                q: "Quem pode se cadastrar como gerador?",
                a: "Qualquer pessoa física ou jurídica que gere resíduos recicláveis pode se cadastrar, incluindo residências, restaurantes e condomínios.",
              },
              {
                q: "Como me torno um coletor?",
                a: "Basta fazer seu cadastro na plataforma, informar seus dados e começar a aceitar solicitações de coleta na sua região.",
              },
              {
                q: "A plataforma é gratuita?",
                a: "Sim! O cadastro e uso da plataforma são totalmente gratuitos para todos os tipos de usuários.",
              },
            ].map((faq, i) => (
              <Card key={i} className="p-6">
                <div className="flex gap-4">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">{faq.q}</h3>
                    <p className="text-muted-foreground leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="p-12 text-center space-y-6 bg-primary text-primary-foreground">
            <h2 className="text-3xl md:text-4xl font-bold text-balance">Pronto para fazer a diferença?</h2>
            <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">
              Junte-se a milhares de pessoas e empresas que já estão transformando resíduos em oportunidades
            </p>
            <Link href="/auth">
              <Button size="lg" variant="secondary" className="mt-4">
                Criar Conta Gratuita
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <img src="/mais um logo recicla aí.svg" alt="ReciclaAí Logo" className="w-8 h-8" />
                <span className="text-lg font-bold">ReciclaAí</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Transformando resíduos em recompensas para um futuro mais sustentável
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Plataforma</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Como Funciona
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Preços
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Recursos
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Sobre
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Contato
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Privacidade
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Termos
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Cookies
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            © 2025 ReciclaAí. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  )
}
