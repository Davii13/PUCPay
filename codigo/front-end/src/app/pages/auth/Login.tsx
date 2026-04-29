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
      navigate(role === "student" ? "/student" : role === "professor" ? "/professor" : "/company");
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
  };

  const fillDemo = () => {
    setEmail(demoCredentials[role].email);
    setPassword(demoCredentials[role].password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 mb-4"
          >
            <Coins className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            PUCPAY
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Sistema de Moeda Estudantil
          </p>
        </div>

        <Card className="border-none shadow-xl">
          <CardHeader>
            <CardTitle>Entrar na plataforma</CardTitle>
            <CardDescription>
              Escolha seu perfil e faça login
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={role} onValueChange={(v) => setRole(v as UserRole)}>
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="student" className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  Aluno
                </TabsTrigger>
                <TabsTrigger value="professor" className="flex items-center gap-2">
                  <Coins className="w-4 h-4" />
                  Professor
                </TabsTrigger>
                <TabsTrigger value="company" className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Empresa
                </TabsTrigger>
              </TabsList>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <Button
                    type="button"
                    variant="link"
                    className="p-0 h-auto"
                    onClick={fillDemo}
                  >
                    Usar dados de demonstração
                  </Button>
                  <Link
                    to="/auth/forgot-password"
                    className="text-purple-600 hover:text-purple-700"
                  >
                    Esqueceu a senha?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800"
                  disabled={loading}
                >
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Entrar
                </Button>

                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                  Não tem uma conta?{" "}
                  <Link
                    to="/auth/register"
                    className="text-purple-600 hover:text-purple-700 font-medium"
                  >
                    Cadastre-se
                  </Link>
                </p>
              </form>
            </Tabs>
          </CardContent>
        </Card>

        <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
          <p className="text-xs text-center text-gray-600 dark:text-gray-400">
            💡 <span className="font-medium">Dica:</span> Use os dados de demonstração para explorar o sistema
          </p>
        </div>
      </motion.div>
    </div>
  );
}
