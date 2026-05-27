import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth, UserRole } from "../../context/AuthContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Coins, GraduationCap, Building2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "motion/react";

import backgroundImage from "../../../assets/puc.jpg";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password, role);
      toast.success("Login realizado com sucesso!");
      navigate(role === "student" ? "/student" : role === "professor" ? "/professor" : role === "admin" ? "/admin" : "/company");
    } catch (error) {
      toast.error("Credenciais inválidas. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const demoCredentials = {
    student: { email: "student@puc.br", password: "demo123" },
    professor: { email: "professor@puc.br", password: "demo123" },
    company: { email: "empresa@parceiro.com", password: "demo123" },
    admin: { email: "admin@puc.br", password: "admin" },
  };

  const fillDemo = () => {
    setEmail(demoCredentials[role].email);
    setPassword(demoCredentials[role].password);
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
            transition={{ delay: 0.2 }}
          >
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-6">
              <Coins className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Bem-vindo ao PUCPAY
            </h2>
            <p className="text-purple-100 text-lg max-w-md">
              A plataforma oficial de gestão de moedas estudantis da PUC. 
              Reconhecendo o mérito e facilitando trocas acadêmicas.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Coluna do Formulário */}
      <div className="flex items-center justify-center p-8 bg-white dark:bg-gray-950">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden text-center mb-8">
             <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-600 mb-4">
              <Coins className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">PUCPAY</h1>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Entrar na conta
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Escolha seu perfil e acesse sua carteira
            </p>
          </div>

          <Tabs value={role} onValueChange={(v) => setRole(v as UserRole)}>
            <TabsList className="grid w-full grid-cols-4 mb-8 p-1 bg-gray-100 dark:bg-gray-900">
              <TabsTrigger value="student" className="text-xs">Aluno</TabsTrigger>
              <TabsTrigger value="professor" className="text-xs">Professor</TabsTrigger>
              <TabsTrigger value="company" className="text-xs">Empresa</TabsTrigger>
              <TabsTrigger value="admin" className="text-xs">Admin</TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="exemplo@puc.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 border-gray-200 dark:border-gray-800 focus:ring-purple-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                  <Link
                    to="/auth/forgot-password"
                    className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                  >
                    Esqueceu a senha?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 border-gray-200 dark:border-gray-800 focus:ring-purple-500"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={fillDemo}
                  className="text-xs font-medium border-purple-100 text-purple-700 hover:bg-purple-50"
                >
                  💡 Usar dados de teste
                </Button>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all active:scale-95"
                disabled={loading}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Entrar agora"}
              </Button>

              <p className="text-center text-gray-600 dark:text-gray-400">
                Não tem uma conta?{" "}
                <Link
                  to="/auth/register"
                  className="text-purple-600 hover:text-purple-700 font-bold"
                >
                  Cadastre-se grátis
                </Link>
              </p>
            </form>
          </Tabs>

          <div className="mt-12 text-center">
            <p className="text-xs text-gray-400">
              © 2026 PUCPAY. Todos os direitos reservados.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
