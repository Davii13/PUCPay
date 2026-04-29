import { useAuth } from "../../context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Coins, TrendingUp, ArrowUpRight, ArrowDownRight, Gift, Eye } from "lucide-react";
import { mockTransactions, mockBenefits } from "../../data/mockData";
import { motion } from "motion/react";
import { Link } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function StudentDashboard() {
  const { user } = useAuth();

  const balanceHistory = [
    { month: "Jan", balance: 800 },
    { month: "Fev", balance: 950 },
    { month: "Mar", balance: 1100 },
    { month: "Abr", balance: 1250 },
  ];

  const recentTransactions = mockTransactions.slice(0, 5);
  const recommendedBenefits = mockBenefits.slice(0, 3);

  const thisMonthEarned = mockTransactions
    .filter((t) => t.type === "receive" && t.date.getMonth() === 3)
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Olá, {user?.name?.split(" ")[0]} 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Bem-vindo de volta ao PUCPAY
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-purple-500 to-purple-700 border-none text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

            <CardContent className="pt-6 relative z-10">
              <div className="flex items-center justify-between mb-2">
                <p className="text-purple-100">Saldo disponível</p>
                <Coins className="w-6 h-6 text-purple-200" />
              </div>
              <div className="flex items-baseline gap-2 mb-6">
                <h2 className="text-5xl font-bold">{user?.balance}</h2>
                <span className="text-2xl font-medium">PUCCoins</span>
              </div>

              <div className="flex items-center gap-2 bg-white/20 rounded-xl p-3 backdrop-blur-sm">
                <TrendingUp className="w-5 h-5" />
                <div className="flex-1">
                  <p className="text-xs text-purple-100">Este mês</p>
                  <p className="font-semibold">+{thisMonthEarned} moedas</p>
                </div>
                <Link to="/transactions">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                  >
                    Ver extrato
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Evolução do saldo</CardTitle>
              <CardDescription>Acompanhe seu crescimento ao longo do tempo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={balanceHistory}>
                    <defs>
                      <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#9333ea" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#9333ea" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        border: "none",
                        borderRadius: "12px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="balance"
                      stroke="#9333ea"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorBalance)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Transações recentes</CardTitle>
                  <CardDescription>Seus últimos movimentos</CardDescription>
                </div>
                <Link to="/transactions">
                  <Button variant="ghost" size="sm">
                    Ver todas
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentTransactions.map((transaction) => (
                  <motion.div
                    key={transaction.id}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === "receive"
                          ? "bg-green-100 dark:bg-green-900/20"
                          : "bg-red-100 dark:bg-red-900/20"
                      }`}
                    >
                      {transaction.type === "receive" ? (
                        <ArrowDownRight className="w-5 h-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5 text-red-600 dark:text-red-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
                        {transaction.description}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {transaction.from || transaction.to}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-semibold ${
                          transaction.type === "receive"
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {transaction.type === "receive" ? "+" : ""}
                        {transaction.amount}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="w-5 h-5" />
                    Vantagens recomendadas
                  </CardTitle>
                  <CardDescription>Resgate seus benefícios</CardDescription>
                </div>
                <Link to="/marketplace">
                  <Button variant="ghost" size="sm">
                    Ver todas
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-3">
                {recommendedBenefits.map((benefit) => (
                  <motion.div
                    key={benefit.id}
                    whileHover={{ scale: 1.02 }}
                    className="flex gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                  >
                    <img
                      src={benefit.image}
                      alt={benefit.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
                        {benefit.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        {benefit.company}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {benefit.cost} moedas
                        </Badge>
                        {benefit.cost <= (user?.balance || 0) && (
                          <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                            Disponível
                          </Badge>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
