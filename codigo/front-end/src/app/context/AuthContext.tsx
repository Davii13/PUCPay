import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchApi } from "../services/api";

export type UserRole = "student" | "professor" | "company" | "admin";

export interface User {
  id?: string;
  name?: string;
  nome?: string;
  email: string;
  telefone?: string;
  login?: string;
  senha?: string;
  role: UserRole;
  avatar?: string;
  balance?: number;
  saldo?: number;
  institution?: string;
  course?: string;
  curso?: string;
  department?: string;
  companyName?: string;
  cpf?: string;
  rg?: string;
  endereco?: string;
  cnpj?: string;
  xpTotal?: number;
  nivel?: number;
  totalResgates?: number;
  totalMoedasRecebidas?: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  register: (data: RegisterData) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  updateLocalBalance: (newBalance: number) => void;
}

export interface RegisterData {
  name: string;
  email: string;
  telefone?: string;
  password: string;
  role: UserRole;
  institution?: string;
  instituicaoId?: number;
  course?: string;
  department?: string;
  companyName?: string;
  cpf?: string;
  rg?: string;
  endereco?: string;
  cnpj?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("pucpay_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string, role: UserRole) => {
    try {
      const response = await fetchApi("/auth/login", {
        method: "POST",
        body: JSON.stringify({ login: email, senha: password }),
      });

      const loggedUser: User = {
        ...response,
        id: response.id.toString(),
        name: response.nome,
        email: response.email,
        telefone: response.telefone,
        login: response.login,
        balance: response.saldo || 0,
        role: response.role === "EMPRESA" ? "company" :
              response.role === "ALUNO" ? "student" :
              response.role === "PROFESSOR" ? "professor" :
              response.role.toLowerCase() as UserRole,
        course: response.curso,
        department: response.departamento,
        cnpj: response.cnpj,
        institution: response.instituicaoNome,
        xpTotal: response.xpTotal || 0,
        nivel: response.nivel || 1,
        totalResgates: response.totalResgates || 0,
        totalMoedasRecebidas: response.totalMoedasRecebidas || 0,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${response.nome}`,
      };

      if (loggedUser.role !== role) {
        throw new Error("Perfil incorreto selecionado");
      }

      setUser(loggedUser);
      localStorage.setItem("pucpay_user", JSON.stringify(loggedUser));

      if (response.token) {
        localStorage.setItem("authToken", response.token);
      }
    } catch (error: any) {
      console.error(error);
      throw new Error(error.message || "Falha no login ou credenciais incorretas.");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("pucpay_user");
    localStorage.removeItem("authToken");
  };

  const register = async (data: RegisterData) => {
    try {
      const endpoint = data.role === "student" ? "/alunos" : data.role === "company" ? "/empresas" : "/professores";
      
      const payload: any = {
        nome: data.name,
        email: data.email,
        telefone: data.telefone,
        senha: data.password,
        cpf: data.cpf,
        rg: data.rg,
        endereco: data.endereco,
        instituicaoId: data.instituicaoId
      };

      if (data.role === "student") {
        payload.curso = data.course;
      } else if (data.role === "professor") {
        payload.departamento = data.department;
      } else if (data.role === "company") {
        payload.cnpj = data.cnpj;
      }

      await fetchApi(endpoint, {
        method: "POST",
        body: JSON.stringify(payload)
      });
      
    } catch (error: any) {
      console.error(error);
      throw new Error(error.message || "Erro ao realizar cadastro.");
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;

    try {
      const endpoint = user.role === "student" ? `/alunos/${user.id}` : user.role === "company" ? `/empresas/${user.id}` : `/professores/${user.id}`;

      // Mapear campos para o formato do back-end
      const payload: any = { ...data };
      if (data.name) payload.nome = data.name;
      if (user.role === "company" && data.companyName) payload.nome = data.companyName;
      if (user.role === "professor" && data.department) payload.departamento = data.department;
      if (user.role === "student" && data.course) payload.curso = data.course;

      const response = await fetchApi(endpoint, {
        method: "PUT",
        body: JSON.stringify(payload)
      });

      const updatedUser = {
        ...user,
        ...response,
        name: response.nome || user.name,
        balance: response.saldo !== undefined ? response.saldo : user.balance,
        department: response.departamento || user.department,
        course: response.curso || user.course
      };
      setUser(updatedUser);
      localStorage.setItem("pucpay_user", JSON.stringify(updatedUser));
    } catch (error: any) {
      console.error(error);
      throw new Error("Erro ao atualizar perfil.");
    }
  };

  const updateLocalBalance = (newBalance: number) => {
    if (!user) return;
    const updatedUser = { ...user, balance: newBalance, saldo: newBalance };
    setUser(updatedUser);
    localStorage.setItem("pucpay_user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        register,
        updateProfile,
        updateLocalBalance,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
