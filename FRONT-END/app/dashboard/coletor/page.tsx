"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Truck, Award, BarChart3, MapPin, Package, CheckCircle } from "lucide-react"

interface AvailableLoad {
  id: string
  generatorName: string
  generatorAddress: string
  type: string
  weight: number
  description: string
  distance: string
  points: number
}

interface AcceptedCollection {
  id: string
  loadId: string
  generatorName: string
  generatorAddress: string
  type: string
  weight: number
  scheduledDate: string
  status: "scheduled" | "completed"
  points: number
}

export default function CollectorDashboard() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [availableLoads, setAvailableLoads] = useState<AvailableLoad[]>([])
  const [myCollections, setMyCollections] = useState<AcceptedCollection[]>([])

  useEffect(() => {
    if (!isLoading && (!user || user.tipoUsuario !== "coletor")) {
      router.push("/dashboard")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    // Load data from localStorage
    if (user) {
      const storedCollections = localStorage.getItem(`collector_collections_${user.id}`)
      if (storedCollections) setMyCollections(JSON.parse(storedCollections))

      // Generate mock available loads
      setAvailableLoads([
        {
          id: "1",
          generatorName: "João Silva",
          generatorAddress: "Rua das Flores, 123 - Centro",
          type: "Plástico",
          weight: 15.5,
          description: "Garrafas PET e embalagens plásticas",
          distance: "2.3 km",
          points: 50,
        },
        {
          id: "2",
          generatorName: "Maria Santos",
          generatorAddress: "Av. Principal, 456 - Jardim",
          type: "Papel",
          weight: 8.2,
          description: "Papelão e papel de escritório",
          distance: "1.8 km",
          points: 30,
        },
        {
          id: "3",
          generatorName: "Restaurante Bom Sabor",
          generatorAddress: "Rua Comercial, 789 - Centro",
          type: "Orgânico",
          weight: 25.0,
          description: "Resíduos orgânicos de cozinha",
          distance: "3.5 km",
          points: 80,
        },
      ])
    }
  }, [user])

  const handleAcceptLoad = (load: AvailableLoad) => {
    const newCollection: AcceptedCollection = {
      id: Math.random().toString(36).substr(2, 9),
      loadId: load.id,
      generatorName: load.generatorName,
      generatorAddress: load.generatorAddress,
      type: load.type,
      weight: load.weight,
      scheduledDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      status: "scheduled",
      points: load.points,
    }

    const updatedCollections = [...myCollections, newCollection]
    setMyCollections(updatedCollections)
    localStorage.setItem(`collector_collections_${user?.id}`, JSON.stringify(updatedCollections))

    // Remove from available loads
    setAvailableLoads(availableLoads.filter((l) => l.id !== load.id))
  }

  const handleCompleteCollection = (collectionId: string) => {
    const updatedCollections = myCollections.map((c) =>
      c.id === collectionId ? { ...c, status: "completed" as const } : c,
    )
    setMyCollections(updatedCollections)
    localStorage.setItem(`collector_collections_${user?.id}`, JSON.stringify(updatedCollections))

    // Update user points
    const collection = myCollections.find((c) => c.id === collectionId)
    if (collection && user) {
      const updatedUser = { ...user, points: user.pontos + collection.points }
      localStorage.setItem("reciclai_user", JSON.stringify(updatedUser))
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "outline"> = {
      scheduled: "default",
      completed: "outline",
    }

    const labels: Record<string, string> = {
      scheduled: "Agendado",
      completed: "Concluído",
    }

    return <Badge variant={variants[status]}>{labels[status]}</Badge>
  }

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  const completedCollections = myCollections.filter((c) => c.status === "completed")
  const totalWeight = completedCollections.reduce((sum, c) => sum + c.weight, 0)

  return (
    <div className="min-h-screen bg-neutral-50">
      <DashboardHeader />

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Coletas Disponíveis</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{availableLoads.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Minhas Coletas</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{myCollections.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pontos Acumulados</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.pontos}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Peso Coletado (kg)</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalWeight.toFixed(1)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="available" className="space-y-4">
          <TabsList>
            <TabsTrigger value="available">Disponíveis</TabsTrigger>
            <TabsTrigger value="collections">Minhas Coletas</TabsTrigger>
            <TabsTrigger value="points">Pontos</TabsTrigger>
            <TabsTrigger value="reports">Relatórios</TabsTrigger>
          </TabsList>

          {/* Available Loads Tab */}
          <TabsContent value="available" className="space-y-4">
            <h2 className="text-2xl font-bold">Coletas Disponíveis</h2>
            <div className="grid gap-4">
              {availableLoads.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Nenhuma coleta disponível no momento.</p>
                  </CardContent>
                </Card>
              ) : (
                availableLoads.map((load) => (
                  <Card key={load.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{load.type}</CardTitle>
                          <CardDescription>{load.generatorName}</CardDescription>
                        </div>
                        <Badge className="bg-green-700">{load.points} pontos</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <div className="text-sm">
                            <p className="font-medium">{load.generatorAddress}</p>
                            <p className="text-muted-foreground">{load.distance} de distância</p>
                          </div>
                        </div>
                        <p className="text-sm">
                          <span className="font-medium">Peso:</span> {load.weight} kg
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Descrição:</span> {load.description}
                        </p>
                        <Button onClick={() => handleAcceptLoad(load)} className="w-full">
                          Aceitar Coleta
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* My Collections Tab */}
          <TabsContent value="collections" className="space-y-4">
            <h2 className="text-2xl font-bold">Minhas Coletas</h2>
            <div className="grid gap-4">
              {myCollections.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Você ainda não aceitou nenhuma coleta.</p>
                  </CardContent>
                </Card>
              ) : (
                myCollections.map((collection) => (
                  <Card key={collection.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{collection.type}</CardTitle>
                          <CardDescription>{collection.generatorName}</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(collection.status)}
                          <Badge variant="outline">{collection.points} pts</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <p className="text-sm">{collection.generatorAddress}</p>
                        </div>
                        <p className="text-sm">
                          <span className="font-medium">Peso:</span> {collection.weight} kg
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Data Agendada:</span>{" "}
                          {new Date(collection.scheduledDate).toLocaleDateString("pt-BR")}
                        </p>
                        {collection.status === "scheduled" && (
                          <Button onClick={() => handleCompleteCollection(collection.id)} className="w-full">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Marcar como Concluída
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Points Tab */}
          <TabsContent value="points" className="space-y-4">
            <h2 className="text-2xl font-bold">Meus Pontos</h2>
            <Card>
              <CardHeader>
                <CardTitle>Saldo de Pontos</CardTitle>
                <CardDescription>Acumule pontos a cada coleta realizada</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-green-700 mb-4">{user.pontos} pontos</div>
                <p className="text-sm text-muted-foreground mb-4">
                  Continue coletando para acumular mais pontos e trocar por recompensas!
                </p>
                <div className="space-y-2 pt-4 border-t">
                  <h4 className="font-medium text-sm">Histórico de Pontos</h4>
                  {completedCollections.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Nenhuma coleta concluída ainda.</p>
                  ) : (
                    completedCollections.map((collection) => (
                      <div key={collection.id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {collection.type} - {new Date(collection.scheduledDate).toLocaleDateString("pt-BR")}
                        </span>
                        <span className="font-medium text-green-700">+{collection.points} pts</span>
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
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Resumo de Coletas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total de coletas:</span>
                    <span className="font-medium">{myCollections.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Coletas concluídas:</span>
                    <span className="font-medium">{completedCollections.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Peso total coletado:</span>
                    <span className="font-medium">{totalWeight.toFixed(1)} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Pontos ganhos:</span>
                    <span className="font-medium">{user.pontos}</span>
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
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
