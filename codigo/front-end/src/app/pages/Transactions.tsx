import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { 
  Receipt, 
  ArrowDownRight, 
  ArrowUpRight, 
  Download, 
  Calendar, 
  Filter, 
  Search,
  Wallet,
  TrendingUp,
  ShoppingBag,
  History,
  Copy,
  Printer,
  ChevronRight,
  User,
  Clock,
  Store,
  Tag,
  Coins,
  Maximize2,
  QrCode
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { format, startOfMonth, endOfMonth, isWithinInterval, startOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import { fetchApi } from "../services/api";
import { toast } from "sonner";
import QRCode from "react-qr-code";

export function Transactions() {
  const { user } = useAuth();
  const [filterType, setFilterType] = useState<"all" | "receive" | "send" | "redeem">("all");
  const [filterPeriod, setFilterPeriod] = useState<"all" | "month" | "week">("all");
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCoupon, setExpandedCoupon] = useState<any>(null);

  useEffect(() => {
    if (user?.id) {
      setLoading(true);
      let endpoint = `/transacoes/aluno/${user.id}`;
      if (user.role === "professor") {
        endpoint = `/transacoes/professor/${user.id}`;
      }
      
      fetchApi(endpoint)
        .then(setTransactions)
        .catch((err) => {
          console.error("Erro ao carregar transações:", err);
          toast.error("Erro ao carregar transações");
        })
        .finally(() => setLoading(false));
    }
  }, [user]);

  const filteredTransactions = transactions.filter((transaction) => {
    let localType = transaction.tipo === "ENVIO" ? "receive" : "redeem";
    if (user?.role === "professor") {
      localType = "send";
    }

    const typeMatch = filterType === "all" || localType === filterType;

    let periodMatch = true;
    const txDate = new Date(transaction.dataHora);
    const now = new Date();

    if (filterPeriod === "month") {
      periodMatch = isWithinInterval(txDate, {
        start: startOfMonth(now),
        end: endOfMonth(now),
      });
    } else if (filterPeriod === "week") {
      periodMatch = isWithinInterval(txDate, {
        start: startOfWeek(now, { weekStartsOn: 0 }),
        end: now,
      });
    }

    return typeMatch && periodMatch;
  });

  const totalReceived = filteredTransactions
    .filter((t) => t.tipo === "ENVIO" && user?.role === "student")
    .reduce((sum, t) => sum + t.valor, 0);

  const totalSpent = Math.abs(
    filteredTransactions
      .filter((t) => t.tipo === "RESGATE" || user?.role === "professor")
      .reduce((sum, t) => sum + t.valor, 0)
  );

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "receive":
        return (
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600">
            <ArrowDownRight className="w-6 h-6" />
          </div>
        );
      case "send":
      case "redeem":
        return (
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center text-rose-600">
            <ArrowUpRight className="w-6 h-6" />
          </div>
        );
      default:
        return null;
    }
  };

  const groupTransactionsByDate = () => {
    const grouped: Record<string, typeof filteredTransactions> = {};

    filteredTransactions.forEach((transaction) => {
      const dateKey = format(new Date(transaction.dataHora), "yyyy-MM-dd");
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(transaction);
    });

    return Object.entries(grouped).sort(
      ([a], [b]) => new Date(b).getTime() - new Date(a).getTime()
    );
  };

  const copyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Código do cupom copiado!");
  };

  const getCouponUrl = (code: string) => {
    const baseUrl = import.meta.env.VITE_APP_URL || window.location.origin;
    return `${baseUrl}/validar-cupom/${code}`;
  };

  const groupedTransactions = groupTransactionsByDate();

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-950 pb-20">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white dark:bg-gray-900 shadow-xl border border-gray-100 dark:border-gray-800 flex items-center justify-center">
              <Receipt className="w-7 h-7 text-purple-600" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                Extrato <span className="text-purple-600">Financeiro</span>
              </h1>
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                Gestão completa de seus ganhos e resgates acadêmicos.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" className="rounded-xl h-11 px-6 border-gray-200 dark:border-gray-800 bg-white hover:bg-gray-50">
              <Printer className="w-4 h-4 mr-2" />
              Imprimir
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl h-11 px-6 shadow-lg shadow-purple-100 dark:shadow-none transition-all active:scale-95">
              <Download className="w-4 h-4 mr-2" />
              Exportar PDF
            </Button>
          </div>
        </motion.div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-none shadow-xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-white overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <Wallet className="w-24 h-24" />
              </div>
              <CardContent className="pt-8 pb-8 relative z-10">
                <p className="text-indigo-100 text-xs font-black uppercase tracking-widest mb-2 opacity-80">Saldo Disponível</p>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-4xl font-black tabular-nums">{user?.balance}</h2>
                  <span className="text-indigo-200 font-bold">PUCCoins</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
          >
            <Card className="border-none shadow-xl bg-white dark:bg-gray-900 overflow-hidden relative group border-l-4 border-l-emerald-500">
              <CardContent className="pt-8 pb-8">
                <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-2">Entradas no Período</p>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-4xl font-black tabular-nums text-emerald-600">+{totalReceived}</h2>
                  <span className="text-gray-400 font-bold">PUCCoins</span>
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-xs text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-900/10 w-fit px-2 py-1 rounded-lg">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Ganhos acumulados
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-none shadow-xl bg-white dark:bg-gray-900 overflow-hidden relative group border-l-4 border-l-rose-500">
              <CardContent className="pt-8 pb-8">
                <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-2">Saídas no Período</p>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-4xl font-black tabular-nums text-rose-600">-{totalSpent}</h2>
                  <span className="text-gray-400 font-bold">PUCCoins</span>
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-xs text-rose-600 font-bold bg-rose-50 dark:bg-rose-900/10 w-fit px-2 py-1 rounded-lg">
                  <ShoppingBag className="w-3.5 h-3.5" />
                  Resgates efetuados
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card className="border-none shadow-2xl bg-white dark:bg-gray-900 overflow-hidden min-h-[600px] flex flex-col">
            <CardHeader className="border-b border-gray-50 dark:border-gray-800 p-8 space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                  <CardTitle className="text-2xl font-black text-gray-900 dark:text-white">Movimentações</CardTitle>
                  <CardDescription className="text-gray-500 font-medium mt-1">Filtrar por tipo de atividade e data</CardDescription>
                </div>
                
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex bg-gray-100 dark:bg-gray-800 p-1.5 rounded-2xl w-full md:w-auto">
                    {[
                      { id: "all", label: "Todas" },
                      { id: "receive", label: "Ganhos" },
                      { id: "redeem", label: "Resgates" }
                    ].map((btn) => (
                      <button
                        key={btn.id}
                        onClick={() => setFilterType(btn.id as any)}
                        className={`flex-1 md:flex-none px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                          filterType === btn.id 
                          ? "bg-white dark:bg-gray-700 text-purple-600 shadow-md" 
                          : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    {[
                      { id: "all", label: "Sempre" },
                      { id: "month", label: "Mês" },
                      { id: "week", label: "Semana" }
                    ].map((p) => (
                      <Button
                        key={p.id}
                        variant={filterPeriod === p.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilterPeriod(p.id as any)}
                        className={`rounded-xl px-5 border-gray-200 ${filterPeriod === p.id ? "bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-100" : ""}`}
                      >
                        {p.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 p-0 relative">
              <AnimatePresence mode="wait">
                {loading ? (
                  <div className="p-8 space-y-6">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-24 bg-gray-50 dark:bg-gray-800 animate-pulse rounded-2xl" />
                    ))}
                  </div>
                ) : groupedTransactions.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-32 text-center"
                  >
                    <div className="w-24 h-24 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                      <History className="w-12 h-12 text-gray-300" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Sem movimentações</h3>
                    <p className="text-gray-500 max-w-xs font-medium">Não encontramos transações para os filtros aplicados. Tente mudar o período.</p>
                  </motion.div>
                ) : (
                  <div className="divide-y divide-gray-50 dark:divide-gray-800">
                    {groupedTransactions.map(([date, groupTxs], groupIdx) => (
                      <div key={date} className="p-8 space-y-4">
                        <div className="flex items-center gap-3 text-sm font-black uppercase tracking-widest text-gray-400 mb-6">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(date), "EEEE, d 'de' MMMM", { locale: ptBR })}
                        </div>

                        <div className="space-y-4">
                          {groupTxs.map((tx, txIdx) => {
                            const isEarn = tx.tipo === "ENVIO";
                            return (
                              <motion.div
                                key={tx.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: (groupIdx + txIdx) * 0.05 }}
                                className="group flex flex-col md:flex-row md:items-center gap-6 p-6 rounded-[2rem] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-purple-200 dark:hover:border-purple-900/30 hover:shadow-xl transition-all"
                              >
                                {getTransactionIcon(isEarn ? "receive" : "redeem")}

                                <div className="flex-1 space-y-1">
                                  <div className="flex items-center gap-2">
                                    <h4 className="text-lg font-black text-gray-900 dark:text-white group-hover:text-purple-600 transition-colors">
                                      {tx.mensagem || (isEarn ? "Recompensa Acadêmica" : `Resgate de ${tx.vantagem?.titulo}`)}
                                    </h4>
                                    <Badge className={`${isEarn ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"} border-none text-[10px] uppercase font-black px-2`}>
                                      {isEarn ? "Entrada" : "Saída"}
                                    </Badge>
                                  </div>
                                  
                                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 font-medium">
                                    {isEarn ? (
                                      <div className="flex items-center gap-1">
                                        <User className="w-3.5 h-3.5" />
                                        <span>Professor: {tx.remetente?.nome}</span>
                                      </div>
                                    ) : (
                                      <div className="flex items-center gap-1">
                                        <Store className="w-3.5 h-3.5" />
                                        <span>Empresa: {tx.vantagem?.empresa?.nome}</span>
                                      </div>
                                    )}
                                    <div className="flex items-center gap-1">
                                      <Clock className="w-3.5 h-3.5" />
                                      <span>{format(new Date(tx.dataHora), "HH:mm")}</span>
                                    </div>
                                  </div>

                                  {tx.codigoCupom && (
                                    <div className="mt-4 p-4 rounded-2xl bg-purple-50 dark:bg-purple-900/10 flex flex-col sm:flex-row sm:items-center justify-between border border-purple-100 dark:border-purple-900/20 gap-4">
                                      <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm">
                                          <Tag className="w-4 h-4 text-purple-600" />
                                        </div>
                                        <div>
                                          <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Código de Resgate</p>
                                          <p className="font-mono font-black text-purple-700 dark:text-purple-400 text-lg">{tx.codigoCupom}</p>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-4">
                                        <div className="bg-white p-2 rounded-xl shadow-sm border border-purple-100 shrink-0">
                                          <QRCode value={getCouponUrl(tx.codigoCupom)} size={64} />
                                        </div>
                                        <Button 
                                          variant="ghost" 
                                          size="sm" 
                                          className="rounded-xl hover:bg-white text-purple-600"
                                          onClick={() => setExpandedCoupon(tx)}
                                        >
                                          <Maximize2 className="w-4 h-4 mr-2" />
                                          Ampliar
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="rounded-xl hover:bg-white text-purple-600"
                                          onClick={() => copyCoupon(tx.codigoCupom)}
                                        >
                                          <Copy className="w-4 h-4 mr-2" />
                                          Copiar
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-1 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-50 dark:border-gray-800">
                                  <p className={`text-3xl font-black tabular-nums ${isEarn ? "text-emerald-600" : "text-rose-600"}`}>
                                    {isEarn ? "+" : "-"}{tx.valor}
                                  </p>
                                  <div className="flex items-center gap-1 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    <Coins className="w-3 h-3" />
                                    PUCCoins
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Dialog open={!!expandedCoupon} onOpenChange={(open) => !open && setExpandedCoupon(null)}>
        <DialogContent className="sm:max-w-[460px] rounded-[2rem] border-none shadow-2xl">
          {expandedCoupon && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-2xl font-black">
                  <QrCode className="w-6 h-6 text-purple-600" />
                  QR Code de resgate
                </DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center gap-5 py-4">
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                  <QRCode value={getCouponUrl(expandedCoupon.codigoCupom)} size={280} />
                </div>
                <div className="text-center">
                  <p className="text-xs font-black uppercase tracking-widest text-gray-400">Código</p>
                  <p className="font-mono text-2xl font-black text-purple-700">{expandedCoupon.codigoCupom}</p>
                  <p className="mt-2 text-sm text-gray-500 max-w-xs">
                    Ao escanear, a empresa abre a validação do cupom para confirmar a entrega.
                  </p>
                </div>
                <Button className="w-full rounded-xl bg-purple-600 hover:bg-purple-700" onClick={() => copyCoupon(expandedCoupon.codigoCupom)}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar código
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
