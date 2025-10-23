"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Truck, Building2 } from "lucide-react"

type UserType = "gerador" | "coletor" | "receptor" | null

export default function CadastroPage() {
  const [userType, setUserType] = useState<UserType>(null)

  return (
    <main className="min-h-screen">
      <Header />

      <div className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Cadastre-se no ReciclaAí</h1>
            <p className="text-lg text-foreground/70">Escolha como quer se cadastrar e comece a fazer a diferença</p>
          </div>

          {!userType ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card
                className="p-8 bg-card border-border hover:border-primary cursor-pointer transition-all duration-300 hover:scale-105"
                onClick={() => setUserType("gerador")}
              >
                <div className="text-center">
                  <div className="inline-flex p-4 rounded-full bg-primary/20 mb-4">
                    <User className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-card-foreground mb-2">Gerador</h3>
                  <p className="text-sm text-card-foreground/70">
                    Pessoa, restaurante ou condomínio que gera resíduos recicláveis
                  </p>
                </div>
              </Card>

              <Card
                className="p-8 bg-card border-border hover:border-primary cursor-pointer transition-all duration-300 hover:scale-105"
                onClick={() => setUserType("coletor")}
              >
                <div className="text-center">
                  <div className="inline-flex p-4 rounded-full bg-accent/20 mb-4">
                    <Truck className="h-12 w-12 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold text-card-foreground mb-2">Coletor</h3>
                  <p className="text-sm text-card-foreground/70">
                    Profissional que realiza a coleta de resíduos recicláveis
                  </p>
                </div>
              </Card>

              <Card
                className="p-8 bg-card border-border hover:border-primary cursor-pointer transition-all duration-300 hover:scale-105"
                onClick={() => setUserType("receptor")}
              >
                <div className="text-center">
                  <div className="inline-flex p-4 rounded-full bg-secondary/20 mb-4">
                    <Building2 className="h-12 w-12 text-secondary" />
                  </div>
                  <h3 className="text-xl font-bold text-card-foreground mb-2">Receptor</h3>
                  <p className="text-sm text-card-foreground/70">Empresa que recebe e processa materiais recicláveis</p>
                </div>
              </Card>
            </div>
          ) : (
            <Card className="p-8 bg-card border-border">
              <div className="mb-6">
                <Button
                  variant="ghost"
                  onClick={() => setUserType(null)}
                  className="text-card-foreground/70 hover:text-card-foreground"
                >
                  ← Voltar
                </Button>
              </div>

              {userType === "gerador" && <GeradorForm />}
              {userType === "coletor" && <ColetorForm />}
              {userType === "receptor" && <ReceptorForm />}
            </Card>
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}

function GeradorForm() {
  const [tipo_pessoa, setTipoPessoa] = useState<string>("")

  return (
    <form className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-dark-foreground mb-2">Cadastro de Gerador</h2>
        <p className="text-sm text-dark-foreground/70">Preencha seus dados para começar</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="nome" className="text-dark-foreground">
            Nome completo
          </Label>
          <Input id="nome" placeholder="Seu nome" className="bg-background/50 border-border text-dark-foreground" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-dark-foreground">
            E-mail
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            className="bg-background/50 border-border text-dark-foreground"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="senha" className="text-dark-foreground">
            Senha
          </Label>
          <Input
            id="senha"
            type="password"
            placeholder="••••••••"
            className="bg-background/50 border-border text-dark-foreground"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="telefone" className="text-dark-foreground">
            Telefone
          </Label>
          <Input
            id="telefone"
            placeholder="(00) 00000-0000"
            className="bg-background/50 border-border text-dark-foreground"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="endereco" className="text-dark-foreground">
            Endereço completo
          </Label>
          <Input
            id="endereco"
            placeholder="Rua, número, bairro, cidade - UF"
            className="bg-background/50 border-border text-dark-foreground"
          />
        </div>

         <div className="space-y-2 md:col-span-2">
          <Label htmlFor="tipo_pessoa">
            Você é um(a):
          </Label>
          <Select onValueChange={setTipoPessoa}>
            <SelectTrigger className="bg-background/50 border-border">
              <SelectValue placeholder="Selecione"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fisica">Pessoa Física</SelectItem>
              <SelectItem value="juridica">Pessoa Jurídica (Empresa)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {tipo_pessoa === "juridica" && (
          <div className="space-y-2">
            <Label htmlFor="cnpj" className="text-dark-foreground">
              CNPJ
            </Label>
            <Input id="cnpj" placeholder="00.000.000/0000-00" className="bg-background/50 border-border text-dark-foreground" />
          </div>
        )}

        {tipo_pessoa === "fisica" && (
          <div className="space-y-2">
            <Label htmlFor="rg" className="text-dark-foreground">
              CPF
            </Label>
            <Input id="rg" placeholder="00.000.000-00" className="bg-background/50 border-border text-dark-foreground" />
          </div>
        )}
      
      </div>

      <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
        Criar conta
      </Button>
    </form>
  )
}

function ColetorForm() {
  const [tipo_pessoa, setTipoPessoa] = useState<string>("")

  return (
    <form className="space-y-6 text-dark-foreground">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Cadastro de Coletor</h2>
        <p className="text-sm text-dark-foreground/70">Preencha seus dados para começar</p>
      </div>

      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="nome">
            Nome completo
          </Label>
          <Input id="nome" placeholder="Seu nome" className="bg-background/50 border-border" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">
            E-mail
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            className="bg-background/50 border-border"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="senha">
            Senha
          </Label>
          <Input
            id="senha"
            type="password"
            placeholder="••••••••"
            className="bg-background/50 border-border"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="telefone">
            Telefone
          </Label>
          <Input
            id="telefone"
            placeholder="(00) 00000-0000"
            className="bg-background/50 border-border"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cpf">
            CPF
          </Label>
          <Input id="cpf" placeholder="000.000.000-00" className="bg-background/50 border-border" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tipo_veiculo">
            Tipo de veículo
          </Label>
          <Select>
            <SelectTrigger className="bg-background/50 border-border">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bicicleta">Bicicleta</SelectItem>
              <SelectItem value="motocicleta">Motocicleta</SelectItem>
              <SelectItem value="carrinho">Carrinho de coleta</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="capacidade">
            Capacidade de carga
          </Label>
          <Select>
            <SelectTrigger className="bg-background/50 border-border">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5kg">Até 5kg</SelectItem>
              <SelectItem value="10kg">Até 10kg</SelectItem>
              <SelectItem value="20kg">Até 20kg</SelectItem>
              <SelectItem value="30kg">Até 30kg</SelectItem>
              <SelectItem value="100kg">Até 100kg</SelectItem>
              <SelectItem value="200kg">Até 200kg</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="endereco">
            Endereço completo
          </Label>
          <Input
            id="endereco"
            placeholder="Rua, número, bairro, cidade - UF"
            className="bg-background/50 border-border"
          />
        </div>
      </div> */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="nome" className="text-dark-foreground">
            Nome completo
          </Label>
          <Input id="nome" placeholder="Seu nome" className="bg-background/50 border-border text-dark-foreground" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-dark-foreground">
            E-mail
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            className="bg-background/50 border-border text-dark-foreground"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="senha" className="text-dark-foreground">
            Senha
          </Label>
          <Input
            id="senha"
            type="password"
            placeholder="••••••••"
            className="bg-background/50 border-border text-dark-foreground"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="telefone" className="text-dark-foreground">
            Telefone
          </Label>
          <Input
            id="telefone"
            placeholder="(00) 00000-0000"
            className="bg-background/50 border-border text-dark-foreground"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="endereco" className="text-dark-foreground">
            Endereço completo
          </Label>
          <Input
            id="endereco"
            placeholder="Rua, número, bairro, cidade - UF"
            className="bg-background/50 border-border text-dark-foreground"
          />
        </div>

         <div className="space-y-2 md:col-span-2">
          <Label htmlFor="tipo_pessoa">
            Você é um(a):
          </Label>
          <Select onValueChange={setTipoPessoa}>
            <SelectTrigger className="bg-background/50 border-border">
              <SelectValue placeholder="Selecione"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fisica">Pessoa Física</SelectItem>
              <SelectItem value="juridica">Pessoa Jurídica (Empresa)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {tipo_pessoa === "juridica" && (
          <div className="space-y-2">
            <Label htmlFor="cnpj" className="text-dark-foreground">
              CNPJ
            </Label>
            <Input id="cnpj" placeholder="00.000.000/0000-00" className="bg-background/50 border-border text-dark-foreground" />
          </div>
        )}

        {tipo_pessoa === "fisica" && (
          <div className="space-y-2">
            <Label htmlFor="rg" className="text-dark-foreground">
              CPF
            </Label>
            <Input id="rg" placeholder="00.000.000-00" className="bg-background/50 border-border text-dark-foreground" />
          </div>
        )}
      
      </div>

      <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
        Criar conta
      </Button>
    </form>
  )
}

function ReceptorForm() {
  const [tipo_pessoa, setTipoPessoa] = useState<string>("")

  return (
    <form className="space-y-6 text-dark-foreground">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Cadastro de Receptor</h2>
        <p className="text-sm text-dark-foreground/70">Preencha os dados da empresa</p>
      </div>

      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
        <div className="space-y-2">
          <Label htmlFor="nome">
            Nome da empresa
          </Label>
          <Input id="nome" placeholder="Razão social" className="bg-background/50 border-border" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cnpj">
            CNPJ
          </Label>
          <Input
            id="cnpj"
            placeholder="00.000.000/0000-00"
            className="bg-background/50 border-border"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">
            E-mail
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="contato@empresa.com"
            className="bg-background/50 border-border"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="senha">
            Senha
          </Label>
          <Input
            id="senha"
            type="password"
            placeholder="••••••••"
            className="bg-background/50 border-border"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="telefone">
            Telefone
          </Label>
          <Input
            id="telefone"
            placeholder="(00) 0000-0000"
            className="bg-background/50 border-border"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="horario">
            Horário de funcionamento
          </Label>
          <Input
            id="horario"
            placeholder="Ex: Seg-Sex 8h-18h"
            className="bg-background/50 border-border"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="endereco">
            Endereço completo
          </Label>
          <Input
            id="endereco"
            placeholder="Rua, número, bairro, cidade - UF"
            className="bg-background/50 border-border"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="materiais">
            Tipos de material aceitos
          </Label>
          <Input
            id="materiais"
            placeholder="Ex: Papel, Plástico, Metal, Vidro"
            className="bg-background/50 border-border"
          />
        </div>
      </div> */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="nome" className="text-dark-foreground">
            Nome completo
          </Label>
          <Input id="nome" placeholder="Seu nome" className="bg-background/50 border-border text-dark-foreground" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-dark-foreground">
            E-mail
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            className="bg-background/50 border-border text-dark-foreground"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="senha" className="text-dark-foreground">
            Senha
          </Label>
          <Input
            id="senha"
            type="password"
            placeholder="••••••••"
            className="bg-background/50 border-border text-dark-foreground"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="telefone" className="text-dark-foreground">
            Telefone
          </Label>
          <Input
            id="telefone"
            placeholder="(00) 00000-0000"
            className="bg-background/50 border-border text-dark-foreground"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="endereco" className="text-dark-foreground">
            Endereço completo
          </Label>
          <Input
            id="endereco"
            placeholder="Rua, número, bairro, cidade - UF"
            className="bg-background/50 border-border text-dark-foreground"
          />
        </div>

         <div className="space-y-2 md:col-span-2">
          <Label htmlFor="tipo_pessoa">
            Você é um(a):
          </Label>
          <Select onValueChange={setTipoPessoa}>
            <SelectTrigger className="bg-background/50 border-border">
              <SelectValue placeholder="Selecione"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fisica">Pessoa Física</SelectItem>
              <SelectItem value="juridica">Pessoa Jurídica (Empresa)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {tipo_pessoa === "juridica" && (
          <div className="space-y-2">
            <Label htmlFor="cnpj" className="text-dark-foreground">
              CNPJ
            </Label>
            <Input id="cnpj" placeholder="00.000.000/0000-00" className="bg-background/50 border-border text-dark-foreground" />
          </div>
        )}

        {tipo_pessoa === "fisica" && (
          <div className="space-y-2">
            <Label htmlFor="rg" className="text-dark-foreground">
              CPF
            </Label>
            <Input id="rg" placeholder="00.000.000-00" className="bg-background/50 border-border text-dark-foreground" />
          </div>
        )}
      
      </div>

      <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
        Criar conta
      </Button>
    </form>
  )
}
