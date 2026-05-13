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
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { Badge } from "../../components/ui/badge";
import { fetchApi } from "../../services/api";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function CompanyDashboard() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [benefits, setBenefits] = useState<any[]>([]);
  const [redemptions, setRedemptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      .catch(console.error)
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
                Gestão de <span className="text-indigo-600">Parceria</span>
              </h1>
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium ml-1">
              Gerencie suas ofertas e acompanhe o engajamento dos estudantes.
            </p>
          </div>

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
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Vantagens Ativas", value: benefits.length, icon: Package, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Total de Resgates", value: redemptions.length, icon: Gift, color: "text-indigo-600", bg: "bg-indigo-50" },
            { label: "Moedas Movimentadas", value: redemptions.reduce((acc, r) => acc + (r.valor || 0), 0), icon: Coins, color: "text-amber-600", bg: "bg-amber-50" },
            { label: "Taxa de Conversão", value: "8.4%", icon: Activity, color: "text-emerald-600", bg: "bg-emerald-50" },
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
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="rounded-xl font-bold text-gray-400">Ver Todas</Button>
              </div>
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
                  benefits.map((benefit, idx) => (
                    <motion.div
                      key={benefit.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <Card className="border-none shadow-xl rounded-[2.5rem] bg-white dark:bg-gray-900 overflow-hidden group h-full flex flex-col">
                        <div className="h-40 overflow-hidden relative">
                          <img 
                            src={benefit.fotoUrl} 
                            alt={benefit.titulo}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute top-4 right-4">
                            <Badge className="bg-white/90 backdrop-blur-md text-gray-900 border-none font-black px-3 py-1 shadow-lg">
                              {benefit.custo} PUCC
                            </Badge>
                          </div>
                        </div>
                        <CardContent className="p-6 flex-1">
                          <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2 line-clamp-1">{benefit.titulo}</h3>
                          <p className="text-sm text-gray-500 line-clamp-3 mb-4 leading-relaxed">{benefit.descricao}</p>
                        </CardContent>
                        <CardFooter className="p-6 pt-0 flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1 rounded-xl font-bold h-10">
                            <Edit className="w-4 h-4 mr-2" />
                            Editar
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
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Recent Redemptions */}
          <div className="space-y-6">
            <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-3">
              <Activity className="w-5 h-5 text-indigo-600" />
              Resgates Recentes
            </h2>

            <Card className="border-none shadow-xl bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden">
              <CardContent className="p-6 space-y-4">
                {redemptions.length === 0 ? (
                  <p className="text-center text-sm text-gray-400 py-10">Nenhum resgate registrado.</p>
                ) : (
                  redemptions.slice(0, 6).map((tx, idx) => (
                    <div key={tx.id} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group">
                      <Avatar className="w-10 h-10 border-2 border-transparent group-hover:border-indigo-200 transition-all">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${tx.remetente?.email}`} />
                        <AvatarFallback>{tx.remetente?.nome?.[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{tx.remetente?.nome}</p>
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                          Resgatou {tx.valor} moedas
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          {format(new Date(tx.dataHora), "dd/MM", { locale: ptBR })}
                        </p>
                        <ChevronRight className="w-3 h-3 text-gray-300 ml-auto" />
                      </div>
                    </div>
                  ))
                )}
                {redemptions.length > 6 && (
                  <Button variant="ghost" className="w-full text-xs font-black uppercase tracking-widest text-indigo-600 hover:bg-indigo-50 rounded-xl mt-4">
                    Ver Todos os Resgates
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Performance Card */}
            <Card className="border-none shadow-xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-white rounded-[2.5rem] p-8 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-black">Performance</h4>
              </div>
              <p className="text-sm text-indigo-100 font-medium leading-relaxed mb-6">
                Sua oferta teve boa performance. Continue inovando!
              </p>
              <Button className="w-full bg-white text-indigo-600 hover:bg-white/90 font-black rounded-xl h-12">
                Análise Completa
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
