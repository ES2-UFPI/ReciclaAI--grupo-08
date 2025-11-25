'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api'; // Sua instância simples do axios
import { 
  UsuarioResponse, 
  UsuarioLogin, 
  UsuarioCreate 
} from '@/types/index';

interface AuthContextType {
  user: UsuarioResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (dados: UsuarioLogin) => Promise<void>;
  register: (dados: UsuarioCreate) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UsuarioResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  // helper: determina rota de dashboard por tipo de usuário
  const dashboardRouteFor = (u: UsuarioResponse | null) => {
    if (!u) return "/auth"
    switch (u.tipo_usuario) {
      case "produtor":
        return "/dashboard/produtor"
      case "coletor":
        return "/dashboard/coletor"
      case "receptor":
        return "/dashboard/receptor"
      default:
        return "/auth"
    }
  }
  
  // 1. Recuperar sessão ao recarregar a página
  useEffect(() => {
    // tenta ler chaves usadas anteriormente (compatibilidade)
    const userSalvo = localStorage.getItem('reciclaai_user') || localStorage.getItem('reciclai_user')
    if (userSalvo) {
      try {
        setUser(JSON.parse(userSalvo));
      } catch {
        localStorage.removeItem('reciclaai_user')
      }
    }
    setIsLoading(false);
  }, []);

  // 2. Função de Login (Chamando API direto)
  async function login(dados: UsuarioLogin) {
    setIsLoading(true)
    try {
      const response = await api.post<UsuarioResponse>('/auth/login', dados)
      const usuarioLogado = response.data

      setUser(usuarioLogado)
      // grava em ambas chaves para compatibilidade com versões anteriores
      localStorage.setItem('reciclaai_user', JSON.stringify(usuarioLogado))
      console.log("Usuário logado:", usuarioLogado)

      router.push(dashboardRouteFor(usuarioLogado))
      console.log("Redirecionando para:", dashboardRouteFor(usuarioLogado))
    } catch (error) {
      console.error("Erro no login:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // 3. Função de Registro/Cadastro (Chamando API direto)
  async function register(dados: UsuarioCreate) {
    setIsLoading(true)
    try {
      const response = await api.post<UsuarioResponse>('/auth/register', dados)
      const novoUsuario = response.data

      setUser(novoUsuario)
      localStorage.setItem('reciclaai_user', JSON.stringify(novoUsuario))

      router.push(dashboardRouteFor(novoUsuario))
      return true
    } catch (error: any) {
      console.error("Erro no cadastro:", error)
      if (error?.response?.data) console.error("Backend response:", error.response.data)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // 4. Logout
  async function logout() {
    setUser(null)
    localStorage.removeItem('reciclaai_user')
    setIsLoading(false)
    await router.replace("/auth")
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);