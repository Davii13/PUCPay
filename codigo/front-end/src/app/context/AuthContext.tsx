import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchApi } from "../services/api";

export type UserRole = "student" | "professor" | "company" | "admin";

export interface User {
  id?: string;
  name?: string;
  nome?: string;
  email: string;
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
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${response.nome}`,
      };

      if (loggedUser.role !== role) {
        throw new Error("Perfil incorreto selecionado");
      }

      setUser(loggedUser);
      localStorage.setItem("pucpay_user", JSON.stringify(loggedUser));
    } catch (error: any) {
      console.error(error);
      throw new Error(error.message || "Falha no login ou credenciais incorretas.");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("pucpay_user");
  };

  const register = async (data: RegisterData) => {
    try {
      const endpoint = data.role === "student" ? "/alunos" : data.role === "company" ? "/empresas" : "/professores";
      
      const payload: any = {
        nome: data.name,
        email: data.email,
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
      const payload = { ...user, ...data };
      
      const response = await fetchApi(endpoint, {
        method: "PUT",
        body: JSON.stringify(payload)
      });
      
      const updatedUser = { ...user, ...response, balance: response.saldo || user.balance };
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
