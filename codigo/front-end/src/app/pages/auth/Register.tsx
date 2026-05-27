import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth, UserRole } from "../../context/AuthContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Coins, GraduationCap, Building2, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { motion } from "motion/react";

import backgroundImage from "../../../assets/puc.jpg";

export function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    telefone: "",
    password: "",
    confirmPassword: "",
    institution: "",
    course: "",
    department: "",
    companyName: "",
    cpf: "",
    rg: "",
    endereco: "",
    cnpj: "",
  });
  const [role, setRole] = useState<UserRole>("student");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("A senha deve ter no mínimo 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      await register({
        name: role === "company" ? formData.companyName : formData.name,
        email: formData.email,
        telefone: formData.telefone,
        password: formData.password,
        role,
        institution: formData.institution,
        course: formData.course,
        department: formData.department,
        companyName: formData.companyName,
        cpf: formData.cpf,
        rg: formData.rg,
        endereco: formData.endereco,
        cnpj: formData.cnpj,
      });
      toast.success("Conta criada com sucesso! Faça login para continuar.");
      navigate("/auth/login");
    } catch (error) {
      toast.error("Erro ao criar conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Coluna da Imagem */}
      <div className="hidden lg:block relative overflow-hidden">
        <img 
          src={backgroundImage} 
          alt="PUC Background" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/90 to-purple-900/20 flex flex-col justify-end p-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-6">
              <Coins className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Comece sua jornada
            </h2>
            <p className="text-purple-100 text-lg max-w-md">
              Crie sua conta no PUCPAY e tenha acesso a um mundo de vantagens e facilidades acadêmicas.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Coluna do Formulário */}
      <div className="flex items-center justify-center p-8 bg-white dark:bg-gray-950 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md py-12"
        >
          <div className="mb-8">
            <Link
              to="/auth/login"
              className="inline-flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 font-medium mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para login
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Criar nova conta
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Preencha os dados abaixo para começar
            </p>
          </div>

          <Tabs value={role} onValueChange={(v) => setRole(v as UserRole)}>
            <TabsList className="grid w-full grid-cols-3 mb-8 p-1 bg-gray-100 dark:bg-gray-900">
              <TabsTrigger value="student" className="text-xs">Aluno</TabsTrigger>
              <TabsTrigger value="professor" className="text-xs">Professor</TabsTrigger>
              <TabsTrigger value="company" className="text-xs">Empresa</TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Como você quer ser chamado?"
                  value={formData.name}
                  onChange={handleChange}
                  className="h-11 border-gray-200"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email acadêmico/profissional</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="exemplo@puc.br"
                  value={formData.email}
                  onChange={handleChange}
                  className="h-11 border-gray-200"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone">WhatsApp</Label>
                <Input
                  id="telefone"
                  name="telefone"
                  type="tel"
                  placeholder="5531999999999"
                  value={formData.telefone}
                  onChange={handleChange}
                  className="h-11 border-gray-200"
                />
              </div>

              {role === "student" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cpf">CPF</Label>
                    <Input id="cpf" name="cpf" placeholder="000.000.000-00" value={formData.cpf} onChange={handleChange} required className="h-11 border-gray-200" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rg">RG</Label>
                    <Input id="rg" name="rg" placeholder="MG-000..." value={formData.rg} onChange={handleChange} required className="h-11 border-gray-200" />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="endereco">Endereço</Label>
                    <Input id="endereco" name="endereco" placeholder="Rua, Número, Bairro..." value={formData.endereco} onChange={handleChange} required className="h-11 border-gray-200" />
                  </div>
                </div>
              )}

              {role === "professor" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="cpf">CPF</Label>
                    <Input id="cpf" name="cpf" placeholder="000.000.000-00" value={formData.cpf} onChange={handleChange} required className="h-11 border-gray-200" />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="department">Departamento</Label>
                    <Input id="department" name="department" placeholder="Ex: ICEI" value={formData.department} onChange={handleChange} className="h-11 border-gray-200" />
                  </div>
                </div>
              )}

              {role === "company" && (
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2 col-span-2">
                    <Label htmlFor="companyName">Nome da Empresa</Label>
                    <Input id="companyName" name="companyName" placeholder="Razão Social" value={formData.companyName} onChange={handleChange} className="h-11 border-gray-200" />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="cnpj">CNPJ</Label>
                    <Input id="cnpj" name="cnpj" placeholder="00.000.000/0001-00" value={formData.cnpj} onChange={handleChange} required className="h-11 border-gray-200" />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input id="password" name="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required className="h-11 border-gray-200" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar</Label>
                  <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} required className="h-11 border-gray-200" />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl mt-4 transition-all"
                disabled={loading}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Criar minha conta"}
              </Button>

              <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
                Já possui uma conta?{" "}
                <Link
                  to="/auth/login"
                  className="text-purple-600 hover:text-purple-700 font-bold"
                >
                  Fazer login
                </Link>
              </p>
            </form>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
