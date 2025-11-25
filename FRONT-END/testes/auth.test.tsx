import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import AuthPage from "@/app/auth/page"

// mock do next/router
jest.mock("next/navigation", () => ({ useRouter: () => ({ push: jest.fn(), replace: jest.fn() }) }))

// mock do auth-context corretamente
jest.mock("@/lib/auth-context", () => ({
  useAuth: jest.fn(),
}))

import { useAuth } from "@/lib/auth-context"
const mockedUseAuth = useAuth as jest.MockedFunction<typeof useAuth>

describe("Auth page", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test("submete login chamando login com email e senha", async () => {
    const mockLogin = jest.fn().mockResolvedValue(undefined)
    mockedUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: mockLogin,
      register: jest.fn(),
      logout: jest.fn(),
    } as any)

    render(<AuthPage />)

    const email = screen.getByLabelText(/Email/i)
    const password = screen.getByLabelText(/Senha/i)
    const submit = screen.getByRole("button", { name: /Entrar/i })

    fireEvent.change(email, { target: { value: "user@example.com" } })
    fireEvent.change(password, { target: { value: "s3nh@123" } })
    fireEvent.click(submit)

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledTimes(1)
      expect(mockLogin).toHaveBeenCalledWith({ email: "user@example.com", senha: "s3nh@123" })
    })
  })

  test("cadastra usuário montando endereco único e chama register", async () => {
    const mockRegister = jest.fn().mockResolvedValue(true)
    mockedUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: jest.fn(),
      register: mockRegister,
      logout: jest.fn(),
    } as any)

    render(<AuthPage />)

    const tabCadastrar = screen.getByRole("tab", { name: /Cadastrar/i })
    fireEvent.click(tabCadastrar)

    // aguarda o painel de cadastro aparecer antes de preencher os campos
    await waitFor(() => expect(screen.getByLabelText(/^Nome$/i)).toBeInTheDocument())

    // preenche campos (ajuste os seletores caso os labels no componente sejam diferentes)
    fireEvent.change(screen.getByLabelText(/^Nome$/i), { target: { value: "Maria Tester" } })
    fireEvent.change(screen.getByLabelText(/^Email$/i), { target: { value: "maria@test.com" } })
    fireEvent.change(screen.getByLabelText(/^Senha$/i), { target: { value: "senha123" } })
    fireEvent.change(screen.getByLabelText(/Telefone/i), { target: { value: "11999999999" } })

    fireEvent.change(screen.getByLabelText(/Rua\*/i), { target: { value: "Av. Brasil" } })
    fireEvent.change(screen.getByLabelText(/Número\*/i), { target: { value: "123" } })
    fireEvent.change(screen.getByLabelText(/Bairro\*/i), { target: { value: "Centro" } })
    fireEvent.change(screen.getByLabelText(/Cidade\*/i), { target: { value: "Teresina" } })
    fireEvent.change(screen.getByLabelText(/Estado\*/i), { target: { value: "Piauí" } })
    fireEvent.change(screen.getByLabelText(/CEP/i), { target: { value: "64000-000" } })

    // CPF aparece quando tipo_pessoa é física
    fireEvent.change(screen.getByLabelText(/CPF/i), { target: { value: "00000000000" } })

    const cadastrarBtn = screen.getByRole("button", { name: /Cadastrar/i })
    fireEvent.click(cadastrarBtn)

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledTimes(1)
      const payload = mockRegister.mock.calls[0][0]
      expect(payload.endereco).toBe("Av. Brasil, 123, Centro, Teresina, Piauí, 64000-000")
      expect(payload.nome).toBe("Maria Tester")
      expect(payload.email).toBe("maria@test.com")
      expect(payload.senha).toBe("senha123")
      expect(payload.cpf).toBe("00000000000")
    })
  })
})