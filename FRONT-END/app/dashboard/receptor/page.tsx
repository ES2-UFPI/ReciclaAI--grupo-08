"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Spinner } from "@/components/ui/spinner"
import { Award, BarChart3, TrendingUp, Package } from "lucide-react"

interface ReceivedMaterial {
  id: string
  type: string
  weight: number
  date: string
  source: string
  points: number
}

export default function ReceiverDashboard() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [receivedMaterials, setReceivedMaterials] = useState<ReceivedMaterial[]>([])

  useEffect(() => {
    if (!isLoading && (!user || user.tipoUsuario !== "receptor")) {
      router.push("/dashboard")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    // Load data from localStorage
    if (user) {
      const storedMaterials = localStorage.getItem(`receiver_materials_${user.id}`)
      if (storedMaterials) {
        setReceivedMaterials(JSON.parse(storedMaterials))
      } else {
        // Generate mock data for demonstration
        const mockMaterials: ReceivedMaterial[] = [
          {
            id: "1",
            type: "Plástico",
            weight: 150.5,
            date: new Date(Date.now() - 86400000 * 2).toISOString(),
            source: "Coletor João Silva",
            points: 200,
          },
          {
            id: "2",
            type: "Papel",
            weight: 85.2,
            date: new Date(Date.now() - 86400000 * 5).toISOString(),
            source: "Coletor Maria Santos",
            points: 120,
          },
          {
            id: "3",
            type: "Metal",
            weight: 45.8,
            date: new Date(Date.now() - 86400000 * 7).toISOString(),
            source: "Coletor Pedro Costa",
            points: 150,
          },
        ]
        setReceivedMaterials(mockMaterials)
        localStorage.setItem(`receiver_materials_${user.id}`, JSON.stringify(mockMaterials))
      }
    }
  }, [user])

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  const totalWeight = receivedMaterials.reduce((sum, m) => sum + m.weight, 0)
  const totalPoints = receivedMaterials.reduce((sum, m) => sum + m.points, 0)

  // Group materials by type
  const materialsByType = receivedMaterials.reduce(
    (acc, material) => {
      if (!acc[material.type]) {
        acc[material.type] = { weight: 0, count: 0 }
      }
      acc[material.type].weight += material.weight
      acc[material.type].count += 1
      return acc
    },
    {} as Record<string, { weight: number; count: number }>,
  )

  return (
    <div className="min-h-screen bg-neutral-50">
      <DashboardHeader />

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Recebido</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{receivedMaterials.length}</div>
              <p className="text-xs text-muted-foreground">carregamentos</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Peso Total (kg)</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalWeight.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">quilogramas</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pontos Acumulados</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.pontos + totalPoints}</div>
              <p className="text-xs text-muted-foreground">pontos totais</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Média Mensal</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(totalWeight / 3).toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">kg/mês</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="points" className="space-y-4">
          <TabsList>
            <TabsTrigger value="points">Pontos</TabsTrigger>
            <TabsTrigger value="reports">Relatórios</TabsTrigger>
          </TabsList>

          {/* Points Tab */}
          <TabsContent value="points" className="space-y-4">
            <h2 className="text-2xl font-bold">Meus Pontos</h2>
            <Card>
              <CardHeader>
                <CardTitle>Saldo de Pontos</CardTitle>
                <CardDescription>Pontos acumulados por materiais recebidos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-green-700 mb-4">{user.pontos + totalPoints} pontos</div>
                <p className="text-sm text-muted-foreground mb-4">
                  Você ganha pontos a cada material reciclável recebido e processado.
                </p>
                <div className="space-y-2 pt-4 border-t">
                  <h4 className="font-medium text-sm">Histórico de Pontos</h4>
                  {receivedMaterials.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Nenhum material recebido ainda.</p>
                  ) : (
                    receivedMaterials.map((material) => (
                      <div key={material.id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {material.type} - {material.weight}kg - {new Date(material.date).toLocaleDateString("pt-BR")}
                        </span>
                        <span className="font-medium text-green-700">+{material.points} pts</span>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-4">
            <h2 className="text-2xl font-bold">Relatórios</h2>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Resumo Geral</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total de carregamentos:</span>
                    <span className="font-medium">{receivedMaterials.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Peso total recebido:</span>
                    <span className="font-medium">{totalWeight.toFixed(1)} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Pontos ganhos:</span>
                    <span className="font-medium">{totalPoints}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Média por carregamento:</span>
                    <span className="font-medium">
                      {receivedMaterials.length > 0 ? (totalWeight / receivedMaterials.length).toFixed(1) : 0} kg
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Impacto Ambiental</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">CO₂ economizado:</span>
                    <span className="font-medium">{(totalWeight * 2.5).toFixed(1)} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Árvores salvas:</span>
                    <span className="font-medium">{Math.floor(totalWeight / 10)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Água economizada:</span>
                    <span className="font-medium">{(totalWeight * 15).toFixed(0)} L</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Energia economizada:</span>
                    <span className="font-medium">{(totalWeight * 5).toFixed(0)} kWh</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Materials by Type */}
            <Card>
              <CardHeader>
                <CardTitle>Materiais por Tipo</CardTitle>
                <CardDescription>Distribuição dos materiais recebidos</CardDescription>
              </CardHeader>
              <CardContent>
                {Object.keys(materialsByType).length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">Nenhum material recebido ainda.</p>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(materialsByType).map(([type, data]) => (
                      <div key={type} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{type}</span>
                          <span className="text-sm text-muted-foreground">
                            {data.weight.toFixed(1)} kg ({data.count} carregamentos)
                          </span>
                        </div>
                        <div className="w-full bg-neutral-200 rounded-full h-2">
                          <div
                            className="bg-green-700 h-2 rounded-full"
                            style={{ width: `${(data.weight / totalWeight) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Materials */}
            <Card>
              <CardHeader>
                <CardTitle>Materiais Recebidos Recentemente</CardTitle>
              </CardHeader>
              <CardContent>
                {receivedMaterials.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">Nenhum material recebido ainda.</p>
                ) : (
                  <div className="space-y-3">
                    {receivedMaterials
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((material) => (
                        <div key={material.id} className="flex justify-between items-start border-b pb-3 last:border-0">
                          <div>
                            <p className="font-medium">{material.type}</p>
                            <p className="text-sm text-muted-foreground">
                              {material.source} • {new Date(material.date).toLocaleDateString("pt-BR")}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{material.weight} kg</p>
                            <p className="text-sm text-green-700">+{material.points} pts</p>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
