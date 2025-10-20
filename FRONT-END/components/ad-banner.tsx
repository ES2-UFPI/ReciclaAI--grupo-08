import { Card } from "@/components/ui/card"
import { Sparkles } from "lucide-react"

interface AdBannerProps {
  variant?: "horizontal" | "vertical"
}

export function AdBanner({ variant = "horizontal" }: AdBannerProps) {
  return (
    <Card className={`bg-secondary/20 border-secondary/30 p-6 ${variant === "vertical" ? "h-full" : ""}`}>
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-4 w-4 text-secondary" />
        <span className="text-xs text-foreground/60 uppercase tracking-wider">Parceiro Sustentável</span>
      </div>
      <div className={`${variant === "vertical" ? "space-y-4" : "flex items-center justify-between"}`}>
        <div className={variant === "vertical" ? "space-y-2" : ""}>
          <h3 className="text-lg font-semibold text-foreground">Produtos Sustentáveis</h3>
          <p className="text-sm text-foreground/70">Descubra produtos veganos e de produção sustentável</p>
        </div>
        <div className={`text-sm text-secondary font-medium ${variant === "vertical" ? "mt-4" : ""}`}>Saiba mais →</div>
      </div>
    </Card>
  )
}
