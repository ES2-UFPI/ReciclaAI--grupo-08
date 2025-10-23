import { Card, CardDescription, CardHeader } from "@/components/ui/card"

export function SupportersSection() {
  const supporters = [
    { name: "EcoVerde", type: "Cooperativa" },
    { name: "Sustenta Brasil", type: "ONG" },
    { name: "GreenTech", type: "Empresa" },
    { name: "ReciclaMax", type: "Cooperativa" },
    { name: "Planeta Limpo", type: "ONG" },
    { name: "BioSolutions", type: "Empresa" },
  ]

  return (
    <section
      id="apoiadores"
      className="py-20 px-4 bg-cover bg-center relative" // Adicionado 'relative' para o overlay funcionar
      style={{
        backgroundImage: 'url(/1682770092977.jpeg)',
      }}
    >
      {/* 1. ADICIONADO: Overlay escuro para melhorar o contraste com o texto. */}
      <div className="absolute inset-0 bg-black/50 z-0"></div> 

      <div className="container mx-auto relative z-10"> {/* Adicionado 'relative z-10' para o conteúdo ficar acima do overlay */}
        <div className="text-center mb-16">
          {/* 2. ALTERADO: Cor do texto para branco para contraste. */}
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 text-balance">Apoiadores e parceiros</h2>
          {/* 2. ALTERADO: Cor do parágrafo para branco com transparência leve. */}
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Empresas e organizações que acreditam em um futuro sustentável
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto mb-12">
          {supporters.map((supporter, index) => (
            <Card
              key={index}
              // 3. ALTERADO: Fundo do Card para branco (bg-white) para se destacar no fundo escuro.
              className="p-6 bg-white border-border hover:border-primary transition-all duration-300 text-center shadow-lg"
            >
              <div className="h-12 w-12 rounded-full bg-primary/10 mx-auto mb-3 flex items-center justify-center">
                <span className="text-xl font-bold text-primary">{supporter.name.charAt(0)}</span>
              </div>
              {/* Removido o CardHeader para usar um div simples, e garantindo que o nome do parceiro seja de cor escura. */}
              <div className="flex flex-col items-center p-0 mb-2 font-semibold text-lg">{supporter.name}</div>
              <CardDescription className="text-dark-foreground/80">{supporter.type}</CardDescription>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}