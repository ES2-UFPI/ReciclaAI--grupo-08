"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Package, Calendar, Award, BarChart3, Plus, Trash2 } from "lucide-react"

interface Load {
  id: string
  type: string
  weight: number
  description: string
  status: "pending" | "scheduled" | "collected"
  createdAt: string
  scheduledDate?: string
}

interface Collection {
  id: string
  loadId: string
  collectorName: string
  scheduledDate: string
  status: "solicitado" | "agendado" | "concluido" | "cancelado"
}

export default function GeneratorDashboard() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [loads, setLoads] = useState<Load[]>([])
  const [collections, setCollections] = useState<Collection[]>([])
  const [showNewLoadForm, setShowNewLoadForm] = useState(false)
  const [showScheduleForm, setShowScheduleForm] = useState(false)
  const [scheduleData, setScheduleData] = useState({
    loadId: '',
    date: '',
    time: '',
  })

  // New load form state
  const [newLoad, setNewLoad] = useState({
    type: "",
    weight: "",
    description: "",
  })

  useEffect(() => {
    if (!isLoading && (!user || user.tipoUsuario !== "gerador")) {
      router.push("/dashboard")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    // Load data from localStorage
    if (user) {
      const storedLoads = localStorage.getItem(`loads_${user.id}`)
      const storedCollections = localStorage.getItem(`collections_${user.id}`)

      if (storedLoads) setLoads(JSON.parse(storedLoads))
      if (storedCollections) setCollections(JSON.parse(storedCollections))
    }
  }, [user])

  const handleCreateLoad = (e: React.FormEvent) => {
    e.preventDefault()

    const load: Load = {
      id: Math.random().toString(36).substr(2, 9),
      type: newLoad.type,
      weight: Number.parseFloat(newLoad.weight),
      description: newLoad.description,
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    const updatedLoads = [...loads, load]
    setLoads(updatedLoads)
    localStorage.setItem(`loads_${user?.id}`, JSON.stringify(updatedLoads))

    // Reset form
    setNewLoad({ type: "", weight: "", description: "" })
    setShowNewLoadForm(false)
  }

  const handleDeleteLoad = (loadId: string) => {
    const updatedLoads = loads.filter((l) => l.id !== loadId)
    setLoads(updatedLoads)
    localStorage.setItem(`loads_${user?.id}`, JSON.stringify(updatedLoads))
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "outline"> = {
      pending: "secondary",
      scheduled: "default",
      collected: "outline",
      completed: "outline",
      cancelled: "secondary",
    }

    const labels: Record<string, string> = {
      pending: "Pendente",
      solicitado: "Solicitado",
      agendado: "Agendado",
      concluido: "Concluído",
      cancelado: "Cancelado",
      collected: "Coletado",
      completed: "Concluído",
      cancelled: "Cancelado",
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

  return (
    <div className="min-h-screen bg-neutral-50">
      <DashboardHeader />

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Cargas</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loads.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Coletas Agendadas</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{collections.filter((c) => c.status === "agendado").length}</div>
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
              <CardTitle className="text-sm font-medium">Peso Total (kg)</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loads.reduce((sum, load) => sum + load.weight, 0).toFixed(1)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
  <Tabs defaultValue="loads" className="space-y-4">
          <TabsList>
            <TabsTrigger value="loads">Cargas</TabsTrigger>
            <TabsTrigger value="collections">Coletas</TabsTrigger>
            <TabsTrigger value="points">Pontos</TabsTrigger>
            <TabsTrigger value="reports">Relatórios</TabsTrigger>
          </TabsList>

          {/* Loads Tab */}
          <TabsContent value="loads" className="space-y-4">
            {/* ...restante da aba Cargas... */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Minhas Cargas</h2>
              <Button onClick={() => setShowNewLoadForm(!showNewLoadForm)}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Carga
              </Button>
            </div>

            {showNewLoadForm && (
              <Card>
                <CardHeader>
                  <CardTitle>Criar Nova Carga</CardTitle>
                  <CardDescription>Cadastre uma nova carga de resíduos para coleta</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateLoad} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Tipo de Resíduo</Label>
                      <Select
                        value={newLoad.type}
                        onValueChange={(value) => setNewLoad({ ...newLoad, type: value })}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="plastic">Plástico</SelectItem>
                          <SelectItem value="paper">Papel</SelectItem>
                          <SelectItem value="metal">Metal</SelectItem>
                          <SelectItem value="glass">Vidro</SelectItem>
                          <SelectItem value="organic">Orgânico</SelectItem>
                          <SelectItem value="electronic">Eletrônico</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="weight">Peso (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        step="0.1"
                        placeholder="0.0"
                        value={newLoad.weight}
                        onChange={(e) => setNewLoad({ ...newLoad, weight: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Descrição</Label>
                      <Textarea
                        id="description"
                        placeholder="Descreva os resíduos..."
                        value={newLoad.description}
                        onChange={(e) => setNewLoad({ ...newLoad, description: e.target.value })}
                        required
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button type="submit">Criar Carga</Button>
                      <Button type="button" variant="outline" onClick={() => setShowNewLoadForm(false)}>
                        Cancelar
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-4">
              {loads.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Nenhuma carga cadastrada ainda. Crie sua primeira carga!</p>
                  </CardContent>
                </Card>
              ) : (
                loads.map((load) => (
                  <Card key={load.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="capitalize">{load.type}</CardTitle>
                          <CardDescription>
                            Criado em {new Date(load.createdAt).toLocaleDateString("pt-BR")}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(load.status)}
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteLoad(load.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm">
                          <span className="font-medium">Peso:</span> {load.weight} kg
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Descrição:</span> {load.description}
                        </p>
                        {load.scheduledDate && (
                          <p className="text-sm">
                            <span className="font-medium">Data Agendada:</span>{" "}
                            {new Date(load.scheduledDate).toLocaleDateString("pt-BR")}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Coletas Tab */}
          <TabsContent value="collections" className="space-y-4">
            
          </TabsContent>

          {/* Points Tab */}
          <TabsContent value="points" className="space-y-4">
            <h2 className="text-2xl font-bold">Meus Pontos</h2>
            <Card>
              <CardHeader>
                <CardTitle>Saldo de Pontos</CardTitle>
                <CardDescription>Acumule pontos e troque por recompensas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-green-700 mb-4">{user.pontos} pontos</div>
                <p className="text-sm text-muted-foreground">
                  Você ganha pontos a cada carga coletada. Continue reciclando para acumular mais!
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-4">
            <h2 className="text-2xl font-bold">Relatórios</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Resumo Mensal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Cargas criadas:</span>
                    <span className="font-medium">{loads.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Peso total:</span>
                    <span className="font-medium">
                      {loads.reduce((sum, load) => sum + load.weight, 0).toFixed(1)} kg
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Coletas realizadas:</span>
                    <span className="font-medium">{collections.filter((c) => c.status === "concluido").length}</span>
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
                    <span className="font-medium">
                      {(loads.reduce((sum, load) => sum + load.weight, 0) * 2.5).toFixed(1)} kg
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Árvores salvas:</span>
                    <span className="font-medium">
                      {Math.floor(loads.reduce((sum, load) => sum + load.weight, 0) / 10)}
                    </span>
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
