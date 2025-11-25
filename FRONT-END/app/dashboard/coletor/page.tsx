"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Truck, Award, BarChart3, MapPin, Package, CheckCircle } from "lucide-react"
import { set } from "react-hook-form"

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
  expectedCode?: string
  rating?: number
  points: number
}

interface Receiver {
  id: string
  name: string
  address: string
  horarioFuncionamento: { open: string; close: string }
  acceptedMaterials: string[]
  contactInfo: string
}

export default function CollectorDashboard() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [availableLoads, setAvailableLoads] = useState<AvailableLoad[]>([])
  const [myCollections, setMyCollections] = useState<AcceptedCollection[]>([])
  const [receivers, setReceivers] = useState<Receiver[]>([])
  const [searchQuery, setSearchQuery] = useState<string>("")
  // filtros para coletas disponíveis
  const [materialFilter, setMaterialFilter] = useState<string>("Todos")
  const [maxDistanceKm, setMaxDistanceKm] = useState<number | "">("")

  // estados para concluir coleta (código + avaliação)
  const [completingCollectionId, setCompletingCollectionId] = useState<string | null>(null)
  const [completionCodeInput, setCompletionCodeInput] = useState<string>("")
  const [completionRatingInput, setCompletionRatingInput] = useState<number | "">("")
  const [completionError, setCompletionError] = useState<string>("")
  const [completionSuccess, setCompletionSuccess] = useState<string>("")

  const [tab, setTab] = useState<string>("available")

  const filteredAvailableLoads = useMemo(() => {
    return availableLoads.filter((load) => {
      // filtro por material
      if (materialFilter !== "Todos" && load.type !== materialFilter) return false

      // filtro por distância (espera strings como "2.3 km" ou "2,3 km")
      if (typeof maxDistanceKm === "number" && maxDistanceKm > 0) {
        const parsed = parseFloat(String(load.distance).replace(",", ".").replace(/[^\d.]/g, ""))
        if (!isNaN(parsed) && parsed > maxDistanceKm) return false
      }

      return true
    })
  }, [availableLoads, materialFilter, maxDistanceKm])

  // lista de receptores filtrada 
  const filteredReceiversMemo = useMemo(() => {
    return receivers.filter((receiver) => {
      // material filter
      if (materialFilter !== "Todos" && !receiver.acceptedMaterials.includes(materialFilter)) return false

      // distance filter (placeholder — receiver pode não ter distance)
      if (typeof maxDistanceKm === "number" && maxDistanceKm > 0) {
        const distanceField = (receiver as any).distance || ""
        const parsed = parseFloat(String(distanceField).replace(",", ".").replace(/[^\d.]/g, ""))
        if (!isNaN(parsed) && parsed > maxDistanceKm) return false
      }

      // text search
      const q = searchQuery.trim().toLowerCase()
      if (q) {
        const haystack = `${receiver.name} ${receiver.address} ${receiver.acceptedMaterials.join(" ")}`.toLowerCase()
        if (!haystack.includes(q)) return false
      }

      return true
    })
  }, [receivers, materialFilter, maxDistanceKm, searchQuery])

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
          points: 15.5 * 10,
        },
        {
          id: "2",
          generatorName: "Maria Santos",
          generatorAddress: "Av. Principal, 456 - Jardim",
          type: "Papel",
          weight: 8.2,
          description: "Papelão e papel de escritório",
          distance: "1.8 km",
          points: 8.2 * 10,
        },
        {
          id: "3",
          generatorName: "Restaurante Bom Sabor",
          generatorAddress: "Rua Comercial, 789 - Centro",
          type: "Orgânico",
          weight: 25.0,
          description: "Resíduos orgânicos de cozinha",
          distance: "3.5 km",
          points: 25.0 * 10,
        },
      ])

      const initialReceivers: Receiver[] = [
        {
          id: "r1",
          name: "Recicla Fácil",
          address: "Av. Verde, 100 - Bairro Verde",
          horarioFuncionamento: { open: "08:00", close: "17:00" },
          acceptedMaterials: ["Plástico", "Papel", "Metal"],
          contactInfo: "(11) 1234-5678",
        },
        {
          id: "r2",
          name: "Eco Ponto",
          address: "Rua Azul, 200 - Bairro Azul",
          horarioFuncionamento: { open: "07:00", close: "18:00" },
          acceptedMaterials: ["Vidro", "Papel"],
          contactInfo: "(11) 8765-4321",
        },
      ]

      setReceivers(initialReceivers)
    }
  }, [user])

  const handleAcceptLoad = (load: AvailableLoad) => {
    // generate a code that the generator would provide to the collector to confirm delivery
    const expectedCode = Math.random().toString(36).slice(2, 8).toUpperCase()
    const newCollection: AcceptedCollection = {
      id: Math.random().toString(36).substr(2, 9),
      loadId: load.id,
      generatorName: load.generatorName,
      generatorAddress: load.generatorAddress,
      type: load.type,
      weight: load.weight,
      scheduledDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      status: "scheduled",
      expectedCode,
      // rating will be set when confirmed
      rating: undefined,
      points: load.points,
    }

    const updatedCollections = [...myCollections, newCollection]
    setMyCollections(updatedCollections)
    localStorage.setItem(`collector_collections_${user?.id}`, JSON.stringify(updatedCollections))

    // Remove from available loads
    setAvailableLoads(availableLoads.filter((l) => l.id !== load.id))
  }

  // submissão do código + avaliação para concluir a coleta
  const handleSubmitCompletion = (collectionId: string) => {
    setCompletionError("")
    setCompletionSuccess("")
    const coll = myCollections.find((c) => c.id === collectionId)
    if (!coll) {
      setCompletionError("Coleta não encontrada")
      return
    }
    if (!completionCodeInput.trim()) {
      setCompletionError("Insira o código fornecido pelo gerador")
      return
    }
    if (coll.expectedCode && coll.expectedCode.toLowerCase() !== completionCodeInput.trim().toLowerCase()) {
      setCompletionError("Código inválido")
      return
    }
    const rating = typeof completionRatingInput === "number" ? Math.max(0, Math.min(5, completionRatingInput)) : undefined
    const updatedCollections = myCollections.map((c) =>
      c.id === collectionId ? { ...c, status: "completed" as const, rating } : c,
    )
    setMyCollections(updatedCollections)
    localStorage.setItem(`collector_collections_${user?.id}`, JSON.stringify(updatedCollections))

    // Update user points (keep previous logic)
    const collection = myCollections.find((c) => c.id === collectionId)
    if (collection && user) {
      const updatedUser = { ...user, pontos: user.pontos + collection.points }
      localStorage.setItem("reciclai_user", JSON.stringify(updatedUser))
    }

    setCompletingCollectionId(null)
    setCompletionCodeInput("")
    setCompletionRatingInput("")
    setCompletionSuccess("Coleta confirmada e avaliação registrada")
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

  const buscarReceptoresMaterial = (material: string) => {
    return receivers.filter((receiver) => receiver.acceptedMaterials.includes(material))
  }

  const buscarReceptoresDistancia = (maxDistanceKm: number) => {
    // Esta função é um placeholder. Em uma aplicação real, você precisaria calcular a distância
    // entre o coletor e os receptores usando coordenadas geográficas.
    return receivers // Retorna todos os receptores como exemplo
  }

  const estaAberto = (horario: { open: string; close: string }) => {
    const agora = new Date()
    const [abertoHora, abertoMinuto] = horario.open.split(":").map(Number)
    const [fechadoHora, fechadoMinuto] = horario.close.split(":").map(Number)

    const open = new Date(agora)
    open.setHours(abertoHora, abertoMinuto, 0, 0)
    const close = new Date(agora)
    close.setHours(fechadoHora, fechadoMinuto, 0, 0)

    if (close <= open) {
      return agora >= open || agora < close
    }
    return agora >= open && agora < close
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
        <Tabs value={tab} onValueChange={setTab} className="space-y-4">
          {/* Select para telas pequenas */}
          <div className="sm:hidden mb-3">
            <select
              value={tab}
              onChange={(e) => setTab(e.target.value)}
              className="w-full border rounded px-3 py-2 bg-white"
              aria-label="Selecionar aba"
            >
              <option value="available">Disponíveis</option>
              <option value="collections">Minhas Coletas</option>
              <option value="deliveries">Entregas</option>
              <option value="receivers">Buscar Receptores</option>
              <option value="points">Pontos</option>
              <option value="reports">Relatórios</option>
            </select>
          </div>

          {/* TabsList visível em telas >= sm; em mobile usamos o select acima */}
          <TabsList className="hidden sm:flex gap-2 overflow-x-auto">
            <TabsTrigger value="available">Disponíveis</TabsTrigger>
            <TabsTrigger value="collections">Minhas Coletas</TabsTrigger>
            <TabsTrigger value="deliveries">Entregas</TabsTrigger>
            <TabsTrigger value="receivers">Buscar Receptores</TabsTrigger>
            <TabsTrigger value="points">Pontos</TabsTrigger>
            <TabsTrigger value="reports">Relatórios</TabsTrigger>
          </TabsList>

          {/* Available Loads Tab */}
          <TabsContent value="available" className="space-y-4">
            <h2 className="text-2xl font-bold">Coletas Disponíveis</h2>

            {/* filtros: material + distância */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-medium">Filtrar por Material da Carga: </h3>
                <select
                  value={materialFilter}
                  onChange={(e) => setMaterialFilter(e.target.value)}
                  className="border rounded px-3 py-2"
                >
                  <option>Todos</option>
                  <option>Plástico</option>
                  <option>Papel</option>
                  <option>Vidro</option>
                  <option>Metal</option>
                </select>
              </div>
              <div className="flex items-center gap-2 mt-2 sm:mt-0">
                <h3 className="text-lg font-medium">Distância Máxima: </h3>
                <input
                  type="number"
                  min={0}
                  placeholder="Max km"
                  value={maxDistanceKm === "" ? "" : String(maxDistanceKm)}
                  onChange={(e) => {
                    const v = e.target.value
                    setMaxDistanceKm(v === "" ? "" : Number(v))
                  }}
                  className="w-28 border rounded px-2 py-2"
                />
                <Button onClick={() => { setMaterialFilter("Todos"); setMaxDistanceKm("") }}>
                  Limpar
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {availableLoads.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Nenhuma coleta disponível no momento.</p>
                  </CardContent>
                </Card>
              ) : filteredAvailableLoads.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Nenhum resultado para os filtros selecionados.</p>
                  </CardContent>
                </Card>
              ) : (
                filteredAvailableLoads.map((load) => (
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

                        {/* concluir coleta: formulário de código + avaliação */}
                        {collection.status === "scheduled" && (
                          <>
                            {completingCollectionId !== collection.id ? (
                              <Button onClick={() => { setCompletingCollectionId(collection.id); setCompletionError(""); setCompletionSuccess(""); }}>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Indicar Coleta Realizada
                              </Button>
                            ) : (
                              <div className="space-y-3 border rounded p-3">
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">Código do Gerador</label>
                                  <input
                                    value={completionCodeInput}
                                    onChange={(e) => setCompletionCodeInput(e.target.value)}
                                    className="w-full border px-3 py-2 rounded"
                                    placeholder="Ex: ABC123"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">Avaliação da Carga (0-5)</label>
                                  <input
                                    type="number"
                                    min={0}
                                    max={5}
                                    value={completionRatingInput === "" ? "" : String(completionRatingInput)}
                                    onChange={(e) => setCompletionRatingInput(e.target.value === "" ? "" : Number(e.target.value))}
                                    className="w-32 border px-2 py-2 rounded"
                                  />
                                </div>
                                {completionError && <p className="text-sm text-red-600">{completionError}</p>}
                                {completionSuccess && <p className="text-sm text-green-700">{completionSuccess}</p>}
                                <div className="flex gap-2">
                                  <Button onClick={() => handleSubmitCompletion(collection.id)} className="flex-1">
                                    Confirmar e Avaliar
                                  </Button>
                                  <Button variant="ghost" onClick={() => { setCompletingCollectionId(null); setCompletionCodeInput(""); setCompletionRatingInput(""); }}>
                                    Cancelar
                                  </Button>
                                </div>
                              </div>
                            )}
                          </>
                        )}
                        {/* se já concluída, mostrar avaliação */}
                        {collection.status === "completed" && collection.rating !== undefined && (
                          <p className="text-sm text-muted-foreground">Avaliação: {collection.rating} / 5</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Receivers Tab */}
          <TabsContent value="receivers" className="space-y-4">
            <h2 className="text-2xl font-bold">Buscar Receptores</h2>

            {/* filtros: material + distância + busca */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mb-4">

              <div className="flex items-center gap-2 mt-2 sm:mt-0">
                <h3 className="text-lg font-medium">Filtrar por Material Aceito: </h3>
                <select
                  value={materialFilter}
                  onChange={(e) => setMaterialFilter(e.target.value)}
                  className="border rounded px-3 py-2"
                >
                  <option>Todos</option>
                  <option>Plástico</option>
                  <option>Papel</option>
                  <option>Vidro</option>
                  <option>Metal</option>
                </select>
                <h3 className="text-lg font-medium">Distância Máxima: </h3>
                <input
                  type="number"
                  min={0}
                  placeholder="Max km"
                  value={maxDistanceKm === "" ? "" : String(maxDistanceKm)}
                  onChange={(e) => {
                    const v = e.target.value
                    setMaxDistanceKm(v === "" ? "" : Number(v))
                  }}
                  className="w-28 border rounded px-2 py-2"
                />

                <Button onClick={() => { setMaterialFilter("Todos"); setMaxDistanceKm(""); setSearchQuery("") }}>
                  Limpar
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {receivers.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Nenhum receptor cadastrado.</p>
                  </CardContent>
                </Card>
              ) : filteredReceiversMemo.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Nenhum resultado para os filtros selecionados.</p>
                  </CardContent>
                </Card>
              ) : (
                filteredReceiversMemo.map((receiver) => {
                  const aberto = estaAberto(receiver.horarioFuncionamento)
                  return (
                    <Card key={receiver.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start w-full">
                          <div>
                            <CardTitle>{receiver.name}</CardTitle>
                            <CardDescription>{receiver.address}</CardDescription>
                            <CardContent>
                              <span>Materiais Aceitos: {receiver.acceptedMaterials.join(", ")}</span>
                              <br />
                              <span>
                                Horário de Funcionamento: {receiver.horarioFuncionamento.open} -{" "}
                                {receiver.horarioFuncionamento.close}
                              </span>
                              <br />
                              <span>Contato: {receiver.contactInfo}</span>
                            </CardContent>
                          </div>
                          <div className="ml-4 mt-1">
                            <span
                              className={
                                "inline-block px-2 py-0.5 text-xs font-medium rounded " +
                                (aberto ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")
                              }
                            >
                              {aberto ? "Aberto agora" : "Fechado agora"}
                            </span>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  )
                })
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

          {/* Deliveries Tab */}
          <TabsContent value="deliveries" className="space-y-4">
            <h2 className="text-2xl font-bold">Entregas</h2>
            <div className="grid gap-4">
              {myCollections.filter(c => c.status === "completed").length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Nenhuma entrega registrada.</p>
                  </CardContent>
                </Card>
              ) : (
                myCollections
                  .filter(c => c.status === "completed")
                  .sort((a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime())
                  .map((c) => (
                    <Card key={c.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{c.type}</CardTitle>
                            <CardDescription>{c.generatorName}</CardDescription>
                          </div>
                          <Badge variant="outline">{c.points} pts</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm">{c.generatorAddress}</p>
                            <p className="text-sm text-muted-foreground">
                              Data: {new Date(c.scheduledDate).toLocaleDateString("pt-BR")}
                            </p>
                            <p className="text-sm">Código: {c.id}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{c.weight} kg</p>
                            <p className="text-sm text-green-700">+{c.points} pts</p>
                            {c.rating !== undefined && <p className="text-sm mt-2">Avaliação: {c.rating} / 5</p>}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
