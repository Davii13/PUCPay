import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { mockTransactions } from "../data/mockData";
import { Receipt, ArrowDownRight, ArrowUpRight, Download, Filter, Calendar } from "lucide-react";
import { motion } from "motion/react";
import { format, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import { ptBR } from "date-fns/locale";

export function Transactions() {
  const { user } = useAuth();
  const [filterType, setFilterType] = useState<"all" | "receive" | "send" | "redeem">("all");
  const [filterPeriod, setFilterPeriod] = useState<"all" | "month" | "week">("all");

  const filteredTransactions = mockTransactions.filter((transaction) => {
    const typeMatch = filterType === "all" || transaction.type === filterType;

    let periodMatch = true;
    if (filterPeriod === "month") {
      const now = new Date();
      periodMatch = isWithinInterval(transaction.date, {
        start: startOfMonth(now),
        end: endOfMonth(now),
      });
    } else if (filterPeriod === "week") {
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      periodMatch = transaction.date >= weekAgo;
    }

    return typeMatch && periodMatch;
  });

  const totalReceived = filteredTransactions
    .filter((t) => t.type === "receive")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSpent = Math.abs(
    filteredTransactions
      .filter((t) => t.type === "redeem")
      .reduce((sum, t) => sum + t.amount, 0)
  );

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "receive":
        return (
          <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
            <ArrowDownRight className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
        );
      case "send":
      case "redeem":
        return (
          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <ArrowUpRight className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
        );
      default:
        return null;
    }
  };

  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case "receive":
        return "Recebimento";
      case "send":
        return "Envio";
      case "redeem":
        return "Resgate";
      default:
        return "";
    }
  };

  const groupTransactionsByDate = () => {
    const grouped: Record<string, typeof filteredTransactions> = {};

    filteredTransactions.forEach((transaction) => {
      const dateKey = format(transaction.date, "yyyy-MM-dd");
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(transaction);
    });

    return Object.entries(grouped).sort(
      ([a], [b]) => new Date(b).getTime() - new Date(a).getTime()
    );
  };

  const groupedTransactions = groupTransactionsByDate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
              <Receipt className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Extrato
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Acompanhe todas as suas transações
              </p>
            </div>
          </div>

          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Saldo atual
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {user?.balance}
                </p>
                <p className="text-sm text-gray-500 mt-1">PUCCoins</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
          >
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Total recebido
                </p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  +{totalReceived}
                </p>
                <p className="text-sm text-gray-500 mt-1">no período</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Total gasto
                </p>
                <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                  -{totalSpent}
                </p>
                <p className="text-sm text-gray-500 mt-1">no período</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Histórico de transações</CardTitle>
                  <CardDescription>
                    {filteredTransactions.length} transações encontradas
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Tabs value={filterType} onValueChange={(v: any) => setFilterType(v)} className="flex-1">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="all">Todas</TabsTrigger>
                    <TabsTrigger value="receive">Recebimentos</TabsTrigger>
                    <TabsTrigger value="redeem">Resgates</TabsTrigger>
                    <TabsTrigger value="send">Envios</TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="flex gap-2">
                  <Button
                    variant={filterPeriod === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterPeriod("all")}
                    className={
                      filterPeriod === "all" ? "bg-purple-600" : ""
                    }
                  >
                    Tudo
                  </Button>
                  <Button
                    variant={filterPeriod === "month" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterPeriod("month")}
                    className={
                      filterPeriod === "month" ? "bg-purple-600" : ""
                    }
                  >
                    Mês
                  </Button>
                  <Button
                    variant={filterPeriod === "week" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterPeriod("week")}
                    className={
                      filterPeriod === "week" ? "bg-purple-600" : ""
                    }
                  >
                    Semana
                  </Button>
                </div>
              </div>

              <div className="space-y-6">
                {groupedTransactions.map(([date, transactions]) => (
                  <div key={date} className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(date), "EEEE, d 'de' MMMM 'de' yyyy", {
                        locale: ptBR,
                      })}
                    </div>

                    {transactions.map((transaction) => (
                      <motion.div
                        key={transaction.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-start gap-4 p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow"
                      >
                        {getTransactionIcon(transaction.type)}

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 dark:text-white">
                                {transaction.description}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                                {transaction.from && `De: ${transaction.from}`}
                                {transaction.to && `Para: ${transaction.to}`}
                              </p>
                            </div>
                            <div className="text-right">
                              <p
                                className={`font-bold text-lg ${
                                  transaction.type === "receive"
                                    ? "text-green-600 dark:text-green-400"
                                    : "text-red-600 dark:text-red-400"
                                }`}
                              >
                                {transaction.type === "receive" ? "+" : ""}
                                {transaction.amount}
                              </p>
                              <Badge variant="secondary" className="mt-1">
                                {getTransactionTypeLabel(transaction.type)}
                              </Badge>
                            </div>
                          </div>

                          {transaction.message && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 italic mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              "{transaction.message}"
                            </p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ))}

                {filteredTransactions.length === 0 && (
                  <div className="text-center py-12">
                    <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      Nenhuma transação encontrada
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                      Tente ajustar os filtros
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
