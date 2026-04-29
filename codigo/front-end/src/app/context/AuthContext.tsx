import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "student" | "professor" | "company";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  balance: number;
  institution?: string;
  course?: string;
  department?: string;
  companyName?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  register: (data: RegisterData) => Promise<void>;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  institution?: string;
  course?: string;
  department?: string;
  companyName?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers: Record<string, User> = {
  "student@puc.br": {
    id: "1",
    name: "Maria Silva",
    email: "student@puc.br",
    role: "student",
    balance: 1250,
    institution: "PUC Minas",
    course: "Ciência da Computação",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
  },
  "professor@puc.br": {
    id: "2",
    name: "Dr. João Santos",
    email: "professor@puc.br",
    role: "professor",
    balance: 5000,
    institution: "PUC Minas",
    department: "Departamento de Computação",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Joao",
  },
  "empresa@parceiro.com": {
    id: "3",
    name: "Carlos Oliveira",
    email: "empresa@parceiro.com",
    role: "company",
    balance: 0,
    companyName: "TechCorp Solutions",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("pucpay_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string, role: UserRole) => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const mockUser = mockUsers[email];
    if (mockUser && mockUser.role === role) {
      setUser(mockUser);
      localStorage.setItem("pucpay_user", JSON.stringify(mockUser));
    } else {
      throw new Error("Credenciais inválidas");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("pucpay_user");
  };

  const register = async (data: RegisterData) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: data.name,
      email: data.email,
      role: data.role,
      balance: data.role === "professor" ? 5000 : 0,
      institution: data.institution,
      course: data.course,
      department: data.department,
      companyName: data.companyName,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`,
    };

    setUser(newUser);
    localStorage.setItem("pucpay_user", JSON.stringify(newUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        register,
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
