import { useAuth } from "../../context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  Coins,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Gift,
  Eye,
  Wallet,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  History,
  Receipt,
  User
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { useEffect, useState } from "react";
import { fetchApi } from "../../services/api";

export function StudentDashboard() {
  const { user } = useAuth();
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [recommendedBenefits, setRecommendedBenefits] = useState<any[]>([]);
  const [thisMonthEarned, setThisMonthEarned] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      setLoading(true);
      Promise.all([
        fetchApi(`/transacoes/aluno/${user.id}`),
        fetchApi("/vantagens")
      ]).then(([transactions, advantages]) => {
        setRecentTransactions(transactions.slice(0, 5));
        
        const currentMonth = new Date().getMonth();
        const earned = transactions
          .filter((t: any) => t.tipo === "ENVIO" && new Date(t.dataHora).getMonth() === currentMonth)
          .reduce((sum: number, t: any) => sum + t.valor, 0);
        setThisMonthEarned(earned);
        
        setRecommendedBenefits(advantages.slice(0, 4));
      })
      .catch((err) => {
        console.error("Erro ao carregar dashboard:", err);
        toast.error("Erro ao carregar dados do dashboard");
      })
      .finally(() => setLoading(false));
    }
  }, [user]);

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  const balanceHistory = [
    { month: "Jan", balance: 120 },
    { month: "Fev", balance: 450 },
    { month: "Mar", balance: 380 },
    { month: "Abr", balance: user?.balance || 0 },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-950 pb-12">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              {getTimeGreeting()}, <span className="text-purple-600">{(user?.name || user?.nome)?.split(" ")[0]}</span> 👋
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
              Você tem <span className="font-bold text-gray-900 dark:text-white">{user?.balance} PUCCoins</span> para resgatar hoje.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <Link to="/marketplace">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-2xl px-6 h-12 shadow-lg shadow-purple-200 dark:shadow-none transition-all active:scale-95">
                <ShoppingBag className="w-5 h-5 mr-2" />
                Explorar Marketplace
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Top Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Balance Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            <Card className="relative overflow-hidden border-none bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 text-white shadow-2xl h-[280px]">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Wallet className="w-48 h-48" />
              </div>
              <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute -top-12 -left-12 w-48 h-48 bg-purple-400/20 rounded-full blur-3xl" />
              
              <CardContent className="h-full flex flex-col justify-between p-8 relative z-10">
                <div className="flex justify-between items-start">
                  <div>
                    <Badge className="bg-white/20 text-white border-none backdrop-blur-md mb-4 px-3 py-1">
                      <Sparkles className="w-3 h-3 mr-1 text-yellow-300" />
                      Conta Premium Aluno
                    </Badge>
                    <p className="text-purple-100 font-medium uppercase tracking-wider text-xs">Saldo em Carteira</p>
                    <div className="flex items-baseline gap-3 mt-1">
                      <h2 className="text-6xl font-black tabular-nums">{user?.balance}</h2>
                      <span className="text-2xl font-semibold text-purple-200">PUCCoins</span>
                    </div>
                  </div>
                  <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20">
                    <Coins className="w-8 h-8 text-white" />
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mt-6">
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl p-4 flex-1 border border-white/10">
                    <div className="w-10 h-10 rounded-full bg-green-400/20 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-green-300" />
                    </div>
                    <div>
                      <p className="text-[10px] text-purple-200 uppercase font-bold tracking-widest">Ganhos do Mês</p>
                      <p className="text-lg font-bold">+{thisMonthEarned}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl p-4 flex-1 border border-white/10">
                    <div className="w-10 h-10 rounded-full bg-orange-400/20 flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5 text-orange-300" />
                    </div>
                    <div>
                      <p className="text-[10px] text-purple-200 uppercase font-bold tracking-widest">Resgates efetuados</p>
                      <p className="text-lg font-bold">12</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Stats / Action Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="h-full border-none shadow-xl bg-white dark:bg-gray-900 overflow-hidden group">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <History className="w-5 h-5 text-purple-600" />
                  Acesso Rápido
                </CardTitle>
                <CardDescription>Atalhos para suas tarefas</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3 p-4">
                <Link to="/marketplace" className="group">
                  <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all text-center">
                    <Gift className="w-6 h-6 text-purple-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Vantagens</span>
                  </div>
                </Link>
                <Link to="/transactions">
                  <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all text-center">
                    <Receipt className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Extrato</span>
                  </div>
                </Link>
                <Link to="/profile">
                  <div className="p-4 rounded-2xl bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-all text-center">
                    <User className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Meu Perfil</span>
                  </div>
                </Link>
                <Link to="/conquistas">
                  <div className="p-4 rounded-2xl bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-all text-center">
                    <Sparkles className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Conquistas</span>
                  </div>
                </Link>
                <Link to="/leaderboard">
                  <div className="p-4 rounded-2xl bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-all text-center">
                    <TrendingUp className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Ranking</span>
                  </div>
                </Link>
              </CardContent>
              <div className="px-4 pb-4 mt-auto">
                <Button variant="ghost" className="w-full text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 group">
                  Ver todas as opções
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Charts & Lists Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Chart Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="border-none shadow-xl bg-white dark:bg-gray-900 overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-8">
                <div>
                  <CardTitle className="text-xl">Evolução Financeira</CardTitle>
                  <CardDescription>Seu histórico de acúmulo de PUCCoins</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-purple-600 border-purple-200">Semanal</Badge>
                  <Badge className="bg-purple-600">Mensal</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={balanceHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#9333ea" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#9333ea" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis 
                        dataKey="month" 
                        stroke="#94a3b8" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false} 
                        dy={10}
                      />
                      <YAxis 
                        stroke="#94a3b8" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false}
                        tickFormatter={(value) => `${value}`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.95)",
                          border: "none",
                          borderRadius: "16px",
                          boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="balance"
                        stroke="#9333ea"
                        strokeWidth={4}
                        fillOpacity={1}
                        fill="url(#chartGradient)"
                        animationDuration={2000}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recommended Benefits Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-none shadow-xl bg-white dark:bg-gray-900 h-full flex flex-col">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-500" />
                    Para Você
                  </CardTitle>
                  <Link to="/marketplace" className="text-xs text-purple-600 font-bold hover:underline">Ver tudo</Link>
                </div>
                <CardDescription>Resgates recomendados por nós</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <AnimatePresence>
                  {recommendedBenefits.map((benefit, index) => (
                    <motion.div
                      key={benefit.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all border border-transparent hover:border-purple-100 dark:hover:border-purple-900/30 group cursor-pointer"
                    >
                      <div className="relative">
                        <img
                          src={benefit.fotoUrl || `https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=150&auto=format&fit=crop`}
                          alt={benefit.titulo}
                          className="w-16 h-16 rounded-xl object-cover shadow-sm group-hover:shadow-md transition-shadow"
                        />
                        {benefit.custo <= (user?.balance || 0) && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-gray-900 dark:text-white truncate group-hover:text-purple-600 transition-colors">
                          {benefit.titulo}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          {benefit.empresa?.nome || "Empresa Parceira"}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-purple-600">{benefit.custo}</span>
                          <Coins className="w-3 h-3 text-purple-600" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Transactions Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-none shadow-xl bg-white dark:bg-gray-900">
            <CardHeader className="flex flex-row items-center justify-between border-b border-gray-50 dark:border-gray-800 pb-6">
              <div>
                <CardTitle className="text-xl">Atividade Recente</CardTitle>
                <CardDescription>Últimas movimentações da sua conta</CardDescription>
              </div>
              <Link to="/transactions">
                <Button variant="outline" className="rounded-xl border-purple-100 hover:bg-purple-50 text-purple-600">
                  Ver Extrato Completo
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="pt-6">
              {recentTransactions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <History className="w-10 h-10 text-gray-300" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Nenhuma transação ainda</h3>
                  <p className="text-gray-500">Seus ganhos e resgates aparecerão aqui.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {recentTransactions.map((transaction, index) => (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.05 }}
                      className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all border border-transparent hover:border-gray-100 dark:hover:border-gray-800"
                    >
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${
                          transaction.tipo === "ENVIO"
                            ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600"
                            : "bg-rose-50 dark:bg-rose-900/20 text-rose-600"
                        }`}
                      >
                        {transaction.tipo === "ENVIO" ? (
                          <ArrowDownRight className="w-6 h-6" />
                        ) : (
                          <ArrowUpRight className="w-6 h-6" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-gray-900 dark:text-white truncate">
                            {transaction.mensagem || (transaction.tipo === "ENVIO" ? "Crédito Acadêmico" : `Resgate: ${transaction.vantagem?.titulo}`)}
                          </p>
                          <Badge variant="secondary" className="text-[10px] uppercase font-bold py-0 h-4">
                            {transaction.tipo === "ENVIO" ? "Ganhos" : "Troca"}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {transaction.tipo === "ENVIO" ? `Professor: ${transaction.remetente?.nome}` : `Empresa: ${transaction.vantagem?.empresa?.nome}`}
                          <span className="mx-2">•</span>
                          {new Date(transaction.dataHora).toLocaleDateString("pt-BR", { day: "numeric", month: "long" })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-lg font-black tracking-tight ${
                            transaction.tipo === "ENVIO"
                              ? "text-emerald-600"
                              : "text-rose-600"
                          }`}
                        >
                          {transaction.tipo === "ENVIO" ? "+" : "-"}
                          {transaction.valor}
                        </p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">PUCCoins</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
