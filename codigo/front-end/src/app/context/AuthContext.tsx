import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "student" | "professor" | "company";

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
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  institution?: string;
  course?: string;
  department?: string;
  companyName?: string;
  cpf?: string;
  rg?: string;
  endereco?: string;
  cnpj?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = "http://localhost:8080/api";

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
      const endpoint = role === "student" ? "/alunos" : role === "company" ? "/empresas" : "/professores";
      
      if (!endpoint) {
        throw new Error("Credenciais inválidas");
      }

      const response = await fetch(`${API_URL}${endpoint}`);
      if (!response.ok) throw new Error("Erro na comunicação com o servidor");
      
      const users: User[] = await response.json();
      const foundUser = users.find(u => u.email === email && u.senha === password);

      if (foundUser) {
        const loggedUser: User = {
          ...foundUser,
          name: foundUser.nome || foundUser.name,
          course: foundUser.curso || foundUser.course,
          balance: foundUser.saldo || foundUser.balance || 0,
          role: role,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${foundUser.nome}`,
        };
        setUser(loggedUser);
        localStorage.setItem("pucpay_user", JSON.stringify(loggedUser));
      } else {
        throw new Error("Credenciais inválidas");
      }
    } catch (error) {
      console.error(error);
      throw new Error("Falha no login ou credenciais incorretas.");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("pucpay_user");
  };

  const register = async (data: RegisterData) => {
    let endpoint = "";
    let payload: any = {
      nome: data.name,
      email: data.email,
      login: data.email,
      senha: data.password,
    };

    if (data.role === "student") {
      endpoint = "/alunos";
      payload = {
        ...payload,
        cpf: data.cpf,
        rg: data.rg,
        endereco: data.endereco,
        curso: data.course || "Não informado",
        saldo: 0.0
      };
    } else if (data.role === "company") {
      endpoint = "/empresas";
      payload = {
        ...payload,
        cnpj: data.cnpj,
      };
    } else {
      endpoint = "/professores";
      payload = {
        ...payload,
        cpf: data.cpf,
        departamento: data.department || "Não informado",
        saldo: 5000.0
      };
    }

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Erro ao cadastrar usuário no sistema.");
      }

      const createdUser = await response.json();
      const newUser: User = {
        ...createdUser,
        name: createdUser.nome,
        course: createdUser.curso,
        balance: createdUser.saldo || 0,
        role: data.role,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${createdUser.nome}`,
      };

      setUser(newUser);
      localStorage.setItem("pucpay_user", JSON.stringify(newUser));
    } catch (error) {
      console.error(error);
      throw new Error("Erro de comunicação com o servidor.");
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user || !user.id) return;
    
    let endpoint = "";
    if (user.role === "student") endpoint = `/alunos/${user.id}`;
    else if (user.role === "company") endpoint = `/empresas/${user.id}`;
    else endpoint = `/professores/${user.id}`;

    const payload = {
      ...user,
      nome: data.name || user.name || user.nome,
      email: data.email || user.email,
      login: data.email || user.login || user.email,
      cpf: data.cpf || user.cpf,
      rg: data.rg || user.rg,
      endereco: data.endereco || user.endereco,
      curso: data.course || user.curso || user.course,
      departamento: data.department || user.department,
      cnpj: data.cnpj || user.cnpj,
      senha: data.senha || user.senha || "123456" // Assuming it must be provided for update
    };

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar perfil no servidor.");
      }

      const updatedData = await response.json();
      const updatedUser: User = {
        ...user,
        ...updatedData,
        name: updatedData.nome || updatedData.name,
        course: updatedData.curso || updatedData.course,
      };

      setUser(updatedUser);
      localStorage.setItem("pucpay_user", JSON.stringify(updatedUser));
    } catch (error) {
      console.error(error);
      throw new Error("Falha na atualização do perfil.");
    }
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
