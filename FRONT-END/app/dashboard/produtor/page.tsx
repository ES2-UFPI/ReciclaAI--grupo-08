"use client"

import type React from "react"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Package, Calendar, Award, BarChart3, Plus, Trash2, Truck, CheckCircle } from "lucide-react"
// adicione o tipo Residuo (ajuste o caminho se necessário)
import { Residuo } from "@/types/index"

import api from "@/services/api"

import {
  UsuarioResponse,
  CargaCreate,
  CargaResponse,
  ColetaCreate,
  ColetaResponse,
  StatusCarga,
  StatusColeta,
} from "@/types/index"

export default function GeneratorDashboard() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [cargas, setCargas] = useState<CargaResponse[]>([])
  const [coletas, setColetas] = useState<ColetaResponse[]>([])
  // tipos de resíduos (do endpoint /tipos)
  const [tipos, setTipos] = useState<Residuo[]>([])
  const tiposById = useMemo(() => {
    const map: Record<number, Residuo> = {}
    tipos.forEach((t) => {
      // garanta que id seja number
      const id = typeof (t as any).id === "string" ? Number((t as any).id) : (t as any).id
      map[id] = t
    })
    return map
  }, [tipos])

  const [showNewCargaForm, setShowNewCargaForm] = useState(false)
  const [showScheduleForm, setShowScheduleForm] = useState(false)

  const [scheduleData, setScheduleData] = useState({
    cargaId: "",
    date: "",
    time: "",
  })

  const [tab, setTab] = useState<string>("home")

  // estado de formulário de nova carga (CargaCreate-like)
  const [newCarga, setNewCarga] = useState<{
    residuo_id: number
    quantidade: number
    descricao: string
  }>({
    residuo_id: 0,
    quantidade: 0,
    descricao: "",
  })

  useEffect(() => {
    if (!isLoading && (!user || user.tipo_usuario !== "produtor")) {
      router.push("/auth")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (!user) return

    let mounted = true

    const fetchData = async () => {
      try {
        const cargasRes = await api.get(`/cargas/produtor/${user.id}/minhas-cargas`)
        const coletasRes = await api.get(`/coletas/produtor/${user.id}/minhas-coletas`)
        if (!mounted) return
        setCargas(Array.isArray(cargasRes.data) ? cargasRes.data : [])
        setColetas(Array.isArray(coletasRes.data) ? coletasRes.data : [])
      } catch (err: any) {
        console.error("Erro ao buscar cargas/coletas:", err)
        // fallback localStorage...
        const storedCargas = localStorage.getItem(`cargas_${user.id}`)
        const storedColetas = localStorage.getItem(`coletas_${user.id}`)
        if (mounted) {
          setCargas(storedCargas ? JSON.parse(storedCargas) : [])
          setColetas(storedColetas ? JSON.parse(storedColetas) : [])
        }
      }
    }

    fetchData()
    return () => {
      mounted = false
    }
  }, [user])

  // busca os tipos de residuos (para traduzir residuo_id -> nome/categoria/unidade)
  useEffect(() => {
    let mounted = true
    const fetchTipos = async () => {
      try {
        const res = await api.get("residuos/tipos")
        if (!mounted) return
        setTipos(Array.isArray(res.data) ? res.data : [])
      } catch (err) {
        console.error("Erro ao buscar tipos de resíduos:", err)
        if (mounted) setTipos([])
      }
    }
    fetchTipos()
    return () => {
      mounted = false
    }
  }, [])

  const handleCreateCarga = (e: React.FormEvent) => {
    e.preventDefault()

    // validação mínima
    if (!newCarga.residuo_id || !newCarga.quantidade || !user) return

    const carga: CargaCreate = {
      produtor_id: user.id,
      residuo_id: newCarga.residuo_id,
      quantidade: newCarga.quantidade,
      descricao: newCarga.descricao || undefined,
    }

    api.post<CargaResponse>("/cargas", carga)
      .then((response) => {
        setCargas((prev) => [...prev, response.data])
        localStorage.setItem(`cargas_${user?.id}`, JSON.stringify([...cargas, response.data]))
      })

    // Reset form
    setNewCarga({ residuo_id: 0, quantidade: 0, descricao: "" })
    setShowNewCargaForm(false)
  }

  const handleDeleteCarga = (cargaId: number) => {
    console.log("Não implementado ainda")
  }

  const getCargaStatusBadge = (status: StatusCarga | string) => {
    const key = String(status)
    // cores coordenadas:
    // NOVA -> roxo destacado
    // PENDENTE_COLETA -> laranja (coordenado com PENDENTE/AGENDADA)
    // COLETADA -> verde
    // RECICLADA -> azul/sky
    const styles: Record<string, string> = {
      NOVA: "bg-purple-600 text-white",
      PENDENTE_COLETA: "bg-amber-500 text-white",
      COLETADA: "bg-sky-600 text-white",
      RECICLADA: "bg-green-600 text-white",
    }
    const labels: Record<string, string> = {
      NOVA: "Nova",
      PENDENTE_COLETA: "Pendente",
      COLETADA: "Coletada",
      RECICLADA: "Reciclada",
    }

    const cls = styles[key] ?? "bg-gray-200 text-gray-800"
    return <Badge className={`px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>{labels[key] ?? key}</Badge>
  }

  const getColetaStatusBadge = (status: StatusColeta | string) => {
    const key = String(status)
    // PENDENTE / AGENDADA -> laranja
    // COLETADA -> verde
    // FINALIZADA -> azul/sky
    const styles: Record<string, string> = {
      PENDENTE: "bg-amber-500 text-white",
      AGENDADA: "bg-amber-500 text-white",
      COLETADA: "bg-sky-600 text-white",
      FINALIZADA: "bg-green-600 text-white",
    }
    const labels: Record<string, string> = {
      PENDENTE: "Pendente",
      AGENDADA: "Agendada",
      COLETADA: "Coletada",
      FINALIZADA: "Finalizada",
    }

    const cls = styles[key] ?? "bg-gray-200 text-gray-800"
    return <Badge className={`px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>{labels[key] ?? key}</Badge>
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
        {/* Main Content Tabs */}
        <Tabs value={tab} onValueChange={setTab} className="space-y-4">
          <TabsContent value="home" className="space-y-4">
            <h2 className="text-2xl font-bold">Bem-vindo, {user.nome}!</h2>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Cargas</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{cargas.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Coletas Agendadas</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{coletas.filter((c) => c.status === StatusColeta.AGENDADA).length}</div>
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
            </div>
          </TabsContent>

          {/* Cargas Tab */}
          <TabsContent value="loads" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Minhas Cargas</h2>
              <Button onClick={() => setShowNewCargaForm(!showNewCargaForm)}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Carga
              </Button>
            </div>

            {showNewCargaForm && (
              <Card>
                <CardHeader>
                  <CardTitle>Criar Nova Carga</CardTitle>
                  <CardDescription>Cadastre uma nova carga de resíduos para coleta</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateCarga} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="residuo">Tipo de Resíduo</Label>
                      <Select
                        value={String(newCarga.residuo_id)}
                        onValueChange={(value) => setNewCarga({ ...newCarga, residuo_id: Number(value) })}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {tipos.map((tipo) => (
                            <SelectItem key={tipo.id} value={String(tipo.id)}>
                              {tipo.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="quantidade">Quantidade ({tiposById[newCarga.residuo_id]?.unidade_medida || ""})</Label>
                      <Input
                        id="quantidade"
                        type="number"
                        step="0.1"
                        placeholder="0.0"
                        value={String(newCarga.quantidade)}
                        onChange={(e) => setNewCarga({ ...newCarga, quantidade: Number(e.target.value) })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="descricao">Descrição</Label>
                      <Textarea
                        id="descricao"
                        placeholder="Descreva os resíduos..."
                        value={newCarga.descricao}
                        onChange={(e) => setNewCarga({ ...newCarga, descricao: e.target.value })}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button type="submit">Criar Carga</Button>
                      <Button type="button" variant="outline" onClick={() => setShowNewCargaForm(false)}>
                        Cancelar
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-4">
              {cargas.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Nenhuma carga cadastrada ainda. Crie sua primeira carga!</p>
                  </CardContent>
                </Card>
              ) : (
                cargas.map((carga) => (
                  <Card key={carga.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="capitalize">
                            {tiposById[carga.residuo_id]?.nome ?? `Residuo #${carga.residuo_id}`}
                          </CardTitle>
                          <CardDescription>
                            Criado em {new Date(carga.data_criacao_carga).toLocaleDateString("pt-BR")}
                            {tiposById[carga.residuo_id] && (
                              <>
                                {" • "}
                                <span className="capitalize">{tiposById[carga.residuo_id].categoria}</span>
                                {" • "}
                                <span>{tiposById[carga.residuo_id].unidade_medida}</span>
                              </>
                            )}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          {getCargaStatusBadge(carga.status)}
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteCarga(carga.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm">
                          <span className="font-medium">Quantidade:</span> {carga.quantidade}{" "}
                          {tiposById[carga.residuo_id]?.unidade_medida ?? "kg"}
                        </p>
                        {tiposById[carga.residuo_id] && (
                          <p className="text-sm">
                            <span className="font-medium">Categoria:</span> {tiposById[carga.residuo_id].categoria}
                          </p>
                        )}
                      </div>
                      <div>
                        <p className="text-sm">
                          <span className="font-medium">Descrição:</span> {carga.descricao ?? "Nenhuma descrição"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Coletas (Agendamentos) Tab */}
          <TabsContent value="collections" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Minhas Coletas</h2>
              <Button onClick={() => setShowScheduleForm(!showScheduleForm)}>
                <Plus className="h-4 w-4 mr-2" />
                Solicitar Coleta
              </Button>
            </div>
            {showScheduleForm && (
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>Solicitar Agendamento de Coleta</CardTitle>
                  <CardDescription>Selecione uma carga, dia e horário para agendar a coleta</CardDescription>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      if (!scheduleData.cargaId || !scheduleData.date || !scheduleData.time || !user) return
                      const newCollection: ColetaResponse = {
                        id: Date.now(),
                        carga_id: Number(scheduleData.cargaId),
                        produtor_id: user.id,
                        datahora_janela_inicio: `${scheduleData.date}T${scheduleData.time}:00`,
                        datahora_janela_fim: `${scheduleData.date}T${scheduleData.time}:00`,
                        distancia_km: 0,
                        status: StatusColeta.AGENDADA,
                        data_criacao_coleta: new Date().toISOString(),
                      }
                      const updated = [...coletas, newCollection]
                      setColetas(updated)
                      localStorage.setItem(`coletas_${user?.id}`, JSON.stringify(updated))
                      setShowScheduleForm(false)
                      setScheduleData({ cargaId: "", date: "", time: "" })
                    }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="loadId">Carga para coleta</Label>
                      <Select
                        value={String(scheduleData.cargaId)}
                        onValueChange={(value) => setScheduleData({ ...scheduleData, cargaId: value })}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a carga" />
                        </SelectTrigger>
                        <SelectContent>
                          {cargas.map((c) => (
                            <SelectItem key={c.id} value={String(c.id)}>
                              Residuo #{c.residuo_id} - {c.quantidade}kg
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    
                    <div className="space-y-2">
                      <Label htmlFor="date">Dia</Label>
                      <Input
                        id="date"
                        type="date"
                        value={scheduleData.date}
                        onChange={(e) => setScheduleData({ ...scheduleData, date: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Horário</Label>
                      <Input
                        id="time"
                        type="time"
                        value={scheduleData.time}
                        onChange={(e) => setScheduleData({ ...scheduleData, time: e.target.value })}
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit">Agendar Coleta</Button>
                      <Button type="button" variant="outline" onClick={() => setShowScheduleForm(false)}>
                        Cancelar
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-4">
              {coletas.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Nenhuma coleta agendada ainda.</p>
                  </CardContent>
                </Card>
              ) : (
                coletas.map((collection) => (
                  <Card key={collection.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>Coleta #{String(collection.id).slice(0, 8)}</CardTitle>
                          <CardDescription>Coletor: {collection.nome_coletor ?? "A definir"}</CardDescription>
                        </div>
                        {getColetaStatusBadge(collection.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">
                        <span className="font-medium">Data:</span>{" "}
                        {new Date(collection.datahora_janela_inicio).toLocaleDateString("pt-BR")}
                      </p>
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
          {/* <TabsContent value="reports" className="space-y-4">
            <h2 className="text-2xl font-bold">Relatórios</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Resumo Mensal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Cargas criadas:</span>
                    <span className="font-medium">{cargas.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Peso total:</span>
                    <span className="font-medium">
                      {cargas.reduce((sum, c) => sum + Number(c.quantidade || 0), 0).toFixed(1)} kg
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Coletas realizadas:</span>
                    <span className="font-medium">{coletas.filter((c) => c.status === StatusColeta.COLETADA).length}</span>
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
                      {(cargas.reduce((sum, c) => sum + Number(c.quantidade || 0), 0) * 2.5).toFixed(1}} kg
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Árvores salvas:</span>
                    <span className="font-medium">
                      {Math.floor(cargas.reduce((sum, c) => sum + Number(c.quantidade || 0), 0) / 10)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent> */}
        </Tabs>

        {/* Bottom fixed navigation */}
        <nav
          aria-label="Barra de navegação inferior"
          className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-inner z-50"
        >
          <div className="max-w-5xl mx-auto px-4">
            <div className="grid grid-cols-4 gap-1">
              <button
                onClick={() => setTab("home")}
                className={`py-2 flex flex-col items-center justify-center text-xs ${tab === "home" ? "text-green-700" : "text-muted-foreground"}`}
                aria-label="Início"
                type="button"
              >
                <BarChart3 className="h-5 w-5" />
                <span className="mt-1">Início</span>
              </button>

              <button
                onClick={() => setTab("loads")}
                className={`py-2 flex flex-col items-center justify-center text-xs ${tab === "loads" ? "text-green-700" : "text-muted-foreground"}`}
                aria-label="Cargas"
                type="button"
              >
                <Package className="h-5 w-5" />
                <span className="mt-1">Cargas</span>
              </button>

              <button
                onClick={() => setTab("collections")}
                className={`py-2 flex flex-col items-center justify-center text-xs ${tab === "collections" ? "text-green-700" : "text-muted-foreground"}`}
                aria-label="Coletas"
                type="button"
              >
                <Truck className="h-5 w-5" />
                <span className="mt-1">Coletas</span>
              </button>

              <button
                onClick={() => setTab("points")}
                className={`py-2 flex flex-col items-center justify-center text-xs ${tab === "points" ? "text-green-700" : "text-muted-foreground"}`}
                aria-label="Pontos"
                type="button"
              >
                <Award className="h-5 w-5" />
                <span className="mt-1">Pontos</span>
              </button>
            </div>
          </div>
        </nav>
      </div>
    </div>
  )
}
