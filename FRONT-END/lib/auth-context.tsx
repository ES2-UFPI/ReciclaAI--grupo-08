"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type tipoUsuario = "gerador" | "coletor" | "receptor"
type tipoPessoa = "fisica" | "juridica"

interface User {
  id: string
  nome: string
  email: string
  telefone: string
  endereco: string
  tipoUsuario: tipoUsuario
  tipoPessoa: tipoPessoa
  cpf?: string
  cnpj?: string
  pontos: number
}

interface AuthContextType {
  user: User | null
  login: (email: string, senha: string) => Promise<boolean>
  signup: (userData: Omit<User, "id" | "pontos"> & { senha: string }) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem("reciclai_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const signup = async (userData: Omit<User, "id" | "pontos"> & { senha: string }) => {
    try {
      // Get existing users
      const usersJson = localStorage.getItem("reciclai_users")
      const users = usersJson ? JSON.parse(usersJson) : []

      // Check if email already exists
      if (users.find((u: any) => u.email === userData.email)) {
        return false
      }

      // Create new user
      const newUser: User & { senha: string } = {
        id: Math.random().toString(36).substr(2, 9),
        ...userData,
        pontos: 0,
      }

      // Save to users list
      users.push(newUser)
      localStorage.setItem("reciclai_users", JSON.stringify(users))

      // Set usuario atual (sem senha)
      const { senha, ...userWithoutPassword } = newUser
      setUser(userWithoutPassword)
      localStorage.setItem("reciclai_user", JSON.stringify(userWithoutPassword))

      return true
    } catch (error) {
      console.error("Signup error:", error)
      return false
    }
  }

  const login = async (email: string, senha: string) => {
    try {
      const usersJson = localStorage.getItem("reciclai_users")
      const users = usersJson ? JSON.parse(usersJson) : []

      const foundUser = users.find((u: any) => u.email === email && u.senha === senha)

      if (foundUser) {
        const { senha, ...userWithoutPassword } = foundUser
        setUser(userWithoutPassword)
        localStorage.setItem("reciclai_user", JSON.stringify(userWithoutPassword))
        return true
      }

      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("reciclai_user")
  }

  return <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
