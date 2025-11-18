"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Leaf } from "lucide-react"
import Link from "next/link"

export default function AuthPage() {
  const router = useRouter()
  const { login, signup } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Login form state
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  // Signup form state
  const [signupData, setSignupData] = useState({
    nome: "",
    email: "",
    senha: "",
    telefone: "",
    // campos de endereço detalhados
    rua: "",
    bairro: "",
    numero: "",
    cidade: "",
    estado: "",
    cep: "",
    complemento: "",
    tipoUsuario: "gerador" as "gerador" | "coletor" | "receptor",
    tipoPessoa: "fisica" as "fisica" | "juridica",
    cpf: "",
    cnpj: "",
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const success = await login(loginEmail, loginPassword)

    if (success) {
      router.push("/dashboard")
    } else {
      setError("Email ou senha inválidos")
    }

    setIsLoading(false)
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Validate CPF or CNPJ based on person type
    if (signupData.tipoPessoa === "fisica" && !signupData.cpf) {
      setError("CPF é obrigatório para pessoa física")
      setIsLoading(false)
      return
    }

    if (signupData.tipoPessoa === "juridica" && !signupData.cnpj) {
      setError("CNPJ é obrigatório para pessoa jurídica")
      setIsLoading(false)
      return
    }

    // validar campos de endereço obrigatórios
    if (!signupData.rua || !signupData.bairro || !signupData.numero || !signupData.cidade || !signupData.estado) {
      setError("Preencha todos os dados obrigatórios")
      setIsLoading(false)
      return
    }

    // montar endereço composto para compatibilidade com backend
    const enderecoFormatado = `${signupData.rua}, ${signupData.numero}${signupData.complemento ? " - " + signupData.complemento : ""} - ${signupData.bairro}, ${signupData.cidade} - ${signupData.estado}${signupData.cep ? " - CEP: " + signupData.cep : ""}`
    const payload = { ...signupData, endereco: enderecoFormatado }

    const success = await signup(payload)

    if (success) {
      router.push("/dashboard")
    } else {
      setError("Email já cadastrado")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <img src="/mais um logo recicla aí.svg" alt="ReciclaAí Logo" className="w-8 h-8" />
            <span className="text-xl font-bold text-neutral-900">ReciclaAí</span>
          </Link>
        </div>
      </header>

      {/* Auth Forms */}
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl mx-auto px-6 sm:px-8">
          <CardHeader>
            <CardTitle>Bem-vindo ao ReciclaAí</CardTitle>
            <CardDescription>Entre ou crie sua conta para começar a reciclar</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Entrar</TabsTrigger>
                <TabsTrigger value="signup">Cadastrar</TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Senha</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                  </div>
                  {error && <p className="text-sm text-red-600">{error}</p>}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Entrando..." : "Entrar"}
                  </Button>
                </form>
              </TabsContent>

              {/* Signup Tab */}
              <TabsContent value="signup">
                <form onSubmit={handleSignup}>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome</Label>
                      <Input
                        id="name"
                        placeholder="Seu nome completo"
                        value={signupData.nome}
                        onChange={(e) => setSignupData({ ...signupData, nome: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={signupData.email}
                        onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Senha</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={signupData.senha}
                        onChange={(e) => setSignupData({ ...signupData, senha: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(00) 00000-0000"
                        value={signupData.telefone}
                        onChange={(e) => setSignupData({ ...signupData, telefone: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2 lg:col-span-2">
                      <Label>Endereço</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <div className="space-y-2">
                          <Label htmlFor="rua" className="text-sm">Rua*</Label>
                          <Input
                            id="rua"
                            placeholder="Ex: Av. Brasil"
                            value={signupData.rua}
                            onChange={(e) => setSignupData({ ...signupData, rua: e.target.value })}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="numero" className="text-sm">Número*</Label>
                          <Input
                            id="numero"
                            placeholder="123"
                            value={signupData.numero}
                            onChange={(e) => setSignupData({ ...signupData, numero: e.target.value })}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="bairro" className="text-sm">Bairro*</Label>
                          <Input
                            id="bairro"
                            placeholder="Ex: Centro"
                            value={signupData.bairro}
                            onChange={(e) => setSignupData({ ...signupData, bairro: e.target.value })}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cidade" className="text-sm">Cidade*</Label>
                          <Input
                            id="cidade"
                            placeholder="Ex: Teresina"
                            value={signupData.cidade}
                            onChange={(e) => setSignupData({ ...signupData, cidade: e.target.value })}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="estado" className="text-sm">Estado*</Label>
                          <Input
                            id="estado"
                            placeholder="Ex: Piauí"
                            value={signupData.estado}
                            onChange={(e) => setSignupData({ ...signupData, estado: e.target.value })}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cep" className="text-sm">CEP</Label>
                          <Input
                            id="cep"
                            placeholder="00000-000"
                            value={signupData.cep}
                            onChange={(e) => setSignupData({ ...signupData, cep: e.target.value })}
                          />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="complemento" className="text-sm">Complemento</Label>
                          <Input
                            id="complemento"
                            placeholder="Apto, bloco, referência"
                            value={signupData.complemento}
                            onChange={(e) => setSignupData({ ...signupData, complemento: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 lg:col-span-2">
                      <Label>Tipo de Usuário</Label>
                      <Select
                        value={signupData.tipoUsuario}
                        onValueChange={(value: "gerador" | "coletor" | "receptor") =>
                          setSignupData({ ...signupData, tipoUsuario: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gerador">Gerador</SelectItem>
                          <SelectItem value="coletor">Coletor</SelectItem>
                          <SelectItem value="receptor">Receptor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 lg:col-span-2">
                      <Label>Tipo de Pessoa</Label>
                      <RadioGroup
                        value={signupData.tipoPessoa}
                        onValueChange={(value: "fisica" | "juridica") =>
                          setSignupData({ ...signupData, tipoPessoa: value })
                        }
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="fisica" id="fisica" />
                          <Label htmlFor="fisica" className="font-normal">
                            Pessoa Física
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="juridica" id="juridica" />
                          <Label htmlFor="juridica" className="font-normal">
                            Pessoa Jurídica
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {signupData.tipoPessoa === "fisica" ? (
                      <div className="space-y-2">
                        <Label htmlFor="cpf">CPF</Label>
                        <Input
                          id="cpf"
                          placeholder="000.000.000-00"
                          value={signupData.cpf}
                          onChange={(e) => setSignupData({ ...signupData, cpf: e.target.value })}
                          required
                        />
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Label htmlFor="cnpj">CNPJ</Label>
                        <Input
                          id="cnpj"
                          placeholder="00.000.000/0000-00"
                          value={signupData.cnpj}
                          onChange={(e) => setSignupData({ ...signupData, cnpj: e.target.value })}
                          required
                        />
                      </div>
                    )}

                    {error && <p className="text-sm text-red-600 lg:col-span-2">{error}</p>}

                    <div className="lg:col-span-2">
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Cadastrando..." : "Cadastrar"}
                      </Button>
                    </div>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
