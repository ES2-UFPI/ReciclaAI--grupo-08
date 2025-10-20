import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function FaqSection() {
  const faqs = [
    {
      question: "Como funciona a plataforma ReciclaAí?",
      answer:
        "O ReciclaAí conecta três tipos de usuários: geradores de resíduos (pessoas, restaurantes, condomínios), coletores (que fazem a coleta) e receptores (empresas de reciclagem). Você se cadastra, indica seu tipo de usuário e começa a participar do ciclo de reciclagem, ganhando pontos e recompensas.",
    },
    {
      question: "Como ganho recompensas?",
      answer:
        "Geradores ganham pontos ao disponibilizar resíduos para coleta. Coletores ganham ao realizar coletas. Receptores ganham ao processar os materiais. Os pontos podem ser trocados por prêmios, descontos em produtos sustentáveis e até dinheiro.",
    },
    {
      question: "Quais tipos de resíduos posso reciclar?",
      answer:
        "Aceitamos papel, papelão, plástico, vidro, metal, eletrônicos, óleo de cozinha e muito mais. Cada receptor especifica os tipos de material que aceita, facilitando a conexão entre geradores e coletores.",
    },
    {
      question: "É gratuito para se cadastrar?",
      answer:
        "Sim! O cadastro é 100% gratuito para todos os tipos de usuários. Não cobramos taxas de adesão ou mensalidades. Você só precisa criar sua conta e começar a participar.",
    },
    {
      question: "Como funciona a coleta?",
      answer:
        "Geradores cadastram os resíduos disponíveis com localização e tipo de material. Coletores visualizam as solicitações próximas e escolhem quais coletas realizar. Após a coleta, o material é levado aos receptores cadastrados.",
    },
    {
      question: "Preciso ter veículo para ser coletor?",
      answer:
        "Não necessariamente! Aceitamos coletores com diferentes tipos de veículos: bicicleta, motocicleta, carrinho de coleta ou veículos maiores. Você escolhe coletas compatíveis com sua capacidade de transporte.",
    },
  ]

  return (
    <section id="faq" className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-4 text-balance">Perguntas frequentes</h2>
          <p className="text-lg text-foreground/70">Tire suas dúvidas sobre a plataforma</p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-card border border-border rounded-lg px-6 data-[state=open]:border-primary/50"
            >
              <AccordionTrigger className="text-left text-dark-foreground hover:text-primary hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-dark-foreground/70">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
