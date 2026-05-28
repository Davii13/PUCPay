import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "../../components/ui/dialog";
import {
  Plus,
  Gift,
  Eye,
  Edit,
  Trash2,
  TrendingUp,
  Building2,
  Sparkles,
  Search,
  ChevronRight,
  Package,
  Activity,
  Image as ImageIcon,
  Coins,
  Loader2,
  BarChart3,
  Star,
  Users,
  Calendar,
  ArrowUp,
  Filter,
  Download,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { Badge } from "../../components/ui/badge";
import { fetchApi } from "../../services/api";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export function CompanyDashboard() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [benefits, setBenefits] = useState<any[]>([]);
  const [redemptions, setRedemptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPeriod, setFilterPeriod] = useState("30");
  const [selectedBenefitId, setSelectedBenefitId] = useState<string | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);

  useEffect(() => {
    if (user?.id) {
      setLoading(true);
      Promise.all([
        fetchApi(`/vantagens/empresa/${user.id}`),
        fetchApi(`/transacoes/aluno/${user.id}`)
      ])
      .then(([benefitsData, transactionsData]) => {
        setBenefits(benefitsData);
        const resgates = transactionsData.filter((t: any) => t.tipo === "RESGATE");
        setRedemptions(resgates);
      })
      .catch((err) => {
        console.error("Erro ao carregar dados:", err);
        toast.error("Erro ao carregar dados do dashboard");
      })
      .finally(() => setLoading(false));
    }
  }, [user]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    cost: "",
    category: "",
  });

  const handleCreateBenefit = async () => {
    if (!formData.title || !formData.description || !formData.cost) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        titulo: formData.title,
        descricao: formData.description,
        custo: parseInt(formData.cost),
        fotoUrl: formData.image || "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400",
        empresaId: user?.id
      };

      const newBenefit = await fetchApi("/vantagens", {
        method: "POST",
        body: JSON.stringify(payload)
      });

      setBenefits([newBenefit, ...benefits]);
      toast.success("Vantagem publicada com sucesso! 🎁");

      setFormData({
        title: "",
        description: "",
        image: "",
        cost: "",
        category: "",
      });
      setOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Erro ao publicar vantagem");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBenefit = async (id: string) => {
    try {
      await fetchApi(`/vantagens/${id}`, { method: "DELETE" });
      setBenefits(benefits.filter((b) => b.id.toString() !== id.toString()));
      toast.success("Vantagem removida");
    } catch (error: any) {
      toast.error("Erro ao remover vantagem");
    }
  };

  // Calcular estatísticas
  const benefitStats = benefits.map(benefit => {
    const benefitRedemptions = redemptions.filter((r: any) => r.vantagem?.id === benefit.id);
    const totalRedeemed = benefitRedemptions.reduce((acc: number, r: any) => acc + (r.valor || 0), 0);
    return {
      ...benefit,
      redemptionsCount: benefitRedemptions.length,
      totalRedeemed,
      avgRating: 4.5,
      trend: Math.floor(Math.random() * 30) + 5
    };
  });

  const topBenefits = [...benefitStats].sort((a, b) => b.redemptionsCount - a.redemptionsCount).slice(0, 3);

  const filteredRedemptions = redemptions.filter((r: any) =>
    r.remetente?.nome?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = redemptions.reduce((acc, r) => acc + (r.valor || 0), 0);
  const avgRedemptionValue = redemptions.length > 0 ? Math.round(totalRevenue / redemptions.length) : 0;

  // Dados para gráficos
  const selectedBenefit = benefits.find(b => b.id.toString() === selectedBenefitId?.toString());
  const benefitRedemptions = selectedBenefit ? redemptions.filter((r: any) => r.vantagem?.id === selectedBenefit.id) : [];

  const dailyData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const count = benefitRedemptions.filter((r: any) => {
      const resDate = new Date(r.dataHora);
      return resDate.toDateString() === date.toDateString();
    }).length;
    return {
      name: format(date, "EEE", { locale: ptBR }),
      resgates: count,
      moedas: count * (selectedBenefit?.custo || 0)
    };
  });

  const chartData = [
    { name: "Resgates", value: benefitRedemptions.length, fill: "#6366f1" },
    { name: "Não Resgatadas", value: Math.max(0, 100 - benefitRedemptions.length), fill: "#e5e7eb" }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-950 pb-20">
      <div className="max-w-7xl mx-auto p-6 space-y-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                Dashboard de <span className="text-indigo-600">Parcerias</span>
              </h1>
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium ml-1">
              Acompanhe suas ofertas, resgates e análise de performance em tempo real.
            </p>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="h-14 px-6 rounded-2xl border-gray-200 font-bold gap-2">
              <Download className="w-5 h-5" />
              Relatório
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="h-14 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-xl shadow-indigo-100 dark:shadow-none transition-all active:scale-95 group">
                  <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
                  Nova Vantagem
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] rounded-[2.5rem] p-8 border-none shadow-2xl overflow-hidden">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-black text-gray-900 dark:text-white">Criar Nova Vantagem</DialogTitle>
                  <DialogDescription className="text-gray-500 font-medium">
                    Preencha os detalhes da oferta que será exibida no marketplace.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Título da Oferta</Label>
                      <Input
                        placeholder="Ex: 50% de Desconto em Café"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="h-12 rounded-xl border-gray-100 dark:border-gray-800 bg-gray-50/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Custo em PUCCoins</Label>
                      <div className="relative">
                        <Coins className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
                        <Input
                          type="number"
                          placeholder="Ex: 100"
                          value={formData.cost}
                          onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                          className="h-12 pl-10 rounded-xl border-gray-100 dark:border-gray-800 bg-gray-50/50 font-bold"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase tracking-widest text-gray-400">URL da Imagem</Label>
                      <div className="relative">
                        <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          placeholder="https://..."
                          value={formData.image}
                          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                          className="h-12 pl-10 rounded-xl border-gray-100 dark:border-gray-800 bg-gray-50/50"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Descrição Detalhada</Label>
                      <Textarea
                        placeholder="Descreva as condições do benefício..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="min-h-[200px] rounded-xl border-gray-100 dark:border-gray-800 bg-gray-50/50 resize-none"
                      />
                    </div>
                  </div>
                </div>

                <DialogFooter className="gap-2">
                  <Button variant="ghost" onClick={() => setOpen(false)} className="rounded-xl h-12 px-6 font-bold text-gray-500">
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleCreateBenefit}
                    disabled={isSubmitting}
                    className="flex-1 rounded-xl h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-lg"
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Publicar Vantagem"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {[
            { label: "Vantagens Ativas", value: benefits.length, icon: Package, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Total de Resgates", value: redemptions.length, icon: Gift, color: "text-indigo-600", bg: "bg-indigo-50" },
            { label: "Moedas Movimentadas", value: totalRevenue, icon: Coins, color: "text-amber-600", bg: "bg-amber-50" },
            { label: "Valor Médio", value: avgRedemptionValue, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Alunos Engajados", value: new Set(redemptions.map((r: any) => r.remetente?.id)).size, icon: Users, color: "text-rose-600", bg: "bg-rose-50" },
          ].map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="border-none shadow-xl rounded-[2rem] bg-white dark:bg-gray-900 overflow-hidden group">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{stat.label}</p>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white">{stat.value}</h3>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Benefits */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                <Package className="w-6 h-6 text-indigo-600" />
                Vantagens em Vigor
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence mode="popLayout">
                {loading ? (
                  [1, 2].map(i => <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-[2rem]" />)
                ) : benefits.length === 0 ? (
                  <Card className="col-span-full border-none shadow-xl bg-white dark:bg-gray-900 rounded-[2.5rem] py-20 text-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Gift className="w-10 h-10 text-gray-300" />
                    </div>
                    <h3 className="text-xl font-bold">Nenhuma oferta ativa</h3>
                    <p className="text-gray-500">Crie sua primeira vantagem para aparecer no marketplace.</p>
                  </Card>
                ) : (
                  benefits.map((benefit, idx) => {
                    const stats = benefitStats.find(s => s.id === benefit.id);
                    const isTop = topBenefits.some(b => b.id === benefit.id);
                    return (
                      <motion.div
                        key={benefit.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <Card className={`border-none shadow-xl rounded-[2.5rem] overflow-hidden group h-full flex flex-col transition-all ${isTop ? 'ring-2 ring-amber-400' : 'bg-white dark:bg-gray-900'}`}>
                          {isTop && (
                            <div className="h-1 bg-gradient-to-r from-amber-400 to-amber-500" />
                          )}
                          <div className="h-40 overflow-hidden relative">
                            <img
                              src={benefit.fotoUrl}
                              alt={benefit.titulo}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute top-4 right-4 flex gap-2">
                              {isTop && (
                                <Badge className="bg-amber-400 text-gray-900 border-none font-black px-3 py-1 shadow-lg flex items-center gap-1">
                                  <Star className="w-3 h-3 fill-current" />
                                  Top
                                </Badge>
                              )}
                              <Badge className="bg-white/90 backdrop-blur-md text-gray-900 border-none font-black px-3 py-1 shadow-lg">
                                {benefit.custo} PUCC
                              </Badge>
                            </div>
                          </div>
                          <CardContent className="p-6 flex-1">
                            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2 line-clamp-1">{benefit.titulo}</h3>
                            <p className="text-sm text-gray-500 line-clamp-3 mb-4 leading-relaxed">{benefit.descricao}</p>

                            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                              <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase text-gray-400">Resgates</p>
                                <p className="text-lg font-black text-gray-900 dark:text-white">{stats?.redemptionsCount || 0}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase text-gray-400">Avaliação</p>
                                <div className="flex items-center gap-1">
                                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                  <p className="text-lg font-black text-gray-900 dark:text-white">{stats?.avgRating}</p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="p-6 pt-0 flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 rounded-xl font-bold h-10"
                              onClick={() => {
                                setSelectedBenefitId(benefit.id);
                                setShowAnalysis(true);
                              }}
                            >
                              <BarChart3 className="w-4 h-4 mr-2" />
                              Análise
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="rounded-xl h-10 w-10 text-rose-500 hover:bg-rose-50 hover:text-rose-600"
                              onClick={() => handleDeleteBenefit(benefit.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Top Benefits */}
            <Card className="border-none shadow-xl bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden">
              <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <CardTitle className="font-black">Mais Resgatadas</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {topBenefits.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-6">Nenhum resgate ainda</p>
                ) : (
                  topBenefits.map((benefit, idx) => (
                    <div key={benefit.id} className="flex items-start gap-3 p-3 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm">
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{benefit.titulo}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Gift className="w-3 h-3 text-indigo-600" />
                          <p className="text-[10px] font-black text-gray-500 uppercase">{benefit.redemptionsCount} resgates</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-emerald-600 font-bold text-sm">
                        <ArrowUp className="w-3 h-3" />
                        {benefit.trend}%
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Recent Redemptions */}
            <Card className="border-none shadow-xl bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden">
              <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-indigo-600" />
                  <CardTitle className="font-black">Resgates Recentes</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-3">
                {filteredRedemptions.length === 0 ? (
                  <p className="text-center text-sm text-gray-400 py-8">Nenhum resgate registrado.</p>
                ) : (
                  filteredRedemptions.slice(0, 5).map((tx, idx) => (
                    <div key={tx.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group">
                      <Avatar className="w-8 h-8 border-2 border-transparent group-hover:border-indigo-200">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${tx.remetente?.email}`} />
                        <AvatarFallback>{tx.remetente?.nome?.[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{tx.remetente?.nome}</p>
                        <p className="text-[9px] text-gray-400 uppercase">-{tx.valor} moedas</p>
                      </div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase whitespace-nowrap">
                        {format(new Date(tx.dataHora), "dd/MM", { locale: ptBR })}
                      </p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Performance Highlight */}
            <Card className="border-none shadow-xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-white rounded-[2.5rem] p-6 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-5 h-5" />
                  <h4 className="font-black">Performance</h4>
                </div>
                <p className="text-sm text-indigo-100 font-medium leading-relaxed mb-4">
                  Você está no topo! {topBenefits.length} vantagens em alta demanda.
                </p>
                <Button className="w-full bg-white text-indigo-600 hover:bg-white/90 font-black rounded-xl h-10 text-sm">
                  Ver Relatório
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Analysis Modal */}
        <AnimatePresence>
          {showAnalysis && selectedBenefit && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowAnalysis(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 p-8 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white">Análise Detalhada</h2>
                    <p className="text-sm text-gray-500 mt-1">{selectedBenefit.titulo}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-xl h-10 w-10"
                    onClick={() => setShowAnalysis(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <div className="p-8 space-y-8">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                      {
                        label: "Total de Resgates",
                        value: benefitRedemptions.length,
                        icon: Gift,
                        color: "bg-indigo-50 text-indigo-600"
                      },
                      {
                        label: "Moedas Geradas",
                        value: benefitRedemptions.length * selectedBenefit.custo,
                        icon: Coins,
                        color: "bg-amber-50 text-amber-600"
                      },
                      {
                        label: "Taxa de Conversão",
                        value: `${Math.round((benefitRedemptions.length / (benefitRedemptions.length + 10)) * 100)}%`,
                        icon: TrendingUp,
                        color: "bg-emerald-50 text-emerald-600"
                      },
                      {
                        label: "Avaliação Média",
                        value: "4.5 ⭐",
                        icon: Star,
                        color: "bg-rose-50 text-rose-600"
                      }
                    ].map((metric) => (
                      <div key={metric.label} className={`${metric.color} p-4 rounded-2xl`}>
                        <p className="text-xs font-black uppercase tracking-widest opacity-75 mb-2">{metric.label}</p>
                        <p className="text-2xl font-black">{metric.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Charts */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Line Chart */}
                    <Card className="border-none shadow-lg rounded-[2rem]">
                      <CardHeader>
                        <CardTitle className="text-lg font-black">Resgates por Dia</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={dailyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="name" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "#1f2937",
                                border: "none",
                                borderRadius: "12px",
                                color: "#fff"
                              }}
                            />
                            <Line
                              type="monotone"
                              dataKey="resgates"
                              stroke="#6366f1"
                              strokeWidth={2}
                              dot={{ fill: "#6366f1", r: 4 }}
                              activeDot={{ r: 6 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    {/* Pie Chart */}
                    <Card className="border-none shadow-lg rounded-[2rem]">
                      <CardHeader>
                        <CardTitle className="text-lg font-black">Taxa de Conversão</CardTitle>
                      </CardHeader>
                      <CardContent className="flex items-center justify-center">
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={chartData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={100}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => `${value}%`} />
                          </PieChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recent Redemptions */}
                  <Card className="border-none shadow-lg rounded-[2rem]">
                    <CardHeader>
                      <CardTitle className="text-lg font-black">Últimos Resgates</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {benefitRedemptions.length === 0 ? (
                          <p className="text-center text-gray-400 py-8">Nenhum resgate registrado</p>
                        ) : (
                          benefitRedemptions.slice(0, 5).map((redemption: any, idx: number) => (
                            <div
                              key={redemption.id}
                              className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                              <Avatar className="w-10 h-10">
                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${redemption.remetente?.email}`} />
                                <AvatarFallback>{redemption.remetente?.nome?.[0]}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <p className="font-bold text-gray-900 dark:text-white">{redemption.remetente?.nome}</p>
                                <p className="text-sm text-gray-500">{redemption.remetente?.email}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-black text-indigo-600">-{redemption.valor} PUCC</p>
                                <p className="text-xs text-gray-400">{format(new Date(redemption.dataHora), "dd/MM/yyyy", { locale: ptBR })}</p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Action Button */}
                  <div className="flex gap-3">
                    <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl h-12">
                      <Download className="w-4 h-4 mr-2" />
                      Exportar Relatório
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 rounded-xl h-12 font-bold"
                      onClick={() => setShowAnalysis(false)}
                    >
                      Fechar
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
