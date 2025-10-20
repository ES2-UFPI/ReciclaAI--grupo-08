"use client"

import { Card, CardDescription } from "@/components/ui/card"
import { Recycle, Leaf, DollarSign, Trees } from "lucide-react"
import { useEffect, useState } from "react"

export function StatsSection() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const stats = [
    {
      icon: Recycle,
      value: "1.247",
      unit: "ton",
      label: "Resíduos reciclados",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Trees,
      value: "3.891",
      unit: "ton",
      label: "CO₂ economizado",
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      icon: DollarSign,
      value: "R$ 2,4M",
      unit: "",
      label: "Renda gerada",
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
  ]

  return (
    <section id="impacto" className="py-20 px-4 min-h-screen">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-4 text-balance">Nosso impacto em números</h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Resultados reais de uma comunidade comprometida com a sustentabilidade
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className={`p-8 bg-card border-border hover:border-primary/50 transition-all duration-300 ${
                mounted ? "animate-fade-in-up" : "opacity-0"
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`inline-flex p-3 rounded-lg ${stat.bgColor} mb-4 gap-2 items-center justify-center`}>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
                <span className="text-xl">{stat.label}</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className={`text-5xl font-bold ${stat.color}`}>{stat.value} {stat.unit}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
